import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { memo } from "react";
import { ChatHeader } from "@components/chat/ChatHeader";
import { MessageList } from "@components/chat/MessageList";
import { ChatInput } from "@components/chat/ChatInput";
import { useChat } from "@hooks/useChat";
import { useThemeColor } from "@hooks/useThemeColor";
import Text from "@blocks/Text";

interface ParsedChatParams {
    id: string;
    logo: string;
    name: string;
    type: string;
}

const Chat = () => {
    const colors = useThemeColor();
    const params = useLocalSearchParams();
    const {
        id: conversationId,
        logo: conversationLogo,
        name: conversationName,
        type: conversationType,
    } = JSON.parse(params.chat as string) as ParsedChatParams;

    const {
        messages,
        chatInfo,
        signedUserID,
        isSocketConnected,
        formatMessageTime,
        handleSendMessage,
        handleLoadMore,
        isLoading,
    } = useChat(conversationType, conversationId);

    useEffect(() => {
        console.log("Chat screen state:", {
            isLoading,
            isSocketConnected,
            messagesCount: messages.length,
            conversationId,
            conversationType,
            chatInfo,
        });
    }, [isLoading, isSocketConnected, messages.length, conversationId, conversationType, chatInfo]);

    const renderContent = () => {
        // Show loading state while connecting or fetching initial messages
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

        // Show messages
        return (
            <MessageList
                messages={messages}
                chatInfo={chatInfo}
                signedUserID={signedUserID}
                formatMessageTime={formatMessageTime}
                onLoadMore={handleLoadMore}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ChatHeader conversationLogo={conversationLogo} conversationName={conversationName} />

            {renderContent()} 

            <ChatInput onSendMessage={handleSendMessage} disabled={!isSocketConnected} />
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
    },
    loadingText: {
        marginTop: 10,
    },
});

Chat.displayName = "Chat";

export default memo(Chat);
