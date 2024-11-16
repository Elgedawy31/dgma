import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';

interface MeetingControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeave,
}) => {
  const color = useThemeColor();

  return (
    <View style={styles.controls}>
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: color.primary }]}
        onPress={onToggleAudio}
      >
        <Ionicons
          name={isAudioEnabled ? 'mic' : 'mic-off'}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: color.primary }]}
        onPress={onToggleVideo}
      >
        <Ionicons
          name={isVideoEnabled ? 'videocam' : 'videocam-off'}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: color.primary }]}
        onPress={onToggleScreenShare}
      >
        <Ionicons
          name={isScreenSharing ? 'stop-circle-outline' : 'share-outline'}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: 'red' }]}
        onPress={onLeave}
      >
        <Ionicons name="call" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default MeetingControls;
