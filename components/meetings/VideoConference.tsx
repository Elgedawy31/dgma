import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Text from '@blocks/Text';
import { useThemeColor } from '@hooks/useThemeColor';
import {
  mediaDevices,
  MediaStream as RNMediaStream,
  RTCView,
} from 'react-native-webrtc';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  VideoTileState,
} from 'amazon-chime-sdk-js';
import ParticipantGrid from './ParticipantGrid';
import ScreenShare from './ScreenShare';
import MeetingControls from './MeetingControls';

// Custom MediaStream type that combines web and RN properties
type CustomMediaStream = RNMediaStream & {
  toURL(): string;
  release(): void;
  _tracks: MediaStreamTrack[];
  _reactTag: string;
};

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
  streamURL?: string;
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
  const [localStream, setLocalStream] = useState<CustomMediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<CustomMediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeScreenShareId, setActiveScreenShareId] = useState<string | null>(null);
  const color = useThemeColor();

  const meetingSession = useRef<DefaultMeetingSession | null>(null);

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
      }) as CustomMediaStream;
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

      // Set up video tile observer
      meetingSession.current.audioVideo?.addObserver({
        videoTileDidUpdate: (tileState: VideoTileState) => {
          console.log('Video tile updated:', tileState);
          if (!tileState.boundAttendeeId) return;

          if (tileState.isContent) {
            // This is a screen share
            setActiveScreenShareId(tileState.boundAttendeeId);
          } else {
            // This is a regular video
            const stream = tileState.boundVideoStream as CustomMediaStream;
            if (stream?.toURL) {
              setRemoteParticipants(prev => 
                prev.map(p => 
                  p.attendeeId === tileState.boundAttendeeId
                    ? { ...p, streamURL: stream.toURL() }
                    : p
                )
              );
            }
          }
        },
        videoTileWasRemoved: (tileId: number) => {
          console.log('Video tile removed:', tileId);
          setActiveScreenShareId(null);
        }
      });

      // Set up attendee presence observer
      meetingSession.current.audioVideo?.realtimeSubscribeToAttendeeIdPresence(
        (attendeeId: string, present: boolean) => {
          console.log('Participant presence update:', { attendeeId, present });
          if (present) {
            const attendee = attendees.find(a => a.ExternalUserId === attendeeId);
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
            if (activeScreenShareId === attendeeId) {
              setActiveScreenShareId(null);
            }
          }
        }
      );

      console.log('Starting audio/video...');
      await meetingSession.current.audioVideo?.start();
      setIsConnecting(false);

      console.log('Meeting setup complete');
    } catch (error: any) {
      console.error('Error in setupMeeting:', error);
      setError(error.message || 'Failed to join meeting');
      setIsConnecting(false);
    }
  };

  const startScreenShare = async () => {
    try {
      // @ts-ignore: getDisplayMedia is available in react-native-webrtc
      const stream = await mediaDevices.getDisplayMedia() as CustomMediaStream;
      setScreenStream(stream);
      setIsScreenSharing(true);

      // Share screen with meeting
      if (meetingSession.current && stream) {
        await meetingSession.current.audioVideo?.startContentShare(stream);
      }
    } catch (error) {
      console.error('Error starting screen share:', error);
      Alert.alert('Error', 'Failed to start screen sharing');
    }
  };

  const stopScreenShare = async () => {
    try {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);

      // Stop sharing screen with meeting
      if (meetingSession.current) {
        await meetingSession.current.audioVideo?.stopContentShare();
      }
    } catch (error) {
      console.error('Error stopping screen share:', error);
      Alert.alert('Error', 'Failed to stop screen sharing');
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
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const leaveMeeting = async () => {
    try {
      console.log('Leaving meeting...');
      if (meetingSession.current) {
        if (isScreenSharing) {
          await meetingSession.current.audioVideo?.stopContentShare();
        }
        meetingSession.current.audioVideo?.stop();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
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
    <View 
      style={[styles.container, { backgroundColor: color.background }]}
      onTouchStart={() => setShowControls(true)}
    >
      {activeScreenShareId || isScreenSharing ? (
        <ScreenShare
          screenStreamURL={screenStream?.toURL()}
          isSharing={isScreenSharing}
          onStartShare={startScreenShare}
          onStopShare={stopScreenShare}
        />
      ) : (
        <ParticipantGrid
          participants={remoteParticipants}
          localStreamURL={localStream?.toURL()}
          localParticipantName="You"
          isLocalVideoEnabled={isVideoEnabled}
        />
      )}

      {showControls && (
        <MeetingControls
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          isScreenSharing={isScreenSharing}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={isScreenSharing ? stopScreenShare : startScreenShare}
          onLeave={leaveMeeting}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default VideoConference;
