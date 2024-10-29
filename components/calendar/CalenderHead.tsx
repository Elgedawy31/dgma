import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@blocks/Text";
import { useThemeColor } from "@hooks/useThemeColor";
import IconWrapper from "@components/IconWrapper";
import dayjs from "dayjs";

interface HeaderProps {
  onSearchPress?: () => void;
  setModalVisible: (val: boolean) => void;
  date: string;
}

const CalendarHead: React.FC<HeaderProps> = ({
  date,
  onSearchPress,
  setModalVisible,
}) => {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <Text
        title={dayjs(date).format("MMMM YYYY")}
        bold
        color={"black"}
        size={20}
      />

      <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
        <IconWrapper
          onPress={() => setModalVisible(true)}
          size={40}
          Icon={<Ionicons name="add" size={36} color={colors.primary} />}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 17,
    color: "#007AFF",
    marginLeft: -4,
  },
  searchButton: {
    padding: 4,
  },
});

export default CalendarHead;
