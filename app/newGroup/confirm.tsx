import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Text as TextR,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import { useThemeColor } from "@hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import useFilePicker from "@hooks/useFile";
import useAxios from "@hooks/useAxios";

type MemberProps = {
  id: string;
  name: {
    first: string;
    last: string;
  };
  role: string;
  avatar: string;
}; 
const confirm = () => {
  const { members, totalNum } = useLocalSearchParams();
  const selectedMembers: MemberProps[] = JSON.parse(members as string);
  const { post } = useAxios();
  const colors = useThemeColor();
  const  [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const { imagePicker, uploadFiles } = useFilePicker();
  const [groupLogo, setGroupLogo] = useState<any>(null);
  const [groupUploadedImg, setGroupUploadedImg] = useState<any>(null);

  const handleCreateGroup = async () => {
    setLoading(true);
    await post({
      endPoint: "channels", 
      body: {
        name: groupName,  
        photo: groupUploadedImg,
        members:selectedMembers,
        type: "group",
      }, 
    })
      .then((res) => { 
        if (res) {
          router.replace("/(tabs)/messaging"); 
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setLoading(false);
      });
  }; 

  const pickLogoImage = useCallback(async () => { 
    const res = await imagePicker({ multiple: false });
    if (res) {
        const file =await uploadFiles(res);
       if(file?.length > 0){
        setGroupUploadedImg(file[0]?.name); 
        setGroupLogo(res[0]); 
       }
    }
}, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        leading="back"
        title={
          <View>
            <Text type="subtitle" title="Confirm Group" />
          </View>
        }
      />

      <View style={styles(colors).inputContainer}>
        <TouchableOpacity
          onPress={pickLogoImage}
          style={styles(colors).iconContainer}
        >
          {groupLogo ? (
            <Image
              source={{ uri: groupLogo.uri }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
          ) : (
            <Ionicons name="camera" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
        <TextInput
          style={styles(colors).input}
          placeholder="Group name"
          placeholderTextColor="#666"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      <TextR
        style={{
          color: colors.text,
          margin: 16,
          fontWeight: "500",
          fontSize: 18,
        }}
      >
        Group members: {selectedMembers.length} of {totalNum}
      </TextR>
      <FlatList
        data={selectedMembers}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles(colors).memberList}
        renderItem={({ item }) => (
          <View style={styles(colors).memberItem}>
            <Image
              source={{ uri: item.avatar }}
              style={styles(colors).memberImage}
            />
            <TextR style={styles(colors).memberName}>
              {item.name.first} {item.name.last}
            </TextR>
            <TextR style={styles(colors).memberRole}>{item.role}</TextR>
          </View>
        )}
      />

      {groupName?.length > 3 && (
        <TouchableOpacity
          style={[
            styles(colors).createButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleCreateGroup}
        >
          {loading ? (
            <ActivityIndicator size="small" color='white' />
          ) : (
            <TextR style={styles(colors).createButtonText}>Create Group</TextR>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
 
const styles = (colors: any) =>
  StyleSheet.create({
    // ... existing styles ...
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginVertical: 24,
      paddingVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: colors.card ,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      color: colors.text,
    },
    memberList: {
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    memberItem: {
      alignItems: "center",
      width: "33.33%",
      marginVertical: 12,
    },
    memberImage: { 
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 8,
    },
    memberName: {
      fontWeight: "400",
      fontSize: 12,
      color:colors.text 
    },
    memberRole: {
      color: colors.body ,   
    },
    createButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 16,
      marginBottom: 24,
    },
    createButtonText: {
      color: "white",
      fontWeight: "bold",
    },
  });

export default confirm;
