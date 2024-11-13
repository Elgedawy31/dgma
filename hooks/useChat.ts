import { useCallback, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { userContext } from "@UserContext";
import { useSocket } from "./useSocket";
import { useMessages } from "./useMessages";
import { RawMessage } from "../types";

export const useChat = (conversationType: string, conversationId: string) => {
  const {
    user: { id: signedUserID, avatar: userAvatar },
  } = useContext(userContext);

  const [hasReceivedMessages, setHasReceivedMessages] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialFetchRef = useRef(false);

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
        timestamp: Date.now(),
      });
      handleNewMessage(message);
    },
    [handleNewMessage]
  );

  // Handle messages received from socket
  const onMessagesReceived = useCallback(
    (receivedMessages: RawMessage[], pagination: any) => {
      console.log("Messages received in chat:", {
        count: receivedMessages?.length,
        hasInitialFetch: initialFetchRef.current,
        timestamp: Date.now(),
      });

      if (receivedMessages?.length > 0) {
        handleMessagesReceived(receivedMessages, pagination);
        setHasReceivedMessages(true);
        initialFetchRef.current = true;
      } else {
        console.log("No messages in response");
        // If we got an empty response, still mark as received to stop loading
        setHasReceivedMessages(true);
      }
    },
    [handleMessagesReceived]
  );

  const { isSocketConnected, sendMessage, fetchMessages } = useSocket(
    conversationType,
    conversationId,
    signedUserID,
    onNewMessage,
    onMessagesReceived,
    (messageIds: string[], userId: string) => handleMessagesSeen({ messageIds, userId })
  );

  // Set a timeout to stop showing loading state if messages aren't received
  useEffect(() => {
    if (isSocketConnected && !hasReceivedMessages) {
      console.log("Starting loading timeout");
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("Loading timeout reached, forcing loading state to end");
        setHasReceivedMessages(true);
      }, 5000); // 5 seconds timeout
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isSocketConnected, hasReceivedMessages]);

  // Reset states when conversation changes
  useEffect(() => {
    console.log("Conversation changed, resetting states:", {
      conversationType,
      conversationId,
      timestamp: Date.now(),
    });
    setHasReceivedMessages(false);
    initialFetchRef.current = false;
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  }, [conversationType, conversationId]);

  // Handle sending messages
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !isSocketConnected) {
        console.log("Cannot send message:", {
          hasContent: !!content.trim(),
          isSocketConnected,
          timestamp: Date.now(),
        });
        return;
      }

      let messageData;

      if (conversationType === "dm") {
        if (conversationId === signedUserID) {
          messageData = {
            content,
            receiverId: signedUserID,
            attachments: [],
          };
        } else {
          const [, userId1, userId2] = conversationId.split("_");
          const receiverId = userId1 === signedUserID ? userId2 : userId1;
          messageData = {
            content,
            receiverId,
            attachments: [],
          };
        }
      } else {
        messageData = {
          content,
          ...(conversationType === "channel" && { channelId: conversationId }),
          ...(conversationType === "group" && { groupId: conversationId }),
          attachments: [],
        };
      }

      console.log("Sending message:", {
        content: content.substring(0, 20) + (content.length > 20 ? "..." : ""),
        type: conversationType,
        timestamp: Date.now(),
      });

      // Add temporary message first for immediate UI feedback
      addTempMessage(content);
      // Then send the actual message
      sendMessage(messageData);
    },
    [conversationType, conversationId, signedUserID, isSocketConnected, sendMessage, addTempMessage]
  );

  // Handle loading more messages
  const handleLoadMore = useCallback(() => {
    if (!chatInfo.fullyLoaded && isSocketConnected) {
      const nextPage = (chatInfo.lastLoadedPage || 0) + 1;
      console.log("Loading more messages:", {
        page: nextPage,
        currentCount: messages.length,
        timestamp: Date.now(),
      });
      fetchMessages(nextPage, 10);
    }
  }, [chatInfo, isSocketConnected, fetchMessages, messages.length]);

  useEffect(() => {
    console.log("Chat state:", {
      isSocketConnected,
      hasReceivedMessages,
      messagesCount: messages.length,
      isLoading: !hasReceivedMessages || !isSocketConnected,
      timestamp: Date.now(),
    });
  }, [isSocketConnected, hasReceivedMessages, messages.length]);

  return {
    messages,
    chatInfo,
    isSocketConnected,
    signedUserID,
    formatMessageTime,
    handleSendMessage,
    handleLoadMore,
    isLoading: !hasReceivedMessages || !isSocketConnected,
  };
};
