import { UserBase, ChatType } from './types';

type ChannelModal = {
    _id: string;
    name: string;
    photo?: string | null;
    type: ChatType;  // Using common ChatType
    members: UserBase[];  // Using UserBase type for consistent user data
    lastNotificationSenderId?: string[] | null;  // Changed to array of notification sender IDs
};

export default ChannelModal;
