import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Message, RawMessage, ChatInfo } from '../models/types';

const normalizeMessage = (rawMessage: RawMessage): Message => {
  // Handle different sender ID structures
  const senderId = typeof rawMessage.senderId === 'object' ? rawMessage.senderId :
                  typeof rawMessage.sender_id === 'object' ? rawMessage.sender_id :
                  {
                    _id: rawMessage.senderId || rawMessage.sender_id || '',
                    name: { first: '', last: '' },
                    avatar: ''
                  };

  // Ensure we have a valid ID
  const messageId = rawMessage.id || rawMessage._id || `msg_${Date.now()}_${Math.random()}`;

  // Handle reply data if present
  const replyTo = rawMessage.replyTo ? {
    id: rawMessage.replyTo.id || rawMessage.replyTo._id || '',
    content: rawMessage.replyTo.content || '',
    senderId: typeof rawMessage.replyTo.senderId === 'object' ? {
      _id: rawMessage.replyTo.senderId._id || '',
      name: rawMessage.replyTo.senderId.name || { first: '', last: '' },
      avatar: rawMessage.replyTo.senderId.avatar || ''
    } : {
      _id: rawMessage.replyTo.senderId || '',
      name: { first: '', last: '' },
      avatar: ''
    }
  } : undefined;

  // Handle forwarded message data if present
  const forwardedFrom = rawMessage.forwardedFrom ? {
    id: rawMessage.forwardedFrom.id || rawMessage.forwardedFrom._id || '',
    name: rawMessage.forwardedFrom.name || { first: '', last: '' },
    avatar: rawMessage.forwardedFrom.avatar || ''
  } : undefined;

  return {
    id: messageId,
    content: rawMessage.content || '',
    senderId: {
      _id: senderId._id || senderId?.id || '',
      name: senderId.name || { first: '', last: '' },
      avatar: senderId.avatar || ''
    },
    timestamp: rawMessage.timestamp || rawMessage.createdAt || new Date().toISOString(),
    seen: rawMessage.seen || [],
    attachments: rawMessage.attachments || [],
    special: rawMessage.special || false,
    replyTo,
    forwardedFrom,
    type: rawMessage.type
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
        .map(msg => {
          const messageId = msg.id || msg._id || '';
          const isProcessed = processedMessagesRef.current.has(messageId);
          console.log("Processing message:", { id: messageId, isProcessed });
          if (messageId) {
            processedMessagesRef.current.add(messageId);
          }
          return normalizeMessage(msg);
        });

      if (newMessages.length === 0) {
        return prev;
      }

      // Remove temporary messages that have been confirmed
      const withoutConfirmed = prev.filter(
        existingMsg => {
          if (!existingMsg.temp) return true;
          
          return !newMessages.some(
            newMsg =>
              newMsg.content === existingMsg.content && 
              newMsg.senderId._id === existingMsg.senderId._id &&
              JSON.stringify(newMsg.attachments) === JSON.stringify(existingMsg.attachments) &&
              newMsg.special === existingMsg.special &&
              JSON.stringify(newMsg.replyTo) === JSON.stringify(existingMsg.replyTo)
          );
        }
      );

      // Combine messages and ensure uniqueness by ID
      const allMessages = [...withoutConfirmed, ...newMessages];
      const messageMap = new Map<string, Message>();
      
      // Keep the most recent version of each message
      allMessages.forEach(msg => {
        const existing = messageMap.get(msg.id);
        if (!existing || new Date(msg.timestamp) > new Date(existing.timestamp)) {
          messageMap.set(msg.id, msg);
        }
      });
      
      const uniqueMessages = Array.from(messageMap.values());
      
      // Sort messages by timestamp
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

  // Process queue more frequently (every 50ms instead of 100ms)
  useEffect(() => {
    const timer = setInterval(processMessageQueue, 50);
    return () => clearInterval(timer);
  }, [processMessageQueue]);

  const handleNewMessage = useCallback((rawMessage: RawMessage) => {
    console.log("Queueing new message:", {
      id: rawMessage.id || rawMessage._id,
      content: rawMessage.content?.substring(0, 20),
      senderId: rawMessage.senderId?._id || rawMessage.sender_id?._id,
      timestamp: Date.now()
    });
    messageQueueRef.current.push(rawMessage);
  }, []);

  const handleMessagesReceived = useCallback((receivedMessages: RawMessage[], pagination: any) => {
    console.log("Received messages batch:", {
      count: receivedMessages?.length,
      currentPage: pagination?.currentPage,
      timestamp: Date.now()
    });
    
    if (!receivedMessages?.length) {
      console.log("No messages in batch");
      return;
    }

    // Clear processed messages set when receiving historical messages
    if (pagination?.currentPage > 1) {
      processedMessagesRef.current.clear();
    }

    messageQueueRef.current.push(...receivedMessages);
    
    if (pagination) {
      setChatInfo({
        lastLoadedPage: pagination.currentPage,
        fullyLoaded: pagination.currentPage >= pagination.totalPages,
        totalPages: pagination.totalPages,
      });
    }
  }, []);

  const handleMessagesSeen = useCallback(({ messageIds, userId }: { messageIds: string[], userId: string }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        messageIds?.includes(msg.id)
          ? {
              ...msg,
              seen: [...new Set([...(msg.seen || []), { userId, seenAt: new Date().toISOString() }])],
            }
          : msg
      )
    );
  }, []);

  const addTempMessage = useCallback((
    content: string, 
    attachments: string[] = [], 
    special: boolean = false,
    replyToId?: string
  ) => {
    const tempMessage: Message = {
      id: `temp_${Date.now()}_${Math.random()}`,
      content,
      senderId: {
        _id: signedUserID,
        name: { first: "", last: "" },
        avatar: userAvatar || ""
      },
      timestamp: new Date().toISOString(),
      seen: [],
      attachments,
      special,
      temp: true,
      replyTo: replyToId ? {
        id: replyToId,
        content: messages.find(m => m.id === replyToId)?.content || '',
        senderId: messages.find(m => m.id === replyToId)?.senderId || {
          _id: '',
          name: { first: '', last: '' },
          avatar: ''
        }
      } : undefined
    };

    setMessages(prev => {
      const newMessages = [...prev, tempMessage];
      return newMessages.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });

    console.log("Added temporary message:", {
      id: tempMessage.id,
      content: content.substring(0, 20) + (content.length > 20 ? "..." : ""),
      attachmentsCount: attachments.length,
      special,
      replyToId,
      timestamp: Date.now()
    });
  }, [signedUserID, userAvatar, messages]);

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

  return {
    messages,
    chatInfo,
    handleNewMessage,
    handleMessagesReceived,
    handleMessagesSeen,
    addTempMessage,
    formatMessageTime,
  };
};
