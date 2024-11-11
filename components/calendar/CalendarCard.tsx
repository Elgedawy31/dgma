//#region Imports
import { memo } from "react";
import Text from "@blocks/Text";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TaskColors } from "@/constants/Colors";
import ProfileStack from "@components/PoepleComponent";
import { router } from "expo-router";
import { useThemeColor } from "@hooks/useThemeColor";
//#endregion

type AssignedTo = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type CalendarCardProps = {
  time: string;
  link:string ,
  title: string;
  state: string;
  subTitle: string;
  assignedTo: AssignedTo[];
};


function CalendarCard({ time, title, state, subTitle , assignedTo  , link}: CalendarCardProps) {
  const colors = useThemeColor()
  //#region UI
  return (
    <TouchableOpacity onPress={() => router.push(link)} style={[styles.container , {backgroundColor:colors.card}, { borderColor: TaskColors[state] }]}>
      <Text type="body"  title={title} />
      <Text type="small" title={subTitle?.length > 60 ? `${subTitle.slice(0 , 60)}...` : subTitle} />
      <Text type="small" title={time} />
      <View style={styles.people}>
        <ProfileStack profiles={assignedTo} maxDisplay={3} />
      </View>
    </TouchableOpacity>
  );
  //#endregion
}
export default memo(CalendarCard);

//#region Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    margin: 10,
    padding: 10,
    borderLeftWidth: 14,
    borderRadius: 10,
  },
  people: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
//#endregion
