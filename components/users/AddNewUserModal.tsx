import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import IconWrapper from "@components/IconWrapper";
import useAxios from "@hooks/useAxios";

interface NewUserProps {
  isVisible: boolean;
  onClose: () => void;
  setTaskAdded: (val: (val: boolean) => void) => void;
}

interface UserData {
  email: string;
  password: string;
  name: {
    first: string;
    second?: string;
    last: string;
  };
}

const NewUser: React.FC<NewUserProps> = ({
  isVisible,
  onClose,
  setTaskAdded,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: {
      email: "",
      password: "",
      name: { first: "", second: "", last: "" },
    },
  });

  const {post} = useAxios();

  const onSubmitForm = handleSubmit(async (data: UserData) => {
    await post({ endPoint: "users/", body: data, hasToken: true })
      .then((res) => {
        if (res) {
          onClose();
          reset({
            email: "",
            password: "",
            name: { first: "", second: "", last: "" },
          });
          setTaskAdded((prev) => !prev);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
      });
  });

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={styles.modal}
      propagateSwipe
      avoidKeyboard
    >
      <View style={styles.modalView}>
        <View style={styles.handleBar} />

        <View style={styles.header}>
          <Text style={styles.title}>User Information</Text>
          <IconWrapper
            onPress={onClose}
            size={36}
            Icon={<Ionicons name="close" size={24} color="#000" />}
          />
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Email"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Password"
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        {/* Name Fields */}
        <Text style={styles.label}>First Name</Text>
        <Controller
          control={control}
          name="name.first"
          rules={{ required: "First name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter First Name"
            />
          )}
        />
        {errors.name?.first && (
          <Text style={styles.errorText}>{errors.name.first.message}</Text>
        )}

        <Text style={styles.label}>Second Name (Optional)</Text>
        <Controller
          control={control}
          name="name.second"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Second Name"
            />
          )}
        />

        <Text style={styles.label}>Last Name</Text>
        <Controller
          control={control}
          name="name.last"
          rules={{ required: "Last name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Last Name"
            />
          )}
        />
        {errors.name?.last && (
          <Text style={styles.errorText}>{errors.name.last.message}</Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmit(onSubmitForm)}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#DEE2E6",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#515151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  submitButton: {
    backgroundColor: "#002B5B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default NewUser;
