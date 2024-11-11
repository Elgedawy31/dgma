import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useSecureStorage from './useSecureStorage';

const useSocket = () => {
    const { readStorage } = useSecureStorage();
    const [socket, setSocket] = useState<Socket | null>(null);

    const socketConnect = useCallback(async () => {
        const token = await readStorage('token');
        const newSocket: Socket = io('http://192.168.1.5:5001', { auth: { token } });
        setSocket(newSocket);
        return () => { newSocket.disconnect(); };
    }, []);

    useEffect(() => { socketConnect(); }, [socketConnect]);

    return socket;
};

export default useSocket;
