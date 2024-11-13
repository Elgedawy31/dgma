import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm } from "react-hook-form";
import Icon from "@blocks/Icon";
import TextInputField from "@ui/TextInputField";
import ChatAttachment from "@cards/ChatAttachment";
import { useThemeColor } from "@hooks/useThemeColor";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
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
  
  const { control, watch, reset } = useForm<{ msg: string }>({
    defaultValues: { msg: "" },
  });

  const handleSend = () => {
    if (disabled) return;
    
    const messageContent = watch("msg");
    if (!messageContent.trim()) return;
    
    onSendMessage(messageContent);
    reset({ msg: "" });
  };

  const hasMessage = Boolean(watch("msg")?.trim());
  const canSend = hasMessage && !disabled;

  return (
    <View style={{ 
      paddingHorizontal: 16, 
      paddingVertical: 8, 
      gap: 30, 
      backgroundColor: colors.card,
      opacity: disabled ? 0.7 : 1
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {!hasMessage && (
          <Icon 
            icon="add" 
            iconColor={colors.text} 
            onPress={() => !disabled && setExpand(true)} 
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingHorizontal: 12,
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: colors.text,
            borderWidth: 1,
            borderRadius: 18,
            marginHorizontal: 12,
          }}>
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
          {!hasMessage && !disabled && (
            <Icon 
              iconColor={colors.text} 
              icon="camera" 
              onPress={onAttachmentPress || (() => alert("Camera"))} 
            />
          )}
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
        <View style={{ flexDirection: "row", gap: 20 }}>
          <ChatAttachment
            icon="camera"
            title="Camera"
            onPress={() => {
              alert("Camera");
              setExpand(false);
            }}
          />
          <ChatAttachment
            icon="document"
            title="Document"
            onPress={() => {
              alert("Document");
              setExpand(false);
            }}
          />
          <ChatAttachment
            icon="image"
            title="Image"
            onPress={() => {
              alert("Image");
              setExpand(false);
            }}
          />
        </View>
      )}
    </View>
  );
});

ChatInput.displayName = 'ChatInput';
