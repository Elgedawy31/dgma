import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import CustomSwitch from "@components/CustomSwitch";
import CustomListItem from "@components/SettingsListItem";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { ThemeContext } from "@ThemeContext";
import { router } from "expo-router";
import { memo, useContext } from "react";
import { View } from "react-native";

function Settings() {
  const color = useThemeColor();
  const { theme, setTheme } = useContext(ThemeContext);
  
  // Helper function to handle theme toggle
  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  console.log(theme)
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Settings" />}
        leading={
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme === 'dark' ? 'white' : 'black'}
            onPress={() => {
              router.back();
            }}
          />
        }
      />
      
      <View style={{ marginTop: 24 }}>
        <CustomListItem
          isActive={false}
          setIsActive={() => {}}
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
          isActive={theme === 'dark'}
          setIsActive={() => handleThemeToggle()}
          text="Dark Mode"
          icon={
            <Ionicons
              name="moon-outline"
              size={24}
              color={color.primary}
            />
          }
          onPress={handleThemeToggle}
          type="switch"
        />
      </View>
    </View>
  );
}

export default memo(Settings);