type ChatModal = {
    _id: string;
    photo: string | null;
    type: "channel" | "group";
    role: "admin" | "user";
    name: string;
};

export default ChatModal;