type ChatModal = {
    id: string;
    name: string;
    logo: string | null;
    type: "channel" | "group" | "dm";
    // role: "admin" | "user";
};

export default ChatModal;