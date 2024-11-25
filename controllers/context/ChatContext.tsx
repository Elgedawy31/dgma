import React, { createContext, useContext, useState, useCallback } from 'react';
import { usersData } from '@data/users';

export interface ChatGroup {
    _id: string;
    name: string;
    logo: string | null;
    type: "channel" | "group" | "dm";
    receivers: { id: string, avatar: string, name: string }[];
}

interface ChatContextType {
    chats: ChatGroup[];
    addChat: (chat: ChatGroup) => void;
}

const ChatContext = createContext<ChatContextType>({
    chats: [],
    addChat: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const defaultAvatar = '../../assets/images/user.png';

    // Initialize with existing users as direct message chats
    const initialChats: ChatGroup[] = usersData.map(user => ({
        _id: `ChatID-${user.id}`,
        name: `${user.name.first} ${user.name.last}`,
        logo: user.avatar || defaultAvatar,
        type: "dm",
        receivers: [{
            id: user.id,
            avatar: user.avatar || defaultAvatar,
            name: `${user.name.first} ${user.name.last}`
        }]
    }));

    const [chats, setChats] = useState<ChatGroup[]>(initialChats);

    const addChat = useCallback((newChat: ChatGroup) => {
        // Ensure all receivers have an avatar
        const processedChat: ChatGroup = {
            ...newChat,
            logo: newChat.logo || defaultAvatar,
            receivers: newChat.receivers.map(receiver => ({
                ...receiver,
                avatar: receiver.avatar || defaultAvatar
            }))
        };
        setChats(prevChats => [...prevChats, processedChat]);
    }, []);

    return (
        <ChatContext.Provider value={{ chats, addChat }}>
            {children}
        </ChatContext.Provider>
    );
};
