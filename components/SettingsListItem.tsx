import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomSwitch from "./CustomSwitch";
import { useThemeColor } from "@hooks/useThemeColor";

interface CustomListItemProps {
  icon: JSX.Element;
  text: string;
  onPress: () => void;
  type: "switch" | "navigate";
  isActive?: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomListItem = ({ icon, text, onPress, type  , isActive =false , setIsActive}: CustomListItemProps) => {
  const colors = useThemeColor(); 
  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).leftContent}>
        {icon}
        <Text style={styles(colors).text}>{text}</Text>
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

const styles =(colors:any) =>  StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
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
    color: colors.text,
    fontWeight: "400",
  },
});

export default CustomListItem;
