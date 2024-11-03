import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useThemeColor } from "@hooks/useThemeColor";
import MeetingsHead from "./MeetingsHead";

const NoMeetings = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const color = useThemeColor();
  const styles = StyleSheet.create({
    headTxt: {
      fontSize: 20,
      fontWeight: "500",
      color: color.text,
    },
    para: {
      fontSize: 14,
      color: color.text,
      textAlign: "center",
    },
    button: {
      backgroundColor: color.primary, // Deep navy blue color
      paddingVertical: 12,
      paddingHorizontal: 48,
      borderRadius: 16, // Large border radius for pill shape
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // For Android shadow
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "500",
      textAlign: "center",
    },
  });
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    > 
      <Image source={require("@/assets/images/no-meetings.png")} />
      <View>
        <Text style={[styles.headTxt, { textAlign: "center" }]}>
          No meetings to join
        </Text>
        <Text style={styles.para}>Create a new one to meet them </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Create a meeting</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoMeetings;
