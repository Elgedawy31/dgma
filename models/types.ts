// Common name type for consistency
export interface UserName {
    first: string;
    last: string;
    second?: string;
}

// Base user type used across all models
export interface UserBase {
    _id?: string;
    id?: string;
    name: UserName;
    avatar?: string;
}

// Message sender type
export interface MessageSender extends UserBase {
    _id: string;
    name: UserName;
    avatar?: string;
}

// Seen type for messages
export interface MessageSeen {
    userId: string;
    seenAt: string;
}

// Reply message type
export interface ReplyMessage {
    _id?: string;
    id: string;
    content: string;
    senderId: MessageSender;
}

// Forward message type
export interface ForwardedFrom {
    _id?: string;
    id?: string;
    name?: UserName;
    avatar?: string;
}

// Message type for chat
export interface Message {
    id: string;
    content: string;
    timestamp: string;
    senderId: MessageSender;
    attachments?: string[];
    special?: boolean;
    seen?: MessageSeen[];
    temp?: boolean;
    replyTo?: ReplyMessage;
    forwardedFrom?: ForwardedFrom;
    type?: 'forwarded';
}

// Chat info type for tracking message loading state
export interface ChatInfo {
    lastLoadedPage: number;
    fullyLoaded: boolean;
    totalPages?: number;
}

// Message type for notifications
export interface RawMessage {
    id?: string;
    _id?: string;
    content?: string;
    timestamp?: string;
    createdAt?: string;
    senderId?: MessageSender;
    sender_id?: MessageSender;
    special?: boolean;
    attachments?: string[];
    seen?: MessageSeen[];
    replyTo?: ReplyMessage;
    forwardedFrom?: ForwardedFrom;
    type?: 'forwarded';
}

// Common notification types
export type NotificationType = 'message' | 'unread_message' | 'mention' | 'reaction' | 'system';

// Common chat types
export type ChatType = 'channel' | 'group' | 'dm';

// Message notification type
export interface MessageNotification {
    message: RawMessage;
    conversationType: string;
    conversationId: string;
    sender: UserBase;
}

// Response types for better type safety
export interface SuccessResponse<T> {
    success: true;
    data: T;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Socket event types for type safety
export interface SocketEvents {
    connect: () => void;
    disconnect: () => void;
    error: (error: Error) => void;
    new_message: () => void;
    messages_received: () => void;
    messages_seen: () => void;
    notification: (data: MessageNotification) => void;
    join: (data: { room: string }, callback: (response: ApiResponse<void>) => void) => void;
}

// Forward destination type
export interface ForwardDestination {
    id: string;
    name: string;
    avatar?: string;
    type: 'user' | 'channel' | 'group';
}
