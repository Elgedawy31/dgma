import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomSwitch from "./CustomSwitch";

interface CustomListItemProps {
  icon: JSX.Element;
  text: string;
  onPress: () => void;
  type: "switch" | "navigate";
  isActive?: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomListItem = ({ icon, text, onPress, type  , isActive =false , setIsActive}: CustomListItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {icon}
        <Text style={styles.text}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {type === "switch" ? 
        <CustomSwitch isActive={isActive} setIsActive={setIsActive} />
        : 
        <Ionicons name="chevron-forward" size={24} color="#666" />
      }
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginLeft: 12,
    color: "#000",
    fontWeight: "400",
  },
});

export default CustomListItem;
