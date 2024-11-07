// import { 'SERVER_URL' } from '@env';
import { Socket, io } from 'socket.io-client';
import useSecureStorage from './useSecureStorage';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

// Types
interface MessageModel {
    content: string;
    receiverId?: string;
    attachments?: string[];
    type: 'channel' | 'group' | 'dm';
}

interface ServerToClientEvents {
    newMessage: (message: MessageModel) => void;
    connect_error: (err: Error) => void;
}

interface ClientToServerEvents {
    sendMessage: (message: MessageModel) => void;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

const useSocket = () => {
    const { readStorage } = useSecureStorage();
    const [socket, setSocket] = useState<SocketType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<SocketType | null>(null);

    const socketConnect = useCallback(async () => {
        try {
            const token = await readStorage('token');
            socketRef.current = io('http://192.168.1.71:5001', { auth: { token }, });
            setSocket(socketRef.current);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Connection failed');
        }
    }, [readStorage]);

    const socketError = useCallback(() => {
        socketRef.current?.on('connect_error', (err: Error) => {
            console.error('Socket error:', err.message);
            setError(err.message);
        });
    }, []);

    const getNewMessage = useCallback(() => {
        socketRef.current?.on("newMessage", (message: MessageModel) => {
            console.log('new message', message);
            // Handle new message here
            // You might want to add a callback prop or use a message state
        });
    }, []);

    const sendMessage = useCallback((message: MessageModel) => {
        if (!socketRef.current?.connected) {
            setError('Socket is not connected');
            return;
        }
        console.log('sending message', message);
        socketRef.current.emit("sendMessage", message);
    }, []);

    const closeSocket = useCallback(() => {
        console.log('close socket');
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
        }
    }, []);

    useEffect(() => {
        socketConnect();
        socketError();
        getNewMessage();

        return () => {
            closeSocket();
        };
    }, []);

    const socketControls = useMemo(() => ({
        socket, error, socketError, sendMessage
    }), [socket, error, socketError, sendMessage]);

    return socketControls;
};

export default useSocket;