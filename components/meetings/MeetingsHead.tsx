import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";

interface MeetingsHeadProps {
  showBtn: boolean;
  onCreateMeeting: () => void;
}

const MeetingsHead = ({ showBtn, onCreateMeeting }: MeetingsHeadProps) => {
  const color = useThemeColor();
  
  const styles = StyleSheet.create({
    head: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headTxt: {
      fontSize: 20,
      fontWeight: "500",
      color: color.text,
      marginVertical: 24,
    },
  });

  return (
    <View style={styles.head}>
      <Text style={styles.headTxt}>Ongoing Meetings</Text>
      {showBtn && (
        <TouchableOpacity onPress={onCreateMeeting}>
          <Entypo name="plus" size={24} color={color.text} /> 
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MeetingsHead;
