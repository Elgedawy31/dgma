import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Message, RawMessage, ChatInfo } from '../types';

const normalizeMessage = (rawMessage: RawMessage): Message => {
  const senderId = rawMessage.senderId || rawMessage.sender_id || {
    _id: '',
    name: { first: '', last: '' },
    avatar: ''
  };

  return {
    id: rawMessage.id || rawMessage._id || '',
    content: rawMessage.content,
    senderId: {
      _id: senderId._id,
      name: senderId.name,
      avatar: senderId.avatar
    },
    timestamp: rawMessage.timestamp || rawMessage.createdAt || new Date().toISOString(),
    seen: rawMessage.seen || [],
    attachments: rawMessage.attachments || [],
  };
};

export const useMessages = (signedUserID: string, userAvatar: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo>({
    lastLoadedPage: 0,
    fullyLoaded: false,
  });
  
  const processedMessagesRef = useRef(new Set<string>());
  const lastUpdateRef = useRef<number>(Date.now());
  const messageQueueRef = useRef<RawMessage[]>([]);
  const processingRef = useRef(false);

  // Clear state when user changes
  useEffect(() => {
    console.log("User changed, clearing message state");
    processedMessagesRef.current.clear();
    messageQueueRef.current = [];
    setMessages([]);
    setChatInfo({
      lastLoadedPage: 0,
      fullyLoaded: false,
    });
  }, [signedUserID]);

  // Process message queue
  const processMessageQueue = useCallback(() => {
    if (processingRef.current || messageQueueRef.current.length === 0) return;

    processingRef.current = true;
    console.log("Processing message queue:", messageQueueRef.current.length);

    setMessages(prev => {
      const newMessages = messageQueueRef.current
        .filter(msg => {
          const messageId = msg.id || msg._id || '';
          if (!messageId || processedMessagesRef.current.has(messageId)) {
            console.log("Skipping already processed message:", messageId);
            return false;
          }
          processedMessagesRef.current.add(messageId);
          return true;
        })
        .map(normalizeMessage);

      if (newMessages.length === 0) {
        return prev;
      }

      // Filter out any temporary messages that have been confirmed
      const withoutConfirmed = prev.filter(
        (existingMsg) =>
          !(
            existingMsg.temp &&
            newMessages.some(
              (newMsg) =>
                newMsg.content === existingMsg.content && newMsg.senderId._id === existingMsg.senderId._id
            )
          )
      );

      // Combine and sort messages
      const allMessages = [...withoutConfirmed, ...newMessages];
      const uniqueMessages = Array.from(
        new Map(allMessages.map((m) => [m.id, m])).values()
      );
      
      const sortedMessages = uniqueMessages.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      console.log("Message state updated:", {
        previousCount: prev.length,
        newCount: sortedMessages.length,
        addedCount: newMessages.length,
        timestamp: Date.now()
      });

      return sortedMessages;
    });

    messageQueueRef.current = [];
    processingRef.current = false;
    lastUpdateRef.current = Date.now();
  }, []);

  // Process queue when new messages are added
  useEffect(() => {
    const timer = setInterval(processMessageQueue, 100);
    return () => clearInterval(timer);
  }, [processMessageQueue]);

  const handleNewMessage = useCallback((rawMessage: RawMessage) => {
    console.log("Queueing new message:", {
      id: rawMessage.id || rawMessage._id,
      timestamp: Date.now()
    });
    messageQueueRef.current.push(rawMessage);
  }, []);

  const handleMessagesReceived = useCallback((receivedMessages: RawMessage[], pagination: any) => {
    console.log("Received messages batch:", {
      count: receivedMessages?.length,
      currentPage: pagination.currentPage,
      timestamp: Date.now()
    });
    
    if (!receivedMessages?.length) {
      console.log("No messages in batch");
      return;
    }

    messageQueueRef.current.push(...receivedMessages);
    setChatInfo({
      lastLoadedPage: pagination.currentPage,
      fullyLoaded: pagination.currentPage >= pagination.totalPages,
      totalPages: pagination.totalPages,
    });
  }, []);

  const handleMessagesSeen = useCallback(({ messageIds, userId }: { messageIds: string[], userId: string }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        messageIds.includes(msg.id)
          ? {
              ...msg,
              seen: [...(msg.seen || []), { userId, seenAt: new Date().toISOString() }],
            }
          : msg
      )
    );
  }, []);

  const addTempMessage = useCallback((content: string) => {
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      content,
      senderId: {
        _id: signedUserID,
        name: { first: "", last: "" },
        avatar: userAvatar || ""
      },
      timestamp: new Date().toISOString(),
      seen: [],
      attachments: [],
      temp: true
    };

    setMessages(prev => {
      const newMessages = [...prev, tempMessage];
      return newMessages.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
  }, [signedUserID, userAvatar]);

  const formatMessageTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? 0 + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }, []);

  // Memoize the sorted messages to prevent unnecessary re-renders
  const sortedMessages = useMemo(() => messages, [messages]);

  return {
    messages: sortedMessages,
    chatInfo,
    handleNewMessage,
    handleMessagesReceived,
    handleMessagesSeen,
    addTempMessage,
    formatMessageTime,
  };
};
