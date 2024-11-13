import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useSecureStorage from "@hooks/useSecureStorage";
import { RawMessage } from "@model/types";

export const useSocket = (
    conversationType: string,
    conversationId: string,
    signedUserID: string,
    onNewMessage: (message: RawMessage) => void,
    onMessagesReceived: (messages: RawMessage[], pagination: any) => void,
    onMessagesSeen: (messageIds: string[], userId: string) => void
) => {
    const { readStorage } = useSecureStorage();
    const socketRef = useRef<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const reconnectAttemptRef = useRef(0);
    const lastFetchRef = useRef<number | null>(null);

    const getConversationId = useCallback(() => {
        return conversationType === "dm" && conversationId === signedUserID
            ? `dm_${conversationId}_${conversationId}`
            : conversationId;
    }, [conversationType, conversationId, signedUserID]);

    const setupSocketListeners = useCallback(
        (socket: Socket, mounted: boolean) => {
            const debugSocket = (event: string, ...args: any[]) => {
                console.log(`Socket ${event}:`, ...args);
            };

            socket.onAny(debugSocket);

            socket.on("connect", () => {
                console.log("Socket Connected, setting up chat...");
                if (mounted) {
                    setIsSocketConnected(true);
                    reconnectAttemptRef.current = 0;

                    const conversationIdToUse = getConversationId();
                    console.log("Joining conversation", {
                        conversationType,
                        conversationId: conversationIdToUse,
                        timestamp: Date.now(),
                    });

                    socket.emit("joinConversation", {
                        conversationType,
                        conversationId: conversationIdToUse,
                    });

                    setTimeout(() => {
                        if (mounted) {
                            console.log("Fetching initial messages after join");
                            lastFetchRef.current = Date.now();
                            socket.emit("fetchMessages", {
                                conversationType,
                                conversationId: conversationIdToUse,
                                page: 1,
                                limit: 10,
                            });
                        }
                    }, 500);
                }
            });

            socket.on("disconnect", () => {
                console.log("Socket Disconnected");
                if (mounted) {
                    setIsSocketConnected(false);
                }
            });

            socket.on("error", (error) => {
                console.error("Socket error:", error);
            });

            socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
                reconnectAttemptRef.current++;
                if (reconnectAttemptRef.current > 3) {
                    socket.disconnect();
                }
            });

            socket.on("newMessage", (message: RawMessage) => {
                console.log("Socket received new message:", {
                    messageId: message.id || message._id,
                    timestamp: Date.now(),
                });
                if (mounted) {
                    onNewMessage(message);
                }
            });

            socket.on("messages", (data: { messages: RawMessage[]; pagination: any }) => {
                const timeSinceLastFetch = lastFetchRef.current ? Date.now() - lastFetchRef.current : null;
                console.log("Socket received messages batch:", {
                    count: data.messages?.length,
                    pagination: data.pagination,
                    timeSinceLastFetch,
                    timestamp: Date.now(),
                });
                if (mounted && data.messages) {
                    onMessagesReceived(data.messages, data.pagination);
                }
            });

            socket.on("messagesSeen", ({ messageIds, userId }) => {
                console.log("Messages seen:", { messageIds, userId });
                if (mounted) {
                    onMessagesSeen(messageIds, userId);
                }
            });

            return socket;
        },
        [conversationType, getConversationId, onNewMessage, onMessagesReceived, onMessagesSeen]
    );

    useEffect(() => {
        let mounted = true;

        const connectSocket = async () => {
            try {
                const token = await readStorage("token");
                if (!token) {
                    console.error("No token available for socket connection");
                    return;
                }

                console.log("Initializing socket connection...");
                const socket = io("http://192.168.1.5:5001", {
                    auth: { token },
                    transports: ["websocket"],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                });

                socketRef.current = setupSocketListeners(socket, mounted);
            } catch (error) {
                console.error("Socket initialization error:", error);
            }
        };

        connectSocket();

        return () => {
            console.log("Cleaning up socket connection...");
            mounted = false;
            if (socketRef.current) {
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [setupSocketListeners]);

    const fetchMessages = useCallback(
        (page: number, limit: number) => {
            if (!socketRef.current || !isSocketConnected) {
                console.log("Cannot fetch messages - socket not ready", {
                    isSocketConnected,
                    hasSocket: !!socketRef.current,
                });
                return;
            }

            console.log("Fetching messages:", {
                page,
                limit,
                conversationType,
                conversationId: getConversationId(),
                timestamp: Date.now(),
            });

            lastFetchRef.current = Date.now();
            socketRef.current.emit("fetchMessages", {
                conversationType,
                conversationId: getConversationId(),
                page,
                limit,
            });
        },
        [conversationType, getConversationId, isSocketConnected]
    );

    const sendMessage = useCallback(
        (messageData: any) => {
            if (!socketRef.current || !isSocketConnected) {
                console.log("Cannot send message - socket not ready", {
                    isSocketConnected,
                    hasSocket: !!socketRef.current,
                });
                return;
            }
            console.log("Sending message:", messageData);
            socketRef.current.emit("sendMessage", messageData);
        },
        [isSocketConnected]
    );

    return {
        isSocketConnected,
        sendMessage,
        fetchMessages,
    };
};
