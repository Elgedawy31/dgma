import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageNotification, SocketEvents, ApiResponse } from '../models/types';

interface UseSocketProps {
  namespace: string;
  room: string;
  userId: string;
  onNewMessage: () => void;
  onMessagesReceived: () => void;
  onMessagesSeen: () => void;
  onJoinSuccess: () => void;
  onNotification: (notification: MessageNotification) => void;
}

export const useSocket = (
  namespace: string,
  room: string,
  userId: string,
  onNewMessage: () => void,
  onMessagesReceived: () => void,
  onMessagesSeen: () => void,
  onJoinSuccess: () => void,
  onNotification: (notification: MessageNotification) => void
) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef<Socket<SocketEvents> | null>(null);

  useEffect(() => {
    // Only connect if we have a valid user ID
    if (!userId) {
      return;
    }

    // Initialize socket connection
    const socket = io(`${process.env.EXPO_PUBLIC_API_URL}/${namespace}`, {
      auth: {
        userId,
      },
      transports: ['websocket'],
    }) as Socket<SocketEvents>;

    socketRef.current = socket;

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsSocketConnected(true);

      // Join room after connection
      socket.emit('join', { room }, (response: ApiResponse<void>) => {
        if (response.success) {
          console.log('Successfully joined room:', room);
          onJoinSuccess();
        } else {
          console.error('Failed to join room:', response.error);
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsSocketConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setIsSocketConnected(false);
    });

    // Message events
    socket.on('new_message', onNewMessage);
    socket.on('messages_received', onMessagesReceived);
    socket.on('messages_seen', onMessagesSeen);

    // Notification events
    socket.on('notification', (data: MessageNotification) => {
      console.log('Received notification:', data);
      onNotification(data);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('error');
        socket.off('new_message');
        socket.off('messages_received');
        socket.off('messages_seen');
        socket.off('notification');
        socket.disconnect();
      }
    };
  }, [namespace, room, userId]);

  // Function to emit events with type safety
  const emit = <T extends keyof SocketEvents>(
    event: T,
    ...args: Parameters<SocketEvents[T]>
  ) => {
    if (socketRef.current && isSocketConnected) {
      socketRef.current.emit(event, ...args);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  return {
    isSocketConnected,
    emit,
    socket: socketRef.current,
  };
};

export default useSocket;
