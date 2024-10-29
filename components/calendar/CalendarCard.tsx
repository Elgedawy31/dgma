//#region Imports
import { memo } from "react";
import Text from "@blocks/Text";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { TaskColors } from "@/constants/Colors";
import ProfileStack from "@components/PoepleComponent";
//#endregion

type AssignedTo = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type CalendarCardProps = {
  time: string;
  title: string;
  state: string;
  subTitle: string;
  assignedTo: AssignedTo[];
};


function CalendarCard({ time, title, state, subTitle , assignedTo }: CalendarCardProps) {
  //#region UI
  return (
    <View style={[styles.container, { borderColor: TaskColors[state] }]}>
      <Text type="body" color="black" title={title} />
      <Text type="small" title={subTitle} />
      <Text type="small" title={time} />
      <Ionicons
        size={18}
        color="black"
        name="ellipsis-vertical"
        onPress={() => {
          alert("hello");
        }}
        style={{ position: "absolute", right: 8, top: 10 }}
      />

      <View style={styles.people}>
        <ProfileStack profiles={assignedTo} maxDisplay={3} />
      </View>
    </View>
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
    backgroundColor: "white",
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
