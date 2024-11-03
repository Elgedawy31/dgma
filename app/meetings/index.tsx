import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import CustomListItem from "@components/SettingsListItem";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { memo, useState } from "react";
import { View } from "react-native";

function Meetings() {
  const color = useThemeColor();
  const [isActive, setIsActive] = useState(false);
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
    </View>
  );
}
export default memo(Meetings);
