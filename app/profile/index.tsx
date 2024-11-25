import { StyleSheet, View } from "react-native";
import React, { memo, useCallback, useContext, useState } from "react";
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ImageAvatar from "@blocks/ImageAvatar";
import { userContext } from "@UserContext";
import { useForm } from "react-hook-form";
import TextInputField from "@ui/TextInputField";
import useAxios from "@hooks/useAxios";
import { useThemeColor } from "@hooks/useThemeColor";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Toast } from "@ui/Toast";
import useFilePicker from "@hooks/useFile";
import useSecureStorage from "@hooks/useSecureStorage";

type FormData = {
  firstName: string;
  lastName: string;
  role: "user" | "admin" | null;
  email: string;
};

function profile() {
  const color = useThemeColor();
  const { user, setUserData } = useContext(userContext);
  const { readStorage: readToken } = useSecureStorage();
  const [profileLogo, setProfileLogo] = useState<any>(null);
  const [profileUploadedImg, setProfileUploadedImg] = useState<any>(null);
  const { imagePicker, uploadFiles } = useFilePicker();
  const [showModal, setShowModal] = useState(false);
  const [toastType , setToastType] = useState("success");

  const [loading, setLoading] = useState(false);
  const { patchRequest } = useAxios();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: user.name.first,
      lastName: user.name.last,
      role: user?.role,
      email: user.email,
    },
  });

  const onSubmit = async (data: FormData) => {
    let token = await readToken("token") || "";
    setLoading(true);
    await patchRequest({
      endPoint: `users/${user?.id}`,
      body: { name: { first: data?.firstName, last: data?.lastName } , avatar: profileUploadedImg ? profileUploadedImg : user?.avatar },
      hasToken: true,
    })

      .then((res) => {
        if (res?.id) {
          setUserData(token, res);
          setShowModal(true);
          setProfileLogo(false)
          setProfileUploadedImg(false)
        }else{
          setShowModal(true );
          setToastType("error")
        }
        setLoading(false);
      })
      .catch((err) => {
      setShowModal(true );
        setLoading(false);
        setToastType("error")
      });
    setLoading(false);
  };

  const pickLogoImage = useCallback(async () => {
    const res = await imagePicker({ multiple: false });
    if (res) {
      const file = await uploadFiles(res);
      if (file?.length > 0) {
        setProfileUploadedImg(file[0]?.name);
        setProfileLogo(res[0]);
      }
    }
  }, []);

  const clearProfileImage = useCallback(() => {
    setProfileLogo(null);
    setProfileUploadedImg(null);
  }, []);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: color.primary,
      width: "90%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
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
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: 16,
      marginTop: 24,
    },
    avatarContainer: {
      width: "100%",
      alignItems: "center",
    },
    avatar: {
      marginBottom: 24,
      position: 'relative',
    },
    clearButton: {
      position: 'absolute',
      right: -10,
      top: -10,
      backgroundColor: color.background,
      borderRadius: 12,
      padding: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    formContainer: {
      width: "100%",
      gap: 24,
    },
  });

  return (
    <View style={styles.container}>
      <AppBar
        center
        title={<Text type="subtitle" title="Profile" />}
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
        action={
          <Ionicons
            name="settings"
            size={24}
            color={color.text}
            onPress={() => {
              router.push("/profile/settings");
            }}
          />
        }
      />
      <View style={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <TouchableOpacity onPress={pickLogoImage}>
              <ImageAvatar size={100} type="avatar" url={profileLogo?.uri ? profileLogo?.uri : user.avatar} />
            </TouchableOpacity>
            {(profileLogo || profileUploadedImg) && (
              <TouchableOpacity style={styles.clearButton} onPress={clearProfileImage}>
                <Ionicons name="close-circle" size={24} color={color.text} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.formContainer}>
            <TextInputField
              name="firstName"
              label="First Name"
              control={control}
              errorMessage={errors.firstName?.message}
              rules={{ required: "First name is required" }}
            />
            <TextInputField
              name="lastName"
              label="Last Name"
              control={control}
              errorMessage={errors.lastName?.message}
              rules={{ required: "Last name is required" }}
            />
            <TextInputField
              editable={user?.role === "admin"}
              name="role"
              label="Role"
              control={control}
              errorMessage={errors?.role?.message}
              rules={{ required: "Role is required" }}
            />
            <TextInputField
              editable={user?.role === "admin"}
              name="email"
              label="Email"
              control={control}
              errorMessage={errors.email?.message}
              rules={{ required: "Email is required" }}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        activeOpacity={0.8}
      >
        <Text color="white" title={loading ? "loading..." : "Submit"} bold />
      </TouchableOpacity>

      <Toast
        message={toastType === "success" ? 'User Updated Successfully' : 'Error Updating User'}
        isVisible={showModal}
        onHide={() => setShowModal(false)}
        isError={toastType === 'error'}
      />
    </View>
  );
}

export default memo(profile);
