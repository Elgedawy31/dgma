export interface Attachment {
    id: string;
    url: string;
    name: string;
    mimeType?: string;
    type?: string;
}

export interface UserAttachment {
    id: string;
    type: 'photo' | 'document';
    url: string;
    name: string;
}
