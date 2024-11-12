//#region Imports
import Text from "@blocks/Text";
import Auth from "@components/Auth";
import { memo, useCallback, useState } from "react";
import { router } from "expo-router";
import Button from "@ui/Button";
import TextInputField from "@ui/TextInputField";
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import useAxios from "@hooks/useAxios";
import { useThemeColor } from "@hooks/useThemeColor";
//#endregion

function ForgetPassword() {
  const { post } = useAxios();
  const [msg, setMsg] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = useThemeColor();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({ defaultValues: { email: "" } });

  const onSubmit = handleSubmit((data: { email: string }) => {
    const func = async () => {
      setLoading(true);
      await post({
        endPoint: "users/forgetPassword",
        body: data,
        hasToken: false,
      })
        .then((res) => {
          if (res["message"]) {
            setMsg(res.message);
            setModalVisible(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
          setLoading(false);
        });
    };
    func();
  });

  const handleNavigateToLogin = useCallback(() => {
    setModalVisible(false);
    router.back();
  }, []);

  console.log(msg);
  return (
    <Auth>
      <View style={styles(colors).container}>
        <View style={styles(colors).form}>
          <View style={styles(colors).header}>
            <Text type="title" title="Forget Password" />
            <Text
              type="body"
              title="Enter your email adderss to reset password."
            />
          </View>
          <TextInputField
            name="email"
            type="email"
            label="Email"
            control={control}
            errorMessage={errors.email?.message}
            rules={{ required: "Email is required" }}
          />
        </View>
      </View>
      <Button
        label={loading ? "loading..." : "Reset Password"}
        onPress={onSubmit}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(colors).centeredView}>
          <View style={styles(colors).modalView}>
            {msg && <Text type="body" title={`${msg}`} />}
            <TouchableOpacity
              onPress={handleNavigateToLogin}
              style={{
                backgroundColor: colors.primary,
                width: "90%",
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
                alignItems: "center",
              }}
            >
              <Text type="body" title={"Login Page"} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Auth>
  );
}

export default memo(ForgetPassword);

//#region Styles
const styles = (colors:any) => StyleSheet.create({
  form: { display: "flex", gap: 12 },
  container: { flex: 1, justifyContent: "space-between" },
  header: { width: "60%", display: "flex", alignSelf: "flex-start", gap: 10 },
  // Added modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalButton: {
    marginTop: 20,
  },
});
//#endregion
