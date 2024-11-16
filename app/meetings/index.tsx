import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import MeetingCard from "@components/meetings/MeetingCard";
import MeetingsHead from "@components/meetings/MeetingsHead";
import NoMeetings from "@components/meetings/NoMeetings";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
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

interface UserContextType {
  user: {
    id: string;
    email: string;
    role: string | null;
    name: { first: string; last: string };
  };
}

function Meetings() {
  const color = useThemeColor();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(userContext) as UserContextType;
  const { get, post } = useAxios();

  const fetchMeetings = async () => {
    try {
      const response = await get({ endPoint: 'meet' });
      
      if (Array.isArray(response)) {
        console.log('Active meetings:', response);
        setMeetings(response);
      } else {
        console.log('Invalid meetings response:', response);
        setMeetings([]);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching meetings:', err);
      setError(err.message || 'Failed to load meetings');
      setMeetings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMeetings();
  };

  const createNewMeeting = async () => {
    try {
      // Create a new meeting
      const createResponse = await post({ 
        endPoint: 'meet',
        body: {
          isPrivate: false,
          createdBy: user.id
        }
      });
      
      console.log('Create meeting response:', createResponse);

      if (!createResponse?.meetingResponse?.Meeting?.MeetingId) {
        throw new Error('Failed to get meeting ID');
      }

      // Add current user to the meeting
      const joinResponse = await post({
        endPoint: 'meet/add-user',
        body: {
          userId: user.id,
          meetingId: createResponse.meetingResponse.Meeting.MeetingId
        }
      });

      console.log('Join meeting response:', joinResponse);

      if (!joinResponse?.Attendee) {
        throw new Error('Failed to join meeting');
      }

      // Navigate to the meeting room
      router.push(`/meetings/${createResponse.meetingResponse.Meeting.MeetingId}`);
      
      // Refresh the meetings list
      fetchMeetings();
    } catch (err: any) {
      console.error('Error creating meeting:', err);
      setError(err.message || 'Failed to create meeting');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <AppBar
          center
          title={<Text type="subtitle" title="Meeting Room" />}
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
          <Text type="body" title="Loading meetings..." />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Meeting Room" />}
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
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[color.primary]}
            tintColor={color.primary}
          />
        }
      >
        <MeetingsHead 
          showBtn={true}
          onCreateMeeting={createNewMeeting}
        />
        
        {error && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text type="error" title={error} />
          </View>
        )}

        {meetings.length === 0 ? (
          <NoMeetings onCreateMeeting={createNewMeeting} />
        ) : (
          meetings.map((meeting) => (
            <MeetingCard
              key={meeting.MeetingId}
              id={meeting.MeetingId}
              title={`Meeting by ${meeting.createdBy.name.first} ${meeting.createdBy.name.last}`}
              description={`Created by: ${meeting.createdBy.email}`}
              assignedTo={[{
                id: meeting.createdBy._id,
                name: `${meeting.createdBy.name.first} ${meeting.createdBy.name.last}`,
                email: meeting.createdBy.email,
                avatar: meeting.createdBy.avatar
              }]}
              onPress={() => router.push(`/meetings/${meeting.MeetingId}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default React.memo(Meetings);
