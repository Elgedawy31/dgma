import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Linking } from "react-native";
import Text from "@blocks/Text";
import ImageAvatar from "@blocks/ImageAvatar";
import { AntDesign } from '@expo/vector-icons';
import { useThemeColor } from "@hooks/useThemeColor";
import ImageViewerFunc from "@components/ImageViewer";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: {
    avatar?: string;
    name?: {
      first: string;
    };
  };
  attachments?: string[]; // Array of URLs
}

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  formatMessageTime: (timestamp: string) => string;
}

interface AttachmentProps {
  url: string;
  isCurrentUser: boolean;
}

const MessageAttachment = ({ url, isCurrentUser }: AttachmentProps) => {
  const handleDownload = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening attachment:', error);
    }
  };

  // Function to check if URL is an image
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  // Function to check if URL is a PDF
  const isPDF = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  // Function to get filename from URL
  const getFileName = (url: string) => {
    return url.split('/').pop() || 'File';
  };
  const [showImageViewer , setShowImageViewer] = React.useState(false);

  if (isImage(url)) {
    return (
      <TouchableOpacity 
        onPress={() => setShowImageViewer(true)}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: url }}
          style={styles.image}
          resizeMode="cover"
        />
         <ImageViewerFunc
        images={[{ url }]}
        setShowImageViewer={setShowImageViewer}
        showImageViewer={showImageViewer}
        selectedImageIndex={0}
        setSelectedImageIndex={() => {}}
      />
      </TouchableOpacity>
    );
  } 

  if (isPDF(url)) {
    return (
      <TouchableOpacity 
        onPress={() => handleDownload()}
        style={[
          styles.pdfContainer,
          { backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }
        ]}
      >
        <AntDesign 
          name="pdffile1" 
          size={24} 
          color={isCurrentUser ? 'white' : '#FF0000'} 
        />
        <Text 
          type="small" 
          title={getFileName(url)} 
          color={isCurrentUser ? 'white' : undefined}
          style={styles.filename}
        />
         
      </TouchableOpacity>
    );
  }

  // Generic file attachment for other types
  return (
    <TouchableOpacity 
      onPress={() => handleDownload()}
      style={[
        styles.attachmentContainer,
        { backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }
      ]}
    >
      <AntDesign 
        name="file1" 
        size={24} 
        color={isCurrentUser ? 'white' : 'gray'} 
      />
      <Text 
        type="small" 
        title={getFileName(url)} 
        color={isCurrentUser ? 'white' : undefined}
        style={styles.filename}
      />
    </TouchableOpacity>
  );
};

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
          <Text 
            type="body" 
            title={message.content} 
            color={isCurrentUser ? "white" : undefined} 
          />
          
          {(message.attachments?.length ?? 0) > 0 && (
            <View style={styles.attachmentsContainer}>
              {message?.attachments?.map((url, index) => (
                <MessageAttachment
                  key={`${message.id}-attachment-${index}`}
                  url={url}
                  isCurrentUser={isCurrentUser}
                />
              ))}
            </View>
          )}
          
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
    marginTop: 0,
    gap: 8,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 100,
    borderRadius: 8,
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  filename: {
    flex: 1,
  },
});

MessageItem.displayName = "MessageItem";