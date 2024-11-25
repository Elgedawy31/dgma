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
import { useThemeColor } from "@hooks/useThemeColor";

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

  const { postRequest } = useAxios();
  const { imagePicker, uploadFiles } = useFilePicker();
  const [groupLogo, setGroupLogo] = useState<any>(null);
  const [groupUploadedImg, setGroupUploadedImg] = useState<any>(null);
  const [loading , setLoading] = useState(false);

  const colors = useThemeColor()
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

    await postRequest({ endPoint: "users/", body: submissionData, hasToken: true })
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
      style={styles(colors).modal}
      propagateSwipe
      avoidKeyboard
    >
      <ScrollView style={styles(colors).modalView}>
        <View style={styles(colors).handleBar} />

        <View style={styles(colors).header}>
          <Text style={styles(colors).title}>User Information</Text>
          <IconWrapper
            onPress={onClose}
            size={36}
            Icon={<Ionicons name="close" size={24} color={colors.text} />}
          />
        </View>

        {/* Image Upload Section */}
        <View style={styles(colors).imageUploadContainer}>
          <TouchableOpacity style={styles(colors).uploadButton} onPress={pickLogoImage}>
            {groupLogo ? (
              <Image source={{ uri: groupLogo.uri }} style={styles(colors).previewImage} />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={24} color ={colors.primary} />
                <Text style={styles(colors).uploadText}>Avatar</Text>
              </>
            )}
          </TouchableOpacity>
          {groupUploadedImg && (
            <Text style={styles(colors).fileName}>File: {groupUploadedImg}</Text>
          )}
        </View>

        {/* Email */}
        <Text style={styles(colors).label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles(colors).input , {color:colors.text}]}
              placeholderTextColor={colors.body}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Email"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && (
          <Text style={styles(colors).errorText}>{errors.email.message}</Text>
        )}

        {/* Password */}
        <Text style={styles(colors).label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles(colors).input , {color:colors.text}]}
              placeholderTextColor={colors.body}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Password"
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles(colors).errorText}>{errors.password.message}</Text>
        )}

        {/* Name Fields */}
        <Text style={styles(colors).label}>First Name</Text>
        <Controller
          control={control}
          name="name.first"
          rules={{ required: "First name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles(colors).input , {color:colors.text}]}
              placeholderTextColor={colors.body}
              onChangeText={onChange}
              value={value}
              placeholder="Enter First Name"
            />
          )}
        />
        {errors.name?.first && (
          <Text style={styles(colors).errorText}>{errors.name.first.message}</Text>
        )}

        <Text style={styles(colors).label}>Second Name (Optional)</Text>
        <Controller
          control={control}
          name="name.second"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles(colors).input , {color:colors.text}]}
              placeholderTextColor={colors.body}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Second Name"
            />
          )}
        />

        <Text style={styles(colors).label}>Last Name</Text>
        <Controller
          control={control}
          name="name.last"
          rules={{ required: "Last name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles(colors).input , {color:colors.text}]}
              placeholderTextColor={colors.body}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Last Name"
            />
          )}
        />
        {errors.name?.last && (
          <Text style={styles(colors).errorText}>{errors.name.last.message}</Text>
        )}

        <TouchableOpacity style={styles(colors).submitButton} onPress={onSubmitForm}>
         {loading ?<ActivityIndicator size='small' color='white' /> :  <Text style={styles(colors).submitButtonText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles =(colors:any) =>  StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalView: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.body,
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
    color:colors.text
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
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
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
    color: colors.primary,
    fontWeight: "500",
  },

  fileName: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: colors.card,
  },
  submitButton: {
    backgroundColor: colors.primary,
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