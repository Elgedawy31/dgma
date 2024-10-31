import { StyleSheet, View } from "react-native";
import React, { memo, useCallback, useContext } from "react";
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ImageAvatar from "@blocks/ImageAvatar";
import { userContext } from "@UserContext";
import { useForm } from "react-hook-form";
import TextInputField from "@ui/TextInputField";
import Button from "@ui/Button";
import useAxios from "@hooks/useAxios";
import useSecureStorage from "@hooks/useSecureStorage";
import useStorage from "@hooks/useStorage";
import { useThemeColor } from "@hooks/useThemeColor";
import { TouchableOpacity } from "react-native-gesture-handler";

function profile() {
  const { post } = useAxios();
  const { removeStorage: removeToken } = useSecureStorage();
  const { removeStorage } = useStorage();
  const color = useThemeColor();
  const { user, resetUser } = useContext(userContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: `${user.name.first} ${user.name.last}`,
      role: user.role,
      email: user.email || "admin@admin.com",
      birth: "4 - Novmber 1999",
    },
  });
  console.log(user);
  const onLogoutPress = useCallback(async () => {
    await post({ endPoint: "/users/logout" }).then(async (res) => {
      console.log(res);
      await removeToken("token");
      await removeStorage("role");
      await removeStorage("name");
      resetUser();
      router.replace("/(auth)/");
    });
  }, []);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: color.primary,
      width: "90%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position:'relative',
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      marginHorizontal: "5%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    icon: {
      marginLeft: 4,
      position: "absolute",
      right: 8,
    },
  });
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Profile" />}
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
        action={
          <Ionicons
            name="settings"
            size={24}
            color="black"
            onPress={() => {
              router.push("/profile/settings");
            }}
          />
        }
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: 16,
          marginTop: 24,
        }}
      >
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ marginBottom: 24 }}>
            <ImageAvatar size={100} type="avatar" url={user.profilePicture} />
          </View>
          <View style={{ width: "100%", gap: 24 }}>
            <TextInputField
              capitalize
              name="name"
              label="Full Name"
              control={control}
              errorMessage={errors.name?.message}
              rules={{ required: "Name is required" }}
            />
            <TextInputField
              name="role"
              label="Role"
              control={control}
              errorMessage={errors.role?.message}
              rules={{ required: "role is required" }}
            />
            <TextInputField
              name="email"
              label="Email"
              control={control}
              errorMessage={errors.email?.message}
              rules={{ required: "role is required" }}
            />
            <TextInputField
              name="birth"
              label="Date of Birth"
              control={control}
              errorMessage={errors.birth?.message}
              rules={{ required: "Date of Birth is required" }}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onLogoutPress}
        activeOpacity={0.8}
      >
        <Text color="white" title="Logout" bold />
        <Ionicons
          name="exit"
          size={28}
          color="#fff"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}
export default memo(profile);

const styles = StyleSheet.create({});
