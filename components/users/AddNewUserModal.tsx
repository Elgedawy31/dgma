import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import IconWrapper from "@components/IconWrapper";
import useAxios from "@hooks/useAxios";
import useFilePicker from "@hooks/useFile";

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
  avatar?: string;
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
      avatar: "",
    },
  });

  const { post } = useAxios();
  const { imagePicker, uploadFiles } = useFilePicker();
  const [groupLogo, setGroupLogo] = useState<any>(null);
  const [groupUploadedImg, setGroupUploadedImg] = useState<any>(null);
  const [loading , setLoading] = useState(false);

  const pickLogoImage = useCallback(async () => {
    const res = await imagePicker({ multiple: false });
    if (res) {
      const file = await uploadFiles(res);
      if (file?.length > 0) {
        setGroupUploadedImg(file[0]?.name);
        setGroupLogo(res[0]);
      }
    }
  }, []);

  const onSubmitForm = handleSubmit(async (data: UserData) => {
    // Include the image in the submission data
    setLoading(true);
    const submissionData = {
      ...data,
      avatar: groupUploadedImg,
    };

    await post({ endPoint: "users/", body: submissionData, hasToken: true })
      .then((res) => {
        if (res) {
          setLoading(false)
          onClose();
          reset({
            email: "",
            password: "",
            name: { first: "", second: "", last: "" },
            avatar: "",
          });
          setGroupLogo(null);
          setGroupUploadedImg(null);
          setTaskAdded((prev) => !prev);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setLoading(false)

      });
      setLoading(false)

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
      <ScrollView style={styles.modalView}>
        <View style={styles.handleBar} />

        <View style={styles.header}>
          <Text style={styles.title}>User Information</Text>
          <IconWrapper
            onPress={onClose}
            size={36}
            Icon={<Ionicons name="close" size={24} color="#000" />}
          />
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickLogoImage}>
            {groupLogo ? (
              <Image source={{ uri: groupLogo.uri }} style={styles.previewImage} />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={24} color="#002B5B" />
                <Text style={styles.uploadText}>Upload Logo</Text>
              </>
            )}
          </TouchableOpacity>
          {groupUploadedImg && (
            <Text style={styles.fileName}>File: {groupUploadedImg}</Text>
          )}
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

        <TouchableOpacity style={styles.submitButton} onPress={onSubmitForm}>
         {loading ?<ActivityIndicator size='small' color='white' /> :  <Text style={styles.submitButtonText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
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
  imageUploadContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding:8 ,
    borderWidth: 2,
    borderColor: "#002B5B",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadText: {
    marginTop: 6,
    fontSize: 12,
    color: "#002B5B",
    fontWeight: "500",
  },

  fileName: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
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