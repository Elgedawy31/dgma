import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import MeetingCard from "@components/meetings/MeetingCard";
import MeetingsHead from "@components/meetings/MeetingsHead";
import NoMeetings from "@components/meetings/NoMeetings";
import { NotificationContext, NotificationContextType } from "@components/NotificationSystem";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { memo, useState, useContext, useEffect, useMemo } from "react";
import { View, ScrollView } from "react-native";
import { UserBase } from "@model/types";

// Type from MeetingCard
type AssignedTo = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

// Meeting interface with proper types
interface Meeting {
  id: string;
  title: string;
  description: string;
  assignedTo: AssignedTo[];
}

// Helper to convert UserBase to AssignedTo format
const convertToAssignedTo = (user: UserBase): AssignedTo => ({
  id: user._id,
  name: `${user.name.first} ${user.name.last}`,
  email: `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@gmail.com`,
  avatar: user.avatar || "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain" // Default avatar
});

// Mock data for meetings
const MOCK_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "UI/UX&Graphic Team meeting",
    description: "Market research - User research",
    assignedTo: [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "2",
        name: "Sarah Smith",
        email: "sarah.smith@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "4",
        name: "Emma Wilson",
        email: "emma.wilson@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
    ],
  },
  {
    id: "2",
    title: "Product Development Sync",
    description: "Weekly sprint planning and feature discussion",
    assignedTo: [
      {
        id: "5",
        name: "David Brown",
        email: "david.brown@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "6",
        name: "Lisa Anderson",
        email: "lisa.anderson@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
    ],
  },
  {
    id: "3",
    title: "Marketing Strategy Review",
    description: "Q4 campaign planning and budget review",
    assignedTo: [
      {
        id: "7",
        name: "Alex Turner",
        email: "alex.turner@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "8",
        name: "Rachel Green",
        email: "rachel.green@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "9",
        name: "Chris Martin",
        email: "chris.martin@gmail.com",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
    ],
  },
];

function Meetings() {
  const color = useThemeColor();
  const [open, setOpen] = useState(false);
  const { lastNotificationSenderId } = useContext<NotificationContextType>(NotificationContext);

  // Check if any meeting has the notification sender
  const meetingWithNotification = useMemo(() => {
    if (!lastNotificationSenderId) return null;
    return MOCK_MEETINGS.find(meeting => 
      meeting.assignedTo.some(user => user.id === lastNotificationSenderId)
    );
  }, [lastNotificationSenderId]);

  // Log notification details
  useEffect(() => {
    if (lastNotificationSenderId && meetingWithNotification) {
      console.log('Last notification sender ID on meetings page:', lastNotificationSenderId);
      console.log('Found in meeting:', meetingWithNotification.title);
    }
  }, [lastNotificationSenderId, meetingWithNotification]);

  const hasNotifications = Boolean(meetingWithNotification);


  console.log(lastNotificationSenderId)

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
      >
        <MeetingsHead 
          showBtn={MOCK_MEETINGS?.length > 0} 
          hasNotifications={hasNotifications}
        />
        {MOCK_MEETINGS.length > 0 ? (
          MOCK_MEETINGS.map((meeting) => (
            <MeetingCard
              id={meeting.id}
              key={meeting.id}
              title={meeting.title}
              description={meeting.description}
              assignedTo={meeting.assignedTo}
              hasNotification={meeting.id === meetingWithNotification?.id}
            />
          ))
        ) : (
          <NoMeetings 
            setOpen={setOpen} 
            hasNotifications={hasNotifications}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default memo(Meetings);
