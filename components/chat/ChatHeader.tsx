import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import Icon from "@blocks/Icon";
import ImageAvatar from "@blocks/ImageAvatar";
import { useThemeColor } from "@hooks/useThemeColor";

interface ChatHeaderProps {
  conversationLogo: string;
  conversationName: string;
  conversationId: string;
  attachments?: Array<{
    id: string;
    type: 'photo' | 'document';
    url: string;
    name: string;
  }>;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

export const ChatHeader = React.memo(({ 
  conversationLogo, 
  conversationName,
  conversationId,
  attachments = [],
  onVoiceCall = () => alert("Voice Call"),
  onVideoCall = () => alert("Video Call")
}: ChatHeaderProps) => {
  const colors = useThemeColor();
  const router = useRouter();

  const handleUserPress = () => {
    const userParams = {
      id: conversationId,
      logo: conversationLogo,
      name: conversationName,
      attachments
    };
    router.push({
      pathname: `/user/${conversationId}`,
      params: { user: JSON.stringify(userParams) }
    });
  };

  return (
    <AppBar
      leading="back"
      title={
        <Pressable 
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          onPress={handleUserPress}
        >
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
