import React from "react";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@blocks/Text";
import { useThemeColor } from "@hooks/useThemeColor";
import IconWrapper from "@components/IconWrapper";
import { router } from "expo-router";

interface HeaderProps {
  fromCalenderTab: boolean;
  title: string;
  setModalVisible: (val: boolean) => void;
  setDatePickerVisible: (val: boolean) => void;
  view?: "list" | "month";
}

const CalendarHeader: React.FC<HeaderProps> = ({
  view,
  title,
  fromCalenderTab = true,
  setModalVisible,
  setDatePickerVisible
}) => {
  const colors = useThemeColor();

  const handlePress = () => {
    if (view === "list") {
      setDatePickerVisible(true);
    } else {
     setModalVisible(true);
    }
  };

  const handleBackPress = () => {
   router.back()
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={20} color={colors.text} />
        <Text title={title} />
      </TouchableOpacity>

     {fromCalenderTab &&  <IconWrapper
        size={40}
        onPress={handlePress}
        Icon={
          <Ionicons
            name={view === "list" ? "search" : "add"}
            size={20}
            color={colors.primary}
          />
        }
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
    zIndex: 1, // Add zIndex to ensure shadow shows on Android
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8, // Add padding to increase touch target
  },
  searchButton: {
    padding: 8, // Add padding to increase touch target
  },
});

export default CalendarHeader;
