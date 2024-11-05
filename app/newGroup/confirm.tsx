import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Text as TextR,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import { useThemeColor } from "@hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";

type MemberProps = {
  id: string;
  name: string;
  role: string;
  image: string;
};

const confirm = () => {
  const { members } = useLocalSearchParams();
  const selectedMembers: MemberProps[] = JSON.parse(members as string);
  const colors = useThemeColor();
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = () => {
    // Perform group creation logic here
    console.log("Creating group:", groupName, selectedMembers);
  };

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
          onPress={() => console.log("object")}
          style={styles(colors).iconContainer}
        >
          <Ionicons name="camera-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles(colors).input}
          placeholder="Group name"
          placeholderTextColor="#666"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      <FlatList
        data={selectedMembers}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles(colors).memberList}
        renderItem={({ item }) => (
          <View style={styles(colors).memberItem}>
            <Image
              source={{ uri: item.image }}
              style={styles(colors).memberImage}
            />
            <TextR style={styles(colors).memberName}>{item.name}</TextR>
            <TextR style={styles(colors).memberRole}>{item.role}</TextR>
          </View>
        )}
      />

      {/* "Create Group" button */}
      {groupName?.length > 0 && (
        <TouchableOpacity
          style={[
            styles(colors).createButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleCreateGroup}
        >
          <TextR style={styles(colors).createButtonText}>Create Group</TextR>
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
      backgroundColor: "white",
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
    },
    memberRole: {
      color: colors.secondary,
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