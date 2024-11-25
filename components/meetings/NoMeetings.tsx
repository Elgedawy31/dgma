import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useThemeColor } from "@hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";

interface NoMeetingsProps {
  setOpen: (open: boolean) => void;
  hasNotifications?: boolean;  // Added to show notification status
}

const NoMeetings = ({ setOpen, hasNotifications = false }: NoMeetingsProps) => {
  const color = useThemeColor();

  return (
    <View style={styles(color).container}>
      <View style={styles(color).imageContainer}>
        <Image
          source={require("../../assets/images/no-meetings.png")}
          style={styles(color).image}
          resizeMode="contain"
        />
      </View>
      <View style={styles(color).textContainer}>
        <View style={styles(color).titleContainer}>
          <Text style={styles(color).title}>No Meetings</Text>
          {hasNotifications && (
            <View style={styles(color).notificationDot} />
          )}
        </View>
        <Text style={styles(color).description}>
          You don't have any meetings scheduled. Create a new meeting to get started.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles(color).button}
      >
        <Feather name="plus" size={20} color="#FFF" />
        <Text style={styles(color).buttonText}>Create Meeting</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (color: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: color.text,
    marginBottom: 8,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.primary,
  },
  description: {
    fontSize: 14,
    color: color.body,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: color.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
});

export default NoMeetings;
