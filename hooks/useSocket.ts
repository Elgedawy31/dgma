// import { SERVER_URL } from '@env';

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useSecureStorage from "./useSecureStorage";
import { RawMessage } from "../models/types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const MESSAGES_PER_PAGE = 10;

interface MessageNotification {
  message: RawMessage;
  conversationType: string;
  conversationId: string;
  sender: {
    _id: string;
    avatar?: string;
    name: { first: string; last: string; };
  };
}

export const useSocket = (
  conversationType: string,
  conversationId: string,
  signedUserID: string,
  onNewMessage: (message: RawMessage) => void,
  onMessagesReceived: (messages: RawMessage[], pagination: any) => void,
  onMessagesSeen: (messageIds: string[], userId: string) => void,
  onJoinSuccess?: () => void,
  onMessageNotification?: (notification: MessageNotification) => void
) => {
  const socket = useRef<Socket | null>(null);
  const { readStorage: readToken } = useSecureStorage();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const retryCount = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const joinedRoomRef = useRef(false);
  const SERVER_URL = 'http://192.168.1.71:5001'


  const joinConversation = () => {
    if (!socket.current || !isConnected || joinedRoomRef.current) return;

    console.log("Joining conversation:", { conversationType, conversationId });
    socket.current.emit("joinConversation", {
      conversationType,
      conversationId
    });
    joinedRoomRef.current = true;
    onJoinSuccess?.();

    // Fetch initial messages when joining
    fetchMessages(1, MESSAGES_PER_PAGE);
  };

  const connectSocket = async () => {
    try {
      console.log("Attempting to retrieve token...");
      const token = await readToken<string>("token");
      console.log("Token retrieved:", token ? "Found" : "Not found");

      if (!token) {
        console.log("No token found");
        setError("Authentication required. Please log in again.");
        return;
      }

      connectWithToken(token);
    } catch (err) {
      console.log("Token retrieval error:", err);
      setError("Failed to retrieve authentication token");
      handleConnectionError();
    }
  };

  const connectWithToken = (token: string) => {
    // Clean up existing socket if any
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }

    console.log("Connecting to socket at:", SERVER_URL);
    joinedRoomRef.current = false;

    socket.current = io(SERVER_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: MAX_RETRIES,
      reconnectionDelay: RETRY_DELAY,
      timeout: 10000,
      transports: ['websocket', 'polling']
    });

    socket.current.on("connect", () => {
      console.log("Socket connected successfully");
      setIsConnected(true);
      setError(null);
      retryCount.current = 0;
      joinConversation();
    });

    socket.current.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
      setError(`Connection error: ${err.message}`);
      handleConnectionError();
    });

    // Handle new messages in current conversation
    socket.current.on("newMessage", (message: RawMessage) => {
      console.log("New message received:", message, [message.id || message._id]);
      if (typeof message === 'object' && message !== null) {
        onNewMessage(message);
        // Mark new messages as seen
        socket.current?.emit("messagesSeen", {
          messageIds: [message.id || message._id],
          userId: signedUserID
        });
      }
    });

    // Handle message notifications (for all conversations)
    socket.current.on("messageNotification", (notification: MessageNotification) => {
      console.log(
        `Message notification in ${notification.conversationType}~ ${notification.conversationId} from ${JSON.stringify(notification.sender)}:`,
        notification.message.content
      );

      // Only process notification if sender is not the current user
      if (notification.sender._id !== signedUserID) {
        // If this is for the current conversation, process it as a new message
        if (notification.conversationType === conversationType && notification.conversationId === conversationId) {
          onNewMessage(notification.message);
          // Mark as seen since we're in this conversation
          socket.current?.emit("messagesSeen", {
            messageIds: [notification.message.id || notification.message._id],
            userId: signedUserID
          });
        }

        // Call the notification handler if provided
        if (onMessageNotification) {
          onMessageNotification(notification);
        }
      }
    });

    // Handle fetched messages
    socket.current.on("messages", ({ messages, pagination, conversationId: msgConvId, conversationType: msgConvType }) => {
      console.log("Fetched Messages:", {
        messageCount: messages?.length,
        pagination,
        conversationId: msgConvId,
        conversationType: msgConvType,
        currentPage: pagination?.currentPage
      });

      // Update pagination state
      if (pagination) {
        setHasMoreMessages(pagination.hasMore || false);
        setCurrentPage(pagination.currentPage || 1);
      }

      onMessagesReceived(messages || [], pagination);
    });

    // Handle messages seen
    socket.current.on("messagesSeen", ({ messageIds, userId }) => {
      console.log(`Messages ${messageIds} have been seen by user ${userId}`);
      onMessagesSeen(messageIds, userId);
    });

    // Handle unseen messages
    socket.current.on("unseenMessages", ({ messages, conversationId: unseenConvId, conversationType: unseenConvType }) => {
      console.log("Unseen Messages:", {
        messages,
        conversationId: unseenConvId,
        conversationType: unseenConvType
      });

      if (messages && messages.length > 0) {
        onMessagesReceived(messages, {
          currentPage: 1,
          hasMore: true
        });
        // Mark messages as seen
        const messageIds = messages.map((message: RawMessage) => message.id || message._id);
        socket.current?.emit("messagesSeen", {
          messageIds,
          userId: signedUserID
        });
        console.log("Marked messages as seen:", messageIds);
      }
    });

    // Handle errors from server
    socket.current.on("errorMessage", ({ error: serverError }) => {
      console.error("Error from server:", serverError);
      setError(serverError);
    });

    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      joinedRoomRef.current = false;
    });

    socket.current.on("reconnect", () => {
      console.log("Socket reconnected");
      joinConversation();
    });
  };

  const handleConnectionError = () => {
    if (retryCount.current < MAX_RETRIES) {
      retryCount.current += 1;
      console.log(`Retrying connection (${retryCount.current}/${MAX_RETRIES})...`);

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      retryTimeoutRef.current = setTimeout(() => {
        connectSocket();
      }, RETRY_DELAY);
    } else {
      console.log("Max retry attempts reached");
      setError("Failed to connect after multiple attempts");
    }
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socket.current) {
        // Clean up all event listeners
        socket.current.off("connect");
        socket.current.off("connect_error");
        socket.current.off("newMessage");
        socket.current.off("messageNotification");
        socket.current.off("messages");
        socket.current.off("messagesSeen");
        socket.current.off("unseenMessages");
        socket.current.off("errorMessage");
        socket.current.off("disconnect");
        socket.current.off("reconnect");
        socket.current.disconnect();
      }
      joinedRoomRef.current = false;
    };
  }, [conversationId, conversationType]);

  // Re-join conversation if connection is restored
  useEffect(() => {
    if (isConnected && !joinedRoomRef.current) {
      joinConversation();
    }
  }, [isConnected, conversationId, conversationType]);

  const sendMessage = (messageData: any) => {
    if (socket.current && isConnected) {
      console.log("Sending message:", messageData);
      socket.current.emit("sendMessage", messageData);
    }
  };

  const fetchMessages = (page: number = 1, limit: number = MESSAGES_PER_PAGE) => {
    if (socket.current && isConnected) {
      console.log("Fetching messages:", { page, limit, conversationType, conversationId });
      socket.current.emit("fetchMessages", {
        conversationType,
        conversationId,
        page,
        limit,
      });
    }
  };

  const loadMoreMessages = () => {
    const nextPage = currentPage + 1;
    console.log("Loading more messages:", { nextPage, currentPage });
    fetchMessages(nextPage, MESSAGES_PER_PAGE);
  };

  return {
    isSocketConnected: isConnected,
    sendMessage,
    fetchMessages,
    loadMoreMessages,
    hasMoreMessages,
    error
  };
};
