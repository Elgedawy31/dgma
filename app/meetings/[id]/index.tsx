import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import MeetingDetailsCard from "@components/meetings/MeetingDetailsCard";
import MeetingGuestList from "@components/meetings/MeetingGuestList";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { memo } from "react";
import { View, ScrollView } from "react-native";

const guests = [
  {
    id: '1',
    name: 'Ahmed',
    role: 'UX / UI Designer',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  },
  {
    id: '2',
    name: 'Aya Ibrahim',
    role: 'UX / UI Designer',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  },
  {
    id: '3',
    name: 'Maha Ahmed',
    role: 'UX / UI Designer',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  },
  {
    id: '4',
    name: 'Maha Ahmed',
    role: 'UX / UI Designer',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  },
  {
    id: '5',
    name: 'Mohamed Khaled',
    role: 'UX / UI Designer',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  },
  {
    id: '6',
    name: 'Mohamed Khaled',
    role: 'UX / UI Designer',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  },
  {
    id: '7',
    name: 'Mohamed Khaled',
    role: 'UX / UI Designer',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  },
];
function MeetingDetails() {
  const color = useThemeColor();

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Meeting Details" />}
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
      <View
        style={{ flex: 1 , gap:16 , paddingHorizontal: 16, paddingBottom: 20 }}
      >
        <MeetingDetailsCard
          host="John Doe"
          date="2021-09-01"
          time="10:00 AM"
          title="Landing page "
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />

        <MeetingGuestList guests={guests} />

      </View>
    </View>
  );
}

export default memo(MeetingDetails);
