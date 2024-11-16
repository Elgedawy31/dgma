import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Text from '@blocks/Text';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  mediaDevices,
  RTCView,
  MediaStream,
} from 'react-native-webrtc';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';

interface VideoConferenceProps {
  meetingId: string;
  userId: string;
  attendees: Array<{
    AttendeeId: string;
    Capabilities: {
      Audio: string;
      Content: string;
      Video: string;
    };
    ExternalUserId: string;
    JoinToken: string;
    userDetails: {
      _id: string;
      name: {
        first: string;
        last: string;
      };
      email: string;
      avatar: string;
    } | null;
  }>;
  onLeave: () => void;
  meetingData: {
    ExternalMeetingId: string;
    MediaPlacement: {
      AudioFallbackUrl: string;
      AudioHostUrl: string;
      EventIngestionUrl: string;
      ScreenDataUrl: string;
      ScreenSharingUrl: string;
      ScreenViewingUrl: string;
      SignalingUrl: string;
      TurnControlUrl: string;
    };
    MediaRegion: string;
    MeetingArn: string;
    MeetingId: string;
  };
}

interface Participant {
  attendeeId: string;
  externalUserId: string;
  name: string;
  videoTileId?: number;
  stream?: MediaStream;
}

const VideoConference: React.FC<VideoConferenceProps> = ({
  meetingId,
  userId,
  attendees,
  onLeave,
  meetingData
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const color = useThemeColor();

  const meetingSession = useRef<DefaultMeetingSession | null>(null);

  useEffect(() => {
    console.log('VideoConference mounted with meetingId:', meetingId);
    console.log('Meeting data:', meetingData);
    console.log('Attendees:', attendees);
    setupMeeting();
    return () => {
      console.log('VideoConference unmounting, cleaning up...');
      if (meetingSession.current) {
        meetingSession.current.audioVideo?.stop();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'web') return true;

    const requiredPermissions = Platform.select({
      ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
      android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO],
      default: [],
    });

    if (!requiredPermissions) return true;

    try {
      const results = await Promise.all(
        requiredPermissions.map(permission => request(permission))
      );

      const granted = results.every(result => result === RESULTS.GRANTED);
      console.log('Permissions granted:', granted);
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const setupLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: 'user'
        }
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error getting local stream:', err);
      throw err;
    }
  };

  const setupMeeting = async () => {
    try {
      console.log('Setting up meeting...');
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        throw new Error('Camera and microphone permissions are required');
      }

      // Get local media stream
      const stream = await setupLocalStream();

      // Find current user's attendee info
      console.log('Looking for current user in attendees:', userId);
      const currentAttendee = attendees.find(a => a.ExternalUserId === userId);
      if (!currentAttendee) {
        throw new Error('User not found in meeting');
      }

      // Initialize remote participants
      const initialParticipants = attendees
        .filter(a => a.ExternalUserId !== userId)
        .map(a => ({
          attendeeId: a.AttendeeId,
          externalUserId: a.ExternalUserId,
          name: a.userDetails ? `${a.userDetails.name.first} ${a.userDetails.name.last}` : `User ${a.ExternalUserId.slice(0, 8)}`
        }));
      console.log('Initial remote participants:', initialParticipants);
      setRemoteParticipants(initialParticipants);

      // Create meeting session configuration
      console.log('Creating meeting session...');
      const configuration = new MeetingSessionConfiguration(
        meetingData,
        { 
          AttendeeId: currentAttendee.AttendeeId, 
          JoinToken: currentAttendee.JoinToken 
        }
      );
      
      const logger = new ConsoleLogger('ChimeMeeting', LogLevel.INFO);
      const deviceController = new DefaultDeviceController(logger);

      // Create and start meeting session
      meetingSession.current = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
      );

      console.log('Starting audio/video...');
      await meetingSession.current.audioVideo?.start();
      setIsConnecting(false);

      // Set up observers for participants joining/leaving
      meetingSession.current.audioVideo?.realtimeSubscribeToAttendeeIdPresence(
        (attendeeId: string, present: boolean) => {
          console.log('Participant presence update:', { attendeeId, present });
          if (present) {
            const attendee = attendees.find(a => a.AttendeeId === attendeeId);
            if (attendee && attendee.ExternalUserId !== userId) {
              setRemoteParticipants(prev => [
                ...prev,
                {
                  attendeeId,
                  externalUserId: attendee.ExternalUserId,
                  name: attendee.userDetails ? `${attendee.userDetails.name.first} ${attendee.userDetails.name.last}` : `User ${attendee.ExternalUserId.slice(0, 8)}`
                }
              ]);
            }
          } else {
            setRemoteParticipants(prev => 
              prev.filter(p => p.attendeeId !== attendeeId)
            );
          }
        }
      );

      console.log('Meeting setup complete');
    } catch (error: any) {
      console.error('Error in setupMeeting:', error);
      setError(error.message || 'Failed to join meeting');
      setIsConnecting(false);
    }
  };

  const toggleAudio = async () => {
    try {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !isAudioEnabled;
          setIsAudioEnabled(!isAudioEnabled);
        }
      }
      console.log('Audio toggled:', !isAudioEnabled);
    } catch (error) {
      console.error('Error toggling audio:', error);
      Alert.alert('Error', 'Failed to toggle audio');
    }
  };

  const toggleVideo = async () => {
    try {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = !isVideoEnabled;
          setIsVideoEnabled(!isVideoEnabled);
        }
      }
      console.log('Video toggled:', !isVideoEnabled);
    } catch (error) {
      console.error('Error toggling video:', error);
      Alert.alert('Error', 'Failed to toggle video');
    }
  };

  const leaveMeeting = async () => {
    try {
      console.log('Leaving meeting...');
      if (meetingSession.current) {
        meetingSession.current.audioVideo?.stop();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      onLeave();
    } catch (error) {
      console.error('Error leaving meeting:', error);
      Alert.alert('Error', 'Failed to leave meeting properly');
    }
  };

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: color.background }]}>
        <Text type="title" title={`Error: ${error}`} />
      </View>
    );
  }

  if (isConnecting) {
    return (
      <View style={[styles.container, { backgroundColor: color.background }]}>
        <Text type="title" title="Connecting to meeting..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      {/* Local video preview */}
      <View style={styles.localVideo}>
        {isVideoEnabled && localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.videoStream}
            objectFit="cover"
          />
        )}
      </View>

      {/* Remote participants grid */}
      <View style={styles.remoteGrid}>
        {remoteParticipants.map((participant) => (
          <View key={participant.attendeeId} style={styles.remoteVideo}>
            {participant.stream ? (
              <RTCView
                streamURL={participant.stream.toURL()}
                style={styles.videoStream}
                objectFit="cover"
              />
            ) : (
              <View style={styles.videoStream} />
            )}
            <Text type="small" title={participant.name} />
          </View>
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: color.primary }]}
          onPress={toggleAudio}
        >
          <Ionicons
            name={isAudioEnabled ? 'mic' : 'mic-off'}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: color.primary }]}
          onPress={toggleVideo}
        >
          <Ionicons
            name={isVideoEnabled ? 'videocam' : 'videocam-off'}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: 'red' }]}
          onPress={leaveMeeting}
        >
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 8,
    zIndex: 1,
    overflow: 'hidden',
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  remoteVideo: {
    width: '45%',
    aspectRatio: 3/4,
    margin: 5,
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoStream: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
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

export default VideoConference;
