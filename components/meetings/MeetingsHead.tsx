import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface MeetingsHeadProps {
  showBtn?: boolean;
  hasNotifications?: boolean;  // Added to show overall notification status
}

const MeetingsHead = ({ showBtn = true, hasNotifications = false }: MeetingsHeadProps) => {
  const color = useThemeColor();

  return (
    <View style={styles(color).container}>
      <View style={styles(color).titleContainer}>
        <Text style={styles(color).title}>Upcoming Meetings</Text>
        {hasNotifications && (
          <View style={styles(color).notificationDot} />
        )}
      </View>
      {showBtn && (
        <TouchableOpacity
          onPress={() => router.push("/meetings/create")}
          style={styles(color).button}
        >
          <Feather name="plus" size={20} color={color.text} />
          <Text style={styles(color).buttonText}>Create Meeting</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = (color: any) => StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: color.text,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.primary,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: color.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    color: color.text,
  },
});

export default MeetingsHead;
