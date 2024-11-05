import {
  Image,
  TouchableOpacity,
  View,
  Text as TextR,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@hooks/useThemeColor";
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import { router } from "expo-router";
import StackUI from "@blocks/StackUI";
import { Ionicons } from "@expo/vector-icons";

const index = () => {
  const colors = useThemeColor();
  const members = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Product Designer",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "UX / UI Designer",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "3",
      name: "Emma Wilson",
      role: "Visual Designer",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "4",
      name: "David Kim",
      role: "UX / UI Designer",
      image: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: "5",
      name: "Julia Smith",
      role: "UI Designer",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: "6",
      name: "Alex Brown",
      role: "UX / UI Designer",
      image: "https://i.pravatar.cc/150?img=6",
    },
  ];

  const [selectedMembers, setSelectedMembers] = useState(new Set());

  const toggleMember = (id: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMembers(newSelected);
  };

  const renderMember = ({ item }) => (
    <TouchableOpacity
      style={styles(colors).memberItem}
      onPress={() => toggleMember(item.id)}
    >
      <View style={styles(colors).memberInfo}>
        <Image source={{ uri: item.image }} style={styles(colors).avatar} />
        <View style={styles(colors).textContainer}>
          <TextR style={styles(colors).name}>{item.name}</TextR>
          <TextR style={styles(colors).role}>{item.role}</TextR>
        </View>
      </View>
      <View
        style={[
          styles(colors).checkbox,
          selectedMembers.has(item.id) && styles(colors).checkboxSelected,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        leading="back" 
        title={
          <View>
            <Text type="subtitle" title="New Group" />
          </View>
        }
        action={
          <TouchableOpacity
            onPress={() => console.log("object")}
            style={{ backgroundColor: "#F1F9FF", borderRadius: 50, padding: 8 }}
          >
            <StackUI
              value={{ vertical: -5, horizontal: -1.5 }}
              position={{ vertical: "bottom", horizontal: "right" }}
              base={<Ionicons name="search" size={24} color="#09419A" />}
            />
          </TouchableOpacity>
        }
      />
      <View style={styles(colors).container}>
        <TextR style={styles(colors).header}>Add members</TextR>
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,

      padding: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
    },
    memberItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },
    memberInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    textContainer: {
      justifyContent: "center",
    },
    name: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 4,
    },
    role: {
      fontSize: 14,
      color: "#666666",
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#DDDDDD",
    },
    checkboxSelected: {
      backgroundColor: "#007AFF",
      borderColor: "#007AFF",
    },
  });

export default index;
