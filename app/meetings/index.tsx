import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import MeetingCard from "@components/meetings/MeetingCard";
import MeetingsHead from "@components/meetings/MeetingsHead";
import NoMeetings from "@components/meetings/NoMeetings";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { memo, useState } from "react";
import { View, ScrollView } from "react-native";

// Mock data for meetings
const MOCK_MEETINGS = [
  {
    id: "1",
    title: "UI/UX&Graphic Team meeting",
    description: "Market research - User research",
    assignedTo: [
      {
        id: "1",
        email: "john@gmail.com",
        name: "John Doe",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "2",
        email: "sarah@gmail.com",
        name: "Sarah Smith",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "3",
        email: "mike@gmail.com",
        name: "Mike Johnson",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "4",
        email: "emma@gmail.com",
        name: "Emma Wilson",
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
        email: "david@gmail.com",
        name: "David Brown",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "6",
        email: "lisa@gmail.com",
        name: "Lisa Anderson",
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
        email: "alex@gmail.com",
        name: "Alex Turner",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "8",
        email: "rachel@gmail.com",
        name: "Rachel Green",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
      {
        id: "9",
        email: "chris@gmail.com",
        name: "Chris Martin",
        avatar: "https://th.bing.com/th/id/OIP.pegfGc8sWHh2_RuwiuAknwHaHZ?rs=1&pid=ImgDetMain",
      },
    ],
  },
];

function Meetings() {
  const color = useThemeColor();
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Meeting Room" />}
        leading={
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
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
        <MeetingsHead showBtn={MOCK_MEETINGS?.length > 0} />
        {MOCK_MEETINGS.length > 0 ? (
          MOCK_MEETINGS.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              title={meeting.title}
              description={meeting.description}
              assignedTo={meeting.assignedTo}
            />
          ))
        ) : (
          <NoMeetings setOpen={setOpen} />
        )}
      </ScrollView>
    </View>
  );
}

export default memo(Meetings);