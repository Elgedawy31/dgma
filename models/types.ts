export interface Message {
  id: string;
  content: string;
  senderId: {
    _id: string;
    name: { first: string; last: string };
    avatar: string;
  };
  timestamp: string;
  seen: Array<{ userId: string; seenAt: string }>;
  attachments: string[];
  special?: boolean;
  temp?: boolean;
}

export interface RawMessage {
  _id?: string;
  id?: string;
  content: string;
  sender_id?: {
    _id: string;
    name: { first: string; last: string };
    avatar: string;
  };
  senderId?: {
    _id: string;
    name: { first: string; last: string };
    avatar: string;
  };
  timestamp?: string;
  createdAt?: string;
  seen: Array<{ userId: string; seenAt: string }>;
  attachments: string[];
}

export interface ChatInfo {
  lastLoadedPage: number;
  fullyLoaded: boolean;
  totalPages?: number;
}

export interface ChatProps {
  conversationId: string;
  conversationType: string;
  conversationLogo: string;
  conversationName: string;
}
