import React from 'react';
import { View, Pressable } from 'react-native';
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import Icon from "@blocks/Icon";
import ImageAvatar from "@blocks/ImageAvatar";
import { useThemeColor } from "@hooks/useThemeColor";

interface ChatHeaderProps {
  conversationLogo: string;
  conversationName: string;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

export const ChatHeader = React.memo(({ 
  conversationLogo, 
  conversationName,
  onVoiceCall = () => alert("Voice Call"),
  onVideoCall = () => alert("Video Call")
}: ChatHeaderProps) => {
  const colors = useThemeColor();

  return (
    <AppBar
      leading="back"
      title={
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ImageAvatar type="avatar" url={conversationLogo} />
          <Text type="subtitle" title={conversationName} />
        </Pressable>
      }
      action={
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <Icon 
            iconColor={colors.text} 
            icon="call" 
            onPress={onVoiceCall} 
          />
          <Icon 
            iconColor={colors.text} 
            icon="video" 
            size={28} 
            onPress={onVideoCall} 
          />
        </View>
      }
    />
  );
});

ChatHeader.displayName = 'ChatHeader';
