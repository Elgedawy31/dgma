import AppBar from "@blocks/AppBar";
import { useCallback } from "react";
import Text from "@blocks/Text";
import CustomSwitch from "@components/CustomSwitch";
import CustomListItem from "@components/SettingsListItem";
import { Ionicons ,AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { ThemeContext } from "@ThemeContext";
import { router } from "expo-router";
import useSecureStorage from "@hooks/useSecureStorage";
import useStorage from "@hooks/useStorage";
import { memo, useContext } from "react";
import { View } from "react-native";
import useAxios from "@hooks/useAxios";

import { userContext } from '@UserContext';
function Settings() {
  const color = useThemeColor();
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, logout} = useContext(userContext);
  const {postRequest} = useAxios();
  // Helper function to handle theme toggle
  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const onLogoutPress = useCallback(async () => {
    await postRequest({ endPoint: "/users/logout" })
    logout();
    router.replace("/(auth)/");
  }, []);
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
        {user?.role ==='admin' && <CustomListItem
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
        />}
      
         <CustomListItem
          isActive={false}
          setIsActive={() => {}}
          text="Change Password"
          icon={
            <Ionicons
              name='lock-closed-outline'
              size={24}
              color={color.primary}
            />
          }
          onPress={() => router.push("/profile/changePassword")}
          type="navigate"
        />
         <CustomListItem
          isActive={false}
          setIsActive={() => {}}
          text="Logout"
          icon={
            <AntDesign name="logout" size={24} color={color.primary} />
          }
          onPress={onLogoutPress}
          type="navigate"
        />
      </View>
    </View>
  );
}

export default memo(Settings);