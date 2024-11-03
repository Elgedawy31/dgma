import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import MeetingsHead from "@components/meetings/MeetingsHead";
import NoMeetings from "@components/meetings/NoMeetings";
import CustomListItem from "@components/SettingsListItem";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { memo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text as TextR,
  TouchableOpacity,
  View,
} from "react-native";

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
      <View style={{ paddingHorizontal: 12, flex: 1 }}>
        <MeetingsHead showBtn={false} />

        <NoMeetings setOpen={setOpen} />
      </View>
    </View>
  );
}
export default memo(Meetings);
