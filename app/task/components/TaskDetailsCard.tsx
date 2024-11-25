import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@hooks/useThemeColor";
import { useRouter } from "expo-router";

interface TaskCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  startDate,
  endDate,
  onDelete,
}) => {
  const [showAll, setShowAll] = React.useState<boolean>(true);
  const colors = useThemeColor();
  const router = useRouter();

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).content}>
        <View style={styles(colors).headerContainer}>
          <Text style={styles(colors).title}>{title}</Text>
          <TouchableOpacity 
            style={styles(colors).deleteButton}
            onPress={() => {
              if (onDelete) {
                onDelete();
              } else {
                router.back();
              }
            }}
          >
            <Text style={styles(colors).deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles(colors).description}>
          {showAll ? description : `${description?.slice(0, 60)}...`}
          {description?.length > 60 && (
            <TouchableOpacity onPress={() => setShowAll(!showAll)}>
              <Text style={{color: colors.primary}}>  {showAll ? "less" : "more"}</Text>
            </TouchableOpacity>
          )}
        </Text>

        <View style={styles(colors).dateContainer}>
          <View style={styles(colors).dateWrapper}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.text}
              style={styles(colors).icon}
            />
            <Text style={styles(colors).dateLabel}>Start Date:</Text>
            <Text style={styles(colors).dateTextBlue}>{startDate}</Text>
          </View>

          <View style={styles(colors).dateWrapper}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.text}
              style={styles(colors).icon}
            />
            <Text style={styles(colors).dateLabel}>End Date:</Text>
            <Text style={styles(colors).dateTextRed}>{endDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    gap: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: colors.cancel,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontWeight: "400",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 8,
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  icon: {
    marginRight: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: colors.text,
  },
  dateTextBlue: {
    fontSize: 14,
    color: "#2684FF",
    fontWeight: "500",
  },
  dateTextRed: {
    fontSize: 14,
    color: "#E54C4C",
    fontWeight: "500",
  },
});

export default TaskCard;
