import React, { useCallback, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useForm } from "react-hook-form";
import Icon from "@blocks/Icon";
import Text from "@blocks/Text";
import TextInputField from "@ui/TextInputField";
import ChatAttachment from "@cards/ChatAttachment";
import { useThemeColor } from "@hooks/useThemeColor";
import useFilePicker from "@hooks/useFile";
import ImageViewerFunc from '@components/ImageViewer';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { Message } from '@model/types';

interface FileModel {
  measure: string;
  mimeType: string;
  name: string;
  size?: number;
  uri: string;
}

interface ChatInputProps {
  onSendMessage: (content: string, attachment: string[], special: boolean) => void;
  onAttachmentPress?: () => void;
  disabled?: boolean;
  replyTo?: Message | null;
  onCancelReply?: () => void;
}

export const ChatInput = React.memo(({ 
  onSendMessage, 
  onAttachmentPress,
  disabled = false,
  replyTo,
  onCancelReply
}: ChatInputProps) => {
  const colors = useThemeColor();
  const [expand, setExpand] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const { documentPicker, cameraCapture, uploadFiles } = useFilePicker();
  const [messageDocument, setMessageDocument] = useState<FileModel | null>(null);
  const [messageUploadDocument, setMessageUploadDocument] = useState<string | null>(null);

  const { control, watch, setValue, reset } = useForm<{ msg: string }>({
    defaultValues: { msg: "" },
  });

  const handleSend = () => {
    if (disabled) return;
    
    const messageContent = watch("msg");
    if (!messageContent.trim() && !messageDocument) return;
    
    onSendMessage(
      messageContent, 
      messageUploadDocument ? [messageUploadDocument] : [],
      isSpecial
    );
    reset({ msg: "" });
    setIsSpecial(false);
    setMessageDocument(null);
    setMessageUploadDocument(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    const currentMessage = watch("msg") || "";
    setValue("msg", currentMessage + emoji);
  };

  const handleRemoveAttachment = () => {
    setMessageDocument(null);
    setMessageUploadDocument(null);
  };

  const documentPick = useCallback(async () => {
    const res = await documentPicker({ multiple: false });
    if (res) {
      const file = await uploadFiles(res);
      if (file?.length > 0) {
        setMessageUploadDocument(file[0]?.name);
        setMessageDocument(res[0]);
      }
    }
    setExpand(false);
  }, []);

  const cameraCaptureFunction = useCallback(async () => {
    const res = await cameraCapture();
    if (res) {
      const file = await uploadFiles(res);
      if (file?.length > 0) {
        setMessageUploadDocument(file[0]?.name);
        setMessageDocument(res[0]);
      }
    }
    setExpand(false);
  }, []);

  const hasMessage = Boolean(watch("msg")?.trim());
  const hasAttachment = Boolean(messageDocument);
  const canSend = (hasMessage) && !disabled;
  const isImage = messageDocument?.mimeType.startsWith('image/');
  const [showImageViewer, setShowImageViewer] = React.useState(false);

  const renderReplyPreview = () => {
    if (!replyTo) return null;

    return (
      <View style={[styles.replyPreview, { backgroundColor: colors.card }]}>
        <View style={styles.replyPreviewContent}>
          <Text
            type="small"
            title={`Replying to ${replyTo.senderId.name.first}`}
            color={colors.primary}
            style={styles.replyPreviewName}
          />
          <Text
            type="small"
            title={replyTo.content}
            color={colors.text}
            style={styles.replyPreviewText}
            numberOfLines={1}
          />
        </View>
        {onCancelReply && (
          <TouchableOpacity onPress={onCancelReply} style={styles.replyPreviewClose}>
            <AntDesign name="close" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAttachmentPreview = () => {
    if (!messageDocument) return null;

    return (
      <View style={styles.attachmentPreviewContainer}>
        {isImage ? (
          <TouchableOpacity onPress={() => setShowImageViewer(true)}>
            <Image 
              source={{ uri: messageDocument.uri }} 
              style={styles.imagePreview}
              resizeMode="cover"
            />
          </TouchableOpacity> 
        ) : (
          <View style={[styles.pdfPreview, { backgroundColor: colors.card }]}>
            <Icon icon="document" size={24} iconColor={colors.text} />
            <Text 
              type="small" 
              title={messageDocument.name}
              style={styles.filename}
            />
          </View>
        )}
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: colors.primary }]} 
          onPress={handleRemoveAttachment}
        >
          <Icon icon="close" size={18} iconColor={colors.white} />
        </TouchableOpacity>
        <ImageViewerFunc
          images={[{ url: messageDocument.uri }]}
          setShowImageViewer={setShowImageViewer}
          showImageViewer={showImageViewer}
          selectedImageIndex={0}
          setSelectedImageIndex={() => {}}
        />
      </View>
    );
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        opacity: disabled ? 0.7 : 1 
      }
    ]}>
      {renderReplyPreview()}
      {renderAttachmentPreview()}
      
      <View style={styles.inputContainer}>
        <Icon 
          icon={expand ? 'close' : 'add'} 
          iconColor={colors.text} 
          onPress={() => !disabled && setExpand(!expand)} 
        />
        <TouchableOpacity 
          onPress={() => !disabled && setIsSpecial(!isSpecial)}
          style={[styles.specialButton, isSpecial && styles.specialButtonActive]}
        >
          <AntDesign 
            name="star" 
            size={20} 
            color={isSpecial ? '#ffd900e8' : colors.text} 
          />
        </TouchableOpacity>
        <View style={[styles.textInputWrapper, { borderColor: colors.text }]}>
          <TouchableOpacity 
            onPress={() => !disabled && setShowEmojiPicker(true)}
            style={styles.emojiButton}
          >
            <MaterialIcons 
              name="emoji-emotions" 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TextInputField 
              noLabel 
              noBorder 
              name="msg" 
              placeholder={disabled ? "Connecting..." : "write your message..."} 
              control={control}
              editable={!disabled}
            />
          </View>
        </View>
        <Icon
          icon="send"
          onPress={handleSend}
          iconColor={canSend ? colors.white : colors.text}
          bgColor={canSend ? colors.primary : undefined}
          type={canSend ? "complex" : "simple"}
        />
      </View>

      {expand && !disabled && (
        <View style={styles.attachmentOptions}>
          <ChatAttachment
            icon="camera"
            title="Camera"
            onPress={() => cameraCaptureFunction()}
          />
          <ChatAttachment
            icon="document"
            title="Document"
            onPress={() => documentPick()}
          />
        </View>
      )}

      <Modal
        visible={showEmojiPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            onPress={() => setShowEmojiPicker(false)}
            style={[styles.closeModalButton, { backgroundColor: colors.primary }]}
          >
            <AntDesign name="close" size={20} color={colors.white} />
          </TouchableOpacity>
          <EmojiSelector
            onEmojiSelected={emoji => {
              handleEmojiSelect(emoji);
              setShowEmojiPicker(false);
            }}
            showSearchBar={false}
            columns={8}
            showHistory={false}
            showSectionTitles={false}
            category={undefined}
          />
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    marginHorizontal: 12,
  },
  emojiButton: {
  },
  attachmentOptions: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  attachmentPreviewContainer: {
    height: 70,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  pdfPreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  filename: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialButton: {
    padding: 8,
    borderRadius: 20,
  },
  specialButtonActive: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalContainer: {
    flex: 1,
    marginTop: 'auto',
    height: '50%',
    position: 'relative',
  },
  closeModalButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewName: {
    marginBottom: 2,
  },
  replyPreviewText: {
    opacity: 0.7,
  },
  replyPreviewClose: {
    padding: 4,
  },
});

ChatInput.displayName = 'ChatInput';
