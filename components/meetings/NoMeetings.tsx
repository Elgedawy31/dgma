import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useThemeColor } from "@hooks/useThemeColor";
import MeetingsHead from "./MeetingsHead";

interface NoMeetingsProps {
  onCreateMeeting: () => void;
}

const NoMeetings = ({ onCreateMeeting }: NoMeetingsProps) => {
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
      backgroundColor: color.primary,
      paddingVertical: 12,
      paddingHorizontal: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "500",
      textAlign: "center",
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
    },
    imageContainer: {
      width: 200,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    textContainer: {
      alignItems: 'center',
    }
  });

  return (
    <View style={styles.container}> 
      <View style={styles.imageContainer}>
        <Image 
          source={require("../../assets/images/no-meetings.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.headTxt, { textAlign: "center" }]}>
          No meetings to join
        </Text>
        <Text style={styles.para}>Create a new one to meet them</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onCreateMeeting}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Create a meeting</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoMeetings;
