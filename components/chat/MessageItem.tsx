import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "@blocks/Text";
import ImageAvatar from "@blocks/ImageAvatar";
import { Message } from "../types";
import { useThemeColor } from "@hooks/useThemeColor";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  formatMessageTime: (timestamp: string) => string;
}

export const MessageItem = React.memo(({ message, isCurrentUser, formatMessageTime }: MessageItemProps) => {
  const colors = useThemeColor();

  console.log("Rendering message:", {
    id: message.id,
    isCurrentUser,
    content: message.content.substring(0, 20) + (message.content.length > 20 ? "..." : ""),
    timestamp: message.timestamp,
  });

  return (
    <View style={styles.container}>
      <View style={[styles.messageRow, isCurrentUser ? styles.currentUserRow : styles.otherUserRow]}>
        <View style={[styles.avatarContainer, isCurrentUser ? styles.currentUserAvatar : styles.otherUserAvatar]}>
          <ImageAvatar type="avatar" url={message.senderId.avatar || ""} />
        </View>
        <View
          style={[
            styles.messageContent,
            {
              backgroundColor: isCurrentUser ? colors.primary : colors.card,
              borderBottomRightRadius: isCurrentUser ? 0 : 16,
              borderBottomLeftRadius: isCurrentUser ? 16 : 0,
            },
          ]}>
          <Text
            type="subtitle"
            title={message.senderId?.name?.first}
            color={isCurrentUser ? "white" : undefined}
            style={styles.nameText}
          />
          <Text type="body" title={message.content} color={isCurrentUser ? "white" : undefined} />
          {message.attachments?.length > 0 && <View style={styles.attachmentsContainer}>
          </View>}
          <Text
            type="small"
            title={formatMessageTime(message.timestamp)}
            color={isCurrentUser ? "white" : "gray"}
            style={styles.timeText}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  currentUserRow: {
    flexDirection: "row-reverse",
  },
  otherUserRow: {
    flexDirection: "row",
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  currentUserAvatar: {
    marginLeft: 8,
    marginRight: 0,
  },
  otherUserAvatar: {
    marginLeft: 0,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: "70%",
    borderRadius: 16,
    padding: 12,
  },
  nameText: {
    marginBottom: 4,
  },
  timeText: {
    alignSelf: "flex-end",
    marginTop: 4,
    opacity: 0.7,
  },
  attachmentsContainer: {
    marginTop: 8,
  },
});

MessageItem.displayName = "MessageItem";
