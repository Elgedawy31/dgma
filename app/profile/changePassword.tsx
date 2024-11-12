import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { memo, useCallback, useContext, useState } from "react";
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import TextInputField from "@ui/TextInputField";
import useAxios from "@hooks/useAxios";
import { useThemeColor } from "@hooks/useThemeColor";
import { TouchableOpacity } from "react-native-gesture-handler";
import { userContext } from "@UserContext";

function ResetPassword() {
  const { patch } = useAxios();
  const { user } = useContext(userContext);
  const [loading , setLoading] = useState(false)

  const color = useThemeColor();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    try {
      await patch({ 
        endPoint: `/users/${user?.id}`, 
        body: { password: data.newPassword },
        hasToken: true 
      }).then((res) => {
          if (res?.id) {
            router.back();
            setLoading(false)
          }});
    } catch (error) {
      console.error(error);
      setLoading(false)

    }
    setLoading(false)
  });

  const styles = StyleSheet.create({
    button: {
      backgroundColor: color.primary,
      width: "90%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: 'relative',
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
        title={<Text type="subtitle" title="Reset Password" />}
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
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: 16,
          marginTop: 24,
        }}
      >
        <View style={{ width: "100%", gap: 24 }}>
          <TextInputField
            name="newPassword"
            label="New Password"
            control={control}
            errorMessage={errors.newPassword?.message}
            rules={{ 
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            }}
            secureTextEntry
          />
          <TextInputField
            name="confirmPassword"
            label="Confirm Password"
            control={control}
            errorMessage={errors.confirmPassword?.message}
            rules={{ 
              required: "Please confirm your password",
              validate: (value) => 
                value === newPassword || "Passwords do not match"
            }}
            secureTextEntry
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onSubmit}
        activeOpacity={0.8}
      >
       {loading ? <ActivityIndicator size='small' color='white' /> :  <Text color="white" title="Reset Password" bold />}
        <Ionicons
          name="checkmark-circle-outline"
          size={28}
          color="#fff"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

export default memo(ResetPassword); 