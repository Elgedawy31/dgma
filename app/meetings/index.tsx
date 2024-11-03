import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import CustomListItem from "@components/SettingsListItem";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { memo, useState } from "react";
import { Image, StyleSheet, Text as TextR, View } from "react-native";

function Meetings() {
  const color = useThemeColor();
  const styles = StyleSheet.create({
    headTxt: {
      fontSize: 20,
      fontWeight: "500",
      color: color.text,
      marginVertical: 12,
    },
    para:{
      fontSize: 14,
      color: color.text,
      textAlign: 'center'
    }
  });
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <AppBar
        center
        title={<Text type="subtitle" title="Meeting Room" />}
        leading={
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            onPress={() => {
              router.back();
            }}
          />
        }
      />
      <View style={{ paddingHorizontal: 12, flex: 1 }}>
        <TextR style={styles.headTxt}>Ongoing meeting</TextR>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" , gap:24}}
        >
          <Image source={require('@/assets/images/no-meetings.png')} />
          <View>
            <TextR style={[styles.headTxt , {textAlign:'center'}]}>No meetings to join</TextR>
            <TextR style={styles.para}>Create a new one  to meet them </TextR>
          </View>


        </View>
      </View>
    </View>
  );
}
export default memo(Meetings);
