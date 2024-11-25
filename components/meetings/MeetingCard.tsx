import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import ProfileStack from "@components/PoepleComponent";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";

type AssignedTo = {
    id: string;
    name: string;
    email: string;
    avatar: string;
};

interface MeetingCardProps {
    id: string;
    title: string;
    description: string;
    assignedTo: AssignedTo[];
    hasNotification?: boolean;  // Added optional notification prop
}

const MeetingCard = ({
  id,
  title,
  description,
  assignedTo,
  hasNotification = false  // Default to false
}: MeetingCardProps) => {
  const color = useThemeColor();

  return (
    <View style={styles(color).card}>
      <View style={styles(color).contentContainer}>
        <View style={styles(color).textContainer}>
          <View style={styles(color).headerContainer}>
            <Text style={styles(color).title}>
              {title}
              {hasNotification && (
                <View style={styles(color).notificationDot} />
              )}
            </Text>
          </View>
          <Text style={styles(color).description}>{description}</Text>
        </View>

        <View style={styles(color).bottomContainer}>
          <View style={styles(color).participantsContainer}>
            <ProfileStack profiles={assignedTo} maxDisplay={3} />
          </View>

          <TouchableOpacity onPress={() => router.push(`/meetings/${id}`)} style={styles(color).joinButton}>
            <Feather
              name="video"
              size={16}
              color="#FFF"
              style={styles(color).videoIcon}
            />
            <Text style={styles(color).joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = (color: any) => StyleSheet.create({
  card: {
    backgroundColor: color.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  contentContainer: {
    gap: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: color.text,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.primary,
    marginLeft: 8,
  },
  description: {
    fontSize: 12,
    color: color.body,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: color.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  videoIcon: {
    marginRight: 4,
  },
  joinButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default MeetingCard;
