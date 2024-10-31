import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import CustomSwitch from "@components/CustomSwitch";
import CustomListItem from "@components/SettingsListItem";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { memo, useState } from "react";
import { View } from "react-native";

function Settings() {
  const color = useThemeColor();
  const [isActive, setIsActive] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Settings" />}
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

      <View style={{ marginTop: 24  }}>
        <CustomListItem
        isActive={isActive}
        setIsActive={setIsActive}
          text="Users List"
          icon={
            <Ionicons
              name="people-outline"
              size={24}
              color={color.primary}
            />
          }
          onPress={() => router.push("/profile/users")}
          type="navigate"
        />
        <CustomListItem
            isActive={isActive}
            setIsActive={setIsActive}
          text="Dark Mode"
          icon={
            <Ionicons
              name="moon-outline"
              size={24}
              color={color.primary}
            />
          }
          onPress={() =>  setIsActive(!isActive)} 
          type="switch"
        />
      </View>
    </View>
  );
}
export default memo(Settings);
