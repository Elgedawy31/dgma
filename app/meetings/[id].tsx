import React, { useEffect, useState, useContext } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import VideoConference from '@components/meetings/VideoConference';
import { useThemeColor } from '@hooks/useThemeColor';
import AppBar from '@blocks/AppBar';
import Text from '@blocks/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { userContext } from '../../controllers/context/UserContextProvider';
import useAxios from '@hooks/useAxios';

interface Meeting {
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
  TenantIds: any[];
  createdBy: {
    _id: string;
    avatar: string;
    email: string;
    name: {
      first: string;
      last: string;
    };
  };
  isPrivate: boolean;
}

interface Attendee {
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
}

interface UserContextType {
  user: {
    id: string;
    email: string;
    role: string | null;
    name: { first: string; last: string };
  };
}

export default function MeetingRoom() {
  const params = useLocalSearchParams();
  const meetingId = params.id as string;
  const color = useThemeColor();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(userContext) as UserContextType;
  const { get, post, deleteFunc } = useAxios();

  const fetchMeetingDetails = async () => {
    try {
      if (!meetingId) {
        throw new Error('Meeting ID is required');
      }

      console.log('Fetching meeting details for:', meetingId);

      // Get all meetings to find this one
      const meetingsResponse = await get({ endPoint: 'meet' });
      console.log('Meetings response:', meetingsResponse);

      const currentMeeting = Array.isArray(meetingsResponse) 
        ? meetingsResponse.find(m => m.MeetingId === meetingId)
        : null;

      if (!currentMeeting) {
        throw new Error('Meeting not found');
      }

      console.log('Current meeting:', currentMeeting);
      setMeeting(currentMeeting);

      // Get attendees
      const attendeesResponse = await get({ 
        endPoint: `meet/attendees?meetingId=${meetingId}`
      });

      console.log('Attendees response:', attendeesResponse);

      if (!attendeesResponse?.attendees) {
        throw new Error('Failed to fetch attendees');
      }

      const currentAttendees = attendeesResponse.attendees;

      // Check if current user is already in the meeting
      const isUserInMeeting = currentAttendees.some(
        (a: Attendee) => a.ExternalUserId === user.id
      );

      // If user is not in meeting, add them
      if (!isUserInMeeting) {
        console.log('Adding user to meeting:', user.id);
        const joinResponse = await post({
          endPoint: 'meet/add-user',
          body: {
            userId: user.id,
            meetingId
          }
        });
        
        console.log('Join meeting response:', joinResponse);
        
        // Add the new attendee to the list
        if (joinResponse?.Attendee) {
          currentAttendees.push({
            ...joinResponse.Attendee,
            userDetails: {
              _id: user.id,
              name: user.name,
              email: user.email,
              avatar: ''
            }
          });
        }
      }

      setAttendees(currentAttendees);
    } catch (err: any) {
      console.error('Error in fetchMeetingDetails:', err);
      setError(err.message || 'Failed to load meeting details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meetingId) {
      fetchMeetingDetails();
    }
  }, [meetingId]);

  const handleLeaveMeeting = async () => {
    try {
      if (!meetingId) {
        throw new Error('Meeting ID is required');
      }

      console.log('Leaving meeting:', meetingId);
      
      await deleteFunc({
        endPoint: 'meet',
        body: { meetingId }
      });

      router.back();
    } catch (err: any) {
      console.error('Error in handleLeaveMeeting:', err);
      setError(err.message || 'Failed to leave meeting');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <AppBar
          center
          title={<Text type="subtitle" title="Loading..." />}
          leading={
            <Ionicons
              name="chevron-back"
              size={24}
              color={color.text}
              onPress={() => router.back()}
            />
          }
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text type="body" title="Loading meeting details..." />
        </View>
      </View>
    );
  }

  if (error || !meeting) {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <AppBar
          center
          title={<Text type="subtitle" title="Error" />}
          leading={
            <Ionicons
              name="chevron-back"
              size={24}
              color={color.text}
              onPress={() => router.back()}
            />
          }
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text type="body" title={error || 'Meeting not found'} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Video Conference" />}
        leading={
          <Ionicons
            name="chevron-back"
            size={24}
            color={color.text}
            onPress={handleLeaveMeeting}
          />
        }
      />
      <VideoConference 
        meetingId={meeting.MeetingId}
        userId={user.id}
        attendees={attendees}
        onLeave={handleLeaveMeeting}
        meetingData={meeting}
      />
    </View>
  );
}
