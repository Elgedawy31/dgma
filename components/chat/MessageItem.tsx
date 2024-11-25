import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Linking } from "react-native";
import Text from "@blocks/Text";
import ImageAvatar from "@blocks/ImageAvatar";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from "@hooks/useThemeColor";
import ImageViewerFunc from "@components/ImageViewer";
import { ForwardMessageModal } from "./ForwardMessageModal";
import { Message, ForwardDestination } from "@model/types";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  formatMessageTime: (timestamp: string) => string;
  onReply?: (message: Message) => void;
  onForward?: (message: Message, destination: ForwardDestination) => void;
}

interface AttachmentProps {
  url: string;
  isCurrentUser: boolean;
}

const MessageAttachment = ({ url, isCurrentUser }: AttachmentProps) => {
  const colors = useThemeColor();
  
  const handleDownload = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening attachment:', error);
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isPDF = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  const getFileName = (url: string) => {
    return url?.split('/').pop()?.slice(0 , 25) || 'File';
  };
  
  const [showImageViewer, setShowImageViewer] = React.useState(false);

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
          color={isCurrentUser ? '#fff' : colors.text}
          style={styles.filename}
        />
      </TouchableOpacity>
    );
  }

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
        color={isCurrentUser ? '#fff' : colors.text}
        style={styles.filename}
      />
    </TouchableOpacity>
  );
};

export const MessageItem = React.memo(({ message, isCurrentUser, formatMessageTime, onReply, onForward }: MessageItemProps) => {
  const colors = useThemeColor();
  const [showForwardModal, setShowForwardModal] = useState(false);

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleForward = (destination: ForwardDestination) => {
    if (onForward) {
      onForward(message, destination);
    }
  };

  const renderReplyContent = () => {
    if (!message.replyTo) return null;
    console.log('message.replyTo:', message.replyTo);
    return (
      <View style={[
        styles.replyContainer,
        { backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
      ]}>
        <View style={styles.replyLine} />
        <View style={styles.replyContent}>
          <Text
            type="small"
            title={`Replying to ${message.replyTo.senderId.name?.first}`}
            color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
            style={styles.replyName}
          />
          <Text
            type="small"
            title={message.replyTo.content}
            color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
            style={styles.replyText}
          />
        </View>
      </View>
    );
  };

  const renderForwardedFrom = () => {
    console.log('forwarded from:', message);
    if (!message.forwardedFrom ) return null;

    const name = `${message.forwardedFrom?.name?.first} ${message.forwardedFrom?.name?.last}` || null

    if (!name) return null;

    return (
      <View style={styles.forwardedContainer}>
        <MaterialCommunityIcons
          name="share"
          size={16}
          color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
        />
        <Text
          type="small"
          title={`Forwarded from ${name}`}
          color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
          style={styles.forwardedText}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.messageRow, isCurrentUser ? styles.currentUserRow : styles.otherUserRow]}>
        {!isCurrentUser && (
          <View style={[styles.avatarContainer, styles.otherUserAvatar]}>
            <ImageAvatar type="avatar" url={message.senderId.avatar || ""} />
          </View>
        )}
        <View
          style={[
            styles.messageContent,
            {
              backgroundColor: message.special ? '#ffd900e8' : (isCurrentUser ? colors.primary : colors.card),
              borderBottomRightRadius: isCurrentUser ? 0 : 16,
              borderBottomLeftRadius: isCurrentUser ? 16 : 0,
              transform: [{ scale: message.special ? 1.05 : 1 }],
            },
          ]}>
            {renderForwardedFrom()}
            {renderReplyContent()}
          <Text
            type="subtitle"
            title={`${message.senderId?.name?.first} ${message.senderId?.name?.last}`}
            color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
            style={styles.nameText}
          />

          <Text 
            type="body" 
            title={message.content} 
            color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
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
          
          <View style={styles.messageFooter}>
            <Text
              type="small"
              title={formatMessageTime(message.timestamp)}
              color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
              style={styles.timeText}
            />
            <View style={styles.messageActions}>
              <TouchableOpacity onPress={handleReply} style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="reply"
                  size={20}
                  color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowForwardModal(true)} style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="share"
                  size={20}
                  color={message.special ? '#161616' : (isCurrentUser ? '#fff' : colors.text)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ForwardMessageModal
        visible={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        onForward={handleForward}
        message={message}
      />
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
    opacity: 0.7,
  },
  attachmentsContainer: {
    marginTop: 8,
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
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  replyContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  replyLine: {
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    marginBottom: 2,
  },
  replyText: {
    opacity: 0.7,
  },
  forwardedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  forwardedText: {
    opacity: 0.7,
  },
});
