import React, { useCallback, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm } from "react-hook-form";
import Icon from "@blocks/Icon";
import Text from "@blocks/Text";
import TextInputField from "@ui/TextInputField";
import ChatAttachment from "@cards/ChatAttachment";
import { useThemeColor } from "@hooks/useThemeColor";
import useFilePicker from "@hooks/useFile";
import ImageViewerFunc from '@components/ImageViewer';
import attachments from '@/app/chat/[id]/attachments';

interface FileModel {
  measure: string;
  mimeType: string;
  name: string;
  size: number;
  uri: string;
}

interface ChatInputProps {
  onSendMessage: (content: string , attachment:string[]) => void;
  onAttachmentPress?: () => void;
  disabled?: boolean;
}

export const ChatInput = React.memo(({ 
  onSendMessage, 
  onAttachmentPress,
  disabled = false 
}: ChatInputProps) => {
  const colors = useThemeColor();
  const [expand, setExpand] = useState(false);
  
  const { documentPicker, cameraCapture, uploadFiles } = useFilePicker();
  const [messageDocument, setMessageDocument] = useState<FileModel | null>(null);
  const [messageUploadDocument, setMessageUploadDocument] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, watch, reset } = useForm<{ msg: string }>({
    defaultValues: { msg: "" },
  });

  const handleSend = () => {
    if (disabled) return;
    
    const messageContent = watch("msg");
    if (!messageContent.trim() && !messageDocument) return;
    
    onSendMessage(messageContent, messageUploadDocument ? [messageUploadDocument] : []);
    reset({ msg: "" });
    // Clear attachment after sending
    setMessageDocument(null);
    setMessageUploadDocument(null);
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
  const canSend = (hasMessage || messageDocument) && !disabled;
  const isImage = messageDocument?.mimeType.startsWith('image/');
  const [showImageViewer , setShowImageViewer] = React.useState(false); 

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
          <View style={[styles.pdfPreview, { backgroundColor: colors.text }]}>
            <Icon icon="document" size={24} iconColor={colors.text} />
            <Text 
              type="small" 
              title={messageDocument.name} 
              numberOfLines={1} 
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
      {renderAttachmentPreview()}
      
      <View style={styles.inputContainer}>
        {!hasMessage && (
          <Icon 
            icon="add" 
            iconColor={colors.text} 
            onPress={() => !disabled && setExpand(true)} 
          />
        )}
        <View style={[styles.textInputWrapper, { borderColor: colors.text }]}>
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

      {!hasMessage && expand && !disabled && (
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
});

ChatInput.displayName = 'ChatInput';