import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons"; // Make sure to install expo/vector-icons
import ProfileStack from "@components/PoepleComponent";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";

type AssignedTo = {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
const MeetingCard = ({
  id,
  title,
  description,
  assignedTo
}: {
  id:string ;
  title: string;
  description: string;
  assignedTo: AssignedTo[];
}) => {
const color = useThemeColor();

  return (
    <View style={styles(color).card}>
      <View style={styles(color).contentContainer}>
        <View style={styles(color).textContainer}>
          <View style={styles(color).headerContainer}>
            <Text style={styles(color).title}>{title}</Text>
            {/* <TouchableOpacity style={styles(color).menuButton}>
              <Feather name="more-vertical" size={20} color={color.text} />
            </TouchableOpacity> */}
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

const styles =(color:any) =>  StyleSheet.create({
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
  },
  description: {
    fontSize: 12,
    color: color.body,
  },
  menuButton: {
    padding: 4,
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#FFF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  lastAvatar: {
    marginLeft: -12,
    backgroundColor: "#E8E8E8",
  },
  remainingCount: {
    fontSize: 12,
    color: color.body,
    fontWeight: "500",
  },
  joinButton: {
    backgroundColor:color.primary,
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
