import { UserBase, ChatType } from './types';

type ChatModal = {
    _id: string;
    name: string;
    logo?: string | null;
    photo?: string | null;
    type: ChatType;  // Using common ChatType
    receivers: UserBase[];  // Using UserBase type for consistent user data
    lastNotificationSenderId?: string | null;  // Optional notification sender ID
};

export default ChatModal;
