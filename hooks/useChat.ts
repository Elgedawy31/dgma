import { useCallback, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { userContext } from "@UserContext";
import { useSocket } from "./useSocket";
import { useMessages } from "./useMessages";
import { RawMessage, ForwardDestination } from "../models/types";

const LOADING_TIMEOUT = 8000; // 8 seconds timeout
const MESSAGES_PER_PAGE = 100000000;

interface MessageNotification {
  message: RawMessage;
  conversationType: string;
  conversationId: string;
  sender: {
    _id: string;
    name: {
      first: string;
      last: string;
    };
    avatar?: string;
  };
}

export const useChat = (conversationType: string, conversationId: string) => {
  const {
    user: { id: signedUserID, avatar: userAvatar },
  } = useContext(userContext);

  const [hasReceivedMessages, setHasReceivedMessages] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialFetchRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    messages,
    chatInfo,
    handleNewMessage,
    handleMessagesReceived,
    handleMessagesSeen,
    addTempMessage,
    formatMessageTime,
  } = useMessages(signedUserID, userAvatar || "");

  // Handle new message from socket
  const onNewMessage = useCallback(
    (message: RawMessage) => {
      console.log("New message received in chat:", {
        messageId: message.id || message._id,
        senderId: message.senderId?._id || message.sender_id?._id,
        content: message.content?.substring(0, 20),
        timestamp: Date.now(),
      });

      handleNewMessage(message);
      setHasReceivedMessages(true);
    },
    [handleNewMessage]
  );

  // Handle messages received from socket
  const onMessagesReceived = useCallback(
    (receivedMessages: RawMessage[], pagination: any) => {
      console.log("Messages received in chat:", {
        count: receivedMessages?.length,
        hasInitialFetch: initialFetchRef.current,
        isJoined,
        timestamp: Date.now(),
        pagination
      });

      // Clear loading timeout since we received a response
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      if (receivedMessages?.length > 0) {
        handleMessagesReceived(receivedMessages, pagination);
        setHasReceivedMessages(true);
        initialFetchRef.current = true;
      } else {
        console.log("No messages in response");
        // If we got an empty response, still mark as received to stop loading
        setHasReceivedMessages(true);
        initialFetchRef.current = true;
      }
      setIsLoadingMore(false);
    },
    [handleMessagesReceived, isJoined]
  );

  // Handle message notification
  const onMessageNotification = useCallback(({ message, conversationType: notifType, conversationId: notifId }: MessageNotification) => {
    // Only process if it's for this conversation
    if (notifType === conversationType && notifId === conversationId) {
      console.log("Processing notification message for current chat:", {
        messageId: message.id || message._id,
        content: message.content?.substring(0, 20),
        timestamp: Date.now(),
      });
      handleNewMessage(message);
    }
  }, [conversationType, conversationId, handleNewMessage]);

  // Handle successful join
  const onJoinSuccess = useCallback(() => {
    console.log("Successfully joined conversation");
    setIsJoined(true);
    
    // Always fetch initial messages after joining
    console.log("Triggering initial message fetch after join");
    fetchMessages(1, MESSAGES_PER_PAGE);
  }, []);

  const { isSocketConnected, sendMessage, fetchMessages, error } = useSocket(
    conversationType,
    conversationId,
    signedUserID,
    onNewMessage,
    onMessagesReceived,
    (messageIds: string[], userId: string) => handleMessagesSeen({ messageIds, userId }),
    onJoinSuccess,
    onMessageNotification
  );

  // Set a timeout to stop showing loading state if messages aren't received
  useEffect(() => {
    if (isSocketConnected && !hasReceivedMessages && isJoined) {
      console.log("Starting loading timeout");
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Set new timeout
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("Loading timeout reached, forcing loading state to end");
        setHasReceivedMessages(true);
        initialFetchRef.current = true;
      }, LOADING_TIMEOUT);
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isSocketConnected, hasReceivedMessages, isJoined]);

  // Reset states when conversation changes
  useEffect(() => {
    console.log("Conversation changed, resetting states:", {
      conversationType,
      conversationId,
      timestamp: Date.now(),
    });
    setHasReceivedMessages(false);
    setIsJoined(false);
    initialFetchRef.current = false;
    setIsLoadingMore(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  }, [conversationType, conversationId]);

  // Handle sending messages
  const handleSendMessage = useCallback(
    (content: string, attachments: string[] = [], special: boolean = false, replyToId?: string) => {
      if (!content.trim() || !isSocketConnected || !isJoined) {
        console.log("Cannot send message:", {
          hasContent: !!content.trim(),
          isSocketConnected,
          isJoined,
          timestamp: Date.now(),
        });
        return;
      }

      let messageData: any = {
        content,
        attachments,
        special
      };

      if (replyToId) {
        messageData.replyTo = replyToId;
      }

      if (conversationType === "dm") {
        if (conversationId === signedUserID) {
          messageData.receiverId = signedUserID;
        } else {
          const [, userId1, userId2] = conversationId?.split("_");
          const receiverId = userId1 === signedUserID ? userId2 : userId1;
          messageData.receiverId = receiverId;
        }
      } else {
        if (conversationType === "channel") {
          messageData.channelId = conversationId;
        } else if (conversationType === "group") {
          messageData.groupId = conversationId;
        }
      }

      console.log("Sending message:", {
        content: content.substring(0, 20) + (content.length > 20 ? "..." : ""),
        attachments,
        special,
        replyToId,
        type: conversationType,
        timestamp: Date.now(),
      });

      // Add temporary message first for immediate UI feedback
      addTempMessage(content, attachments, special, replyToId);
      // Then send the actual message
      sendMessage(messageData);
    },
    [conversationType, conversationId, signedUserID, isSocketConnected, isJoined, sendMessage, addTempMessage]
  );

  // Handle forwarding messages
  const handleForwardMessage = useCallback(
    (message: RawMessage, destination: ForwardDestination) => {
      if (!isSocketConnected || !isJoined) {
        console.log("Cannot forward message: not connected or joined");
        return;
      }

      let messageData: any = {
        content: message.content,
        attachments: message.attachments || [],
        forwardedFrom: {
          id: message.senderId?._id || message.sender_id?._id,
          name: message.senderId?.name || message.sender_id?.name,
          avatar: message.senderId?.avatar || message.sender_id?.avatar
        }
      };

      if (destination.type === 'user') {
        messageData.receiverId = destination.id;
      } else if (destination.type === 'channel') {
        messageData.channelId = destination.id;
      } else {
        messageData.groupId = destination.id;
      }

      console.log("Forwarding message:", {
        messageId: message.id || message._id,
        destinationType: destination.type,
        destinationId: destination.id,
        timestamp: Date.now(),
      });

      sendMessage(messageData);
    },
    [isSocketConnected, isJoined, sendMessage]
  );

  // Handle loading more messages
  const handleLoadMore = useCallback(() => {
    if (!chatInfo.fullyLoaded && isSocketConnected && isJoined && !isLoadingMore) {
      console.log('Loading more messages' , chatInfo)
      const nextPage = (chatInfo.lastLoadedPage || 0) + 1;
      setIsLoadingMore(true);
      fetchMessages(nextPage, MESSAGES_PER_PAGE); 
    }
  }, [chatInfo, isSocketConnected, isJoined, fetchMessages, messages.length, isLoadingMore]);

  useEffect(() => {
    console.log("Chat state:", {
      isSocketConnected,
      isJoined,
      hasReceivedMessages,
      messagesCount: messages.length,
      isLoading: !hasReceivedMessages || !isSocketConnected || !isJoined,
      error,
      timestamp: Date.now(),
    });
  }, [isSocketConnected, isJoined, hasReceivedMessages, messages.length, error]);

  return {
    messages,
    chatInfo,
    isSocketConnected,
    signedUserID,
    formatMessageTime,
    handleSendMessage,
    handleForwardMessage,
    handleLoadMore,
    isLoading: !hasReceivedMessages || !isSocketConnected || !isJoined,
    error,
  };
};
