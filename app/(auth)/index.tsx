import React, { memo, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import Text from "@blocks/Text";
import Auth from "@components/Auth";
import { useThemeColor } from "@hooks/useThemeColor";
import Button from "@ui/Button";
import TextInputField from "@ui/TextInputField";
import useStorage from "@hooks/useStorage";
import useAxios from "@hooks/useAxios";
import axios from "axios";
import Constants from "expo-constants";
import { userContext } from "@UserContext";
import { Toast } from "@components/ui/Toast";

type LoginModel = {
  email: string;
  password: string;
};

function Login() {
  const colors = useThemeColor();
  const { setUserData, user } = useContext(userContext);
  const { postRequest } = useAxios();
  const [loading, setLoading] = React.useState(false);
  const [toastVisible, setToastVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginModel>({
    defaultValues: { email: "", password: "" },
  });

  const showError = (message: string) => {
    setErrorMessage(message);
    setToastVisible(true);
  };

  const onSubmit = handleSubmit(async (data: LoginModel) => {
    setLoading(true);
    await postRequest({ endPoint: "users/login", body: data, hasToken: false })
      .then((res) => {
        console.log(res)
        if (res?.token) {
          setUserData(res.token, res.user);
          router.replace("/(tabs)/");
        } else {
          showError("Invalid Username or Password");
        }
      })
      .catch((err) => {
        const errorMsg = err?.response?.data?.message || "An error occurred during login";
        showError(errorMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const onForgetPassword = () => {
    console.log("Forget Password");
    router.push("/forget-password");
  };

  return (
    <Auth>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text type="title" title="Welcome Back." />
          <View style={styles.header}>
            <TextInputField
              name="email"
              type="email"
              label="Email"
              control={control}
              errorMessage={errors.email?.message}
              rules={{ required: "Email is required" }}
            />
            <TextInputField
              hasIcon
              name="password"
              type="password"
              label="Password"
              control={control}
              errorMessage={errors.password?.message}
              rules={{ required: "Password is required" }}
            />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Button
              type="text"
              align="flex-end"
              label="Forgot Password"
              txtColor={colors.textVariant}
              onPress={onForgetPassword}
            />
          </View>
        </View>
        <Button type="primary" label={loading ? 'loading...' : 'Login'} onPress={onSubmit} />
      </View>
      <Toast 
        isVisible={toastVisible}
        message={errorMessage}
        onHide={() => setToastVisible(false)}
        isError={true}
      />
    </Auth>
  );
}
export default memo(Login);

const styles = StyleSheet.create({
  form: { flex: 1, gap: 8 },
  header: { display: "flex", gap: 28 },
  container: { flex: 1, justifyContent: "space-between" },
});
