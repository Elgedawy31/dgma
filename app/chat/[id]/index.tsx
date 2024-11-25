import React, { useState, useMemo, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, TextStyle } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { memo } from "react";
import { ChatHeader } from "@components/chat/ChatHeader";
import { MessageList } from "@components/chat/MessageList";
import { ChatInput } from "@components/chat/ChatInput";
import { useChat } from "@hooks/useChat";
import { useThemeColor } from "@hooks/useThemeColor";
import useAxios from "@hooks/useAxios";
import Text from "@blocks/Text";
import { Message, ForwardDestination } from "@model/types";
import { Attachment, UserAttachment } from "@model/attachment";

interface ParsedChatParams {
    id: string;
    logo: string;
    name: string;
    type: string;
}

const Chat = () => {
    const colors = useThemeColor();
    const params = useLocalSearchParams();  
    const { getRequest } = useAxios();
    const [tasks, setTasks] = useState<any[]>([]);
    
    const {
        id: conversationId,
        logo: conversationLogo,
        name: conversationName,
        type: conversationType,
    } = JSON?.parse(params.chat as string) as ParsedChatParams;

    const [replyTo, setReplyTo] = useState<Message | null>(null);

    const {
        messages,
        chatInfo,
        signedUserID,
        isSocketConnected,
        formatMessageTime,
        handleSendMessage,
        handleForwardMessage,
        handleLoadMore,
        isLoading,
        error
    } = useChat(conversationType, conversationId);

    // Fetch tasks whenever the route changes or component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getRequest({ endPoint: 'tasks' });
                if (response) {
                    setTasks(response);
                }
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };

        fetchTasks();
    }, [conversationId]); // Re-fetch when conversation ID changes

    // Extract unique attachments from messages
    const attachments = useMemo(() => {
        const attachmentMap = new Map<string, UserAttachment>();
        messages.forEach(message => {
            if (message.attachments) {
                message.attachments.forEach(attachmentUrl => {
                    try {
                        const attachment = JSON.parse(attachmentUrl) as Attachment;
                        if (!attachmentMap.has(attachment.id)) {
                            attachmentMap.set(attachment.id, {
                                id: attachment.id,
                                type: attachment.mimeType?.startsWith('image/') ? 'photo' : 'document',
                                url: attachment.url,
                                name: attachment.name || `${attachment.type || 'file'}-${attachment.id}`,
                            });
                        }
                    } catch {
                        const id = attachmentUrl.split('/').pop() || attachmentUrl;
                        if (!attachmentMap.has(id)) {
                            attachmentMap.set(id, {
                                id,
                                type: attachmentUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? 'photo' : 'document',
                                url: attachmentUrl,
                                name: id,
                            });
                        }
                    }
                });
            }
        });
        return Array.from(attachmentMap.values());
    }, [messages]);

    const handleReply = (message: Message) => {
        setReplyTo(message);
    };

    const handleCancelReply = () => {
        setReplyTo(null);
    };

    const handleSendWithReply = (content: string, attachments: string[], special: boolean) => {
        handleSendMessage(content, attachments, special, replyTo?.id);
        setReplyTo(null);
    };

    const handleForward = (message: Message, destination: ForwardDestination) => {
        handleForwardMessage(message, destination);
    };

    const renderContent = () => {
        if (error) {
            return (
                <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                    <Text
                        type="body"
                        title="Connection Error"
                        color={colors.primary}
                        style={styles.errorTitle}
                    />
                    <Text
                        type="body"
                        title={error}
                        color={colors.text}
                        style={styles.errorMessage}
                    />
                </View>
            );
        }

        if (isLoading) {
            return (
                <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text
                        type="body"
                        title={isSocketConnected ? "Loading messages..." : "Connecting..."}
                        color={colors.text}
                        style={styles.loadingText}
                    />
                </View>
            );
        }

        if (messages.length === 0 && chatInfo.fullyLoaded) {
            return (
                <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                    <Text type="body" title="No messages yet" color={colors.text} />
                </View>
            );
        }

        return (
            <MessageList
                messages={messages}
                chatInfo={chatInfo}
                signedUserID={signedUserID}
                formatMessageTime={formatMessageTime}
                onLoadMore={handleLoadMore}
                onReply={handleReply}
                onForward={handleForward}
                tasks={tasks}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ChatHeader 
                conversationLogo={conversationLogo} 
                conversationName={conversationName}
                conversationId={conversationId}
                attachments={attachments}
            />

            {renderContent()}

            <ChatInput 
                onSendMessage={handleSendWithReply} 
                disabled={!isSocketConnected}
                replyTo={replyTo}
                onCancelReply={handleCancelReply}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
    } as TextStyle,
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    } as TextStyle,
    errorMessage: {
        textAlign: 'center',
    } as TextStyle
});

Chat.displayName = "Chat";

export default memo(Chat);
