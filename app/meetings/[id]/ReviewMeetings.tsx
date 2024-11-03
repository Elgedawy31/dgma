import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { memo, useState } from "react";
import { Image, StyleSheet, View , Text as TextR, TouchableOpacity } from "react-native";


function ReviewMeetings() {
  const color = useThemeColor();
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const {id} = useLocalSearchParams()

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Review Meeting" />}
        leading={
          <Ionicons
            name="chevron-back"
            size={24}
            color={color.text}
            onPress={() => {
              router.back();
            }}
          />
        }
      />
    <View style={styles(color).container}>
      {/* Illustration Section */}
      <View style={styles(color).illustrationContainer}>
        <Image 
          source={require('@/assets/images/prepair-meeting.png')} 
          style={styles(color).illustration}
          resizeMode="contain"
        />
      </View>

      {/* Instructions Section */}
      <View style={styles(color).instructionsContainer}>
        <TextR style={styles(color).title}>Get started</TextR>
        <TextR style={styles(color).subtitle}>
          Set up your camera and microphone{'\n'}before joining
        </TextR>
      </View>

      {/* Controls Section */}
      <View style={styles(color).controlsContainer}>
        <TouchableOpacity 
          style={styles(color).controlButton}
          onPress={() => setIsCameraOff(!isCameraOff)}
        >
          <TextR style={styles(color).controlText}>
            Turn {isCameraOff ? 'on' : 'off'} camera
          </TextR>
          <View style={[styles(color).iconContainer, !isCameraOff && styles(color).activeIcon]}>
            <Feather 
              name={isCameraOff ? "video-off" : "video"} 
              size={24} 
              color={color.primary} 
            />
          </View>
         
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles(color).controlButton}
          onPress={() => setIsMicOn(!isMicOn)}
        >
          <TextR style={styles(color).controlText}>
            Turn {isMicOn ? 'off' : 'on'} microphone
          </TextR>
          <View style={[styles(color).iconContainer, isMicOn && styles(color).activeIcon]}>
            <Feather 
              name={isMicOn ? "mic" : "mic-off"} 
              size={24} 
              color={color.primary} 
            />
          </View>
         
        </TouchableOpacity>
      </View>

      {/* Join Button */}
      <TouchableOpacity 
        style={styles(color).joinButton}
        onPress={()=>router.push(`/meetings/${id}/LandingMeeting`)}
      >
        <TextR style={styles(color).joinButtonText}>Join meeting</TextR>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles =(color:any) =>  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
    },
    illustrationContainer: {
      width: '100%',
      aspectRatio: 16/9,
      marginBottom: 24,
    },
    illustration: {
      width: '100%',
      height: '100%',
    },
    instructionsContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: color.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: color.body,
      textAlign: 'center',
      lineHeight: 24,
    },
    controlsContainer: {
      width: '100%',
      gap: 16,
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
      gap: 16,
      width: '100%',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeIcon: {
      backgroundColor: '#E8F0FE',
    },
    controlText: {
      fontSize: 16,
      color: '#000000',
    },
    joinButton: {
      width: '100%',
      backgroundColor: color.primary,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
    },
    joinButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '500',
    },
  });

export default memo(ReviewMeetings);
