import { memo, useEffect, useState } from "react";
import TaskCard from "@cards/TaskCard";
import { TaskColors } from "@/constants/Colors";
import { useThemeColor } from "@hooks/useThemeColor";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useAxios from "@hooks/useAxios";
import CalendarCard from "@components/calendar/CalendarCard";
import dayjs from "dayjs";
import NoTasks from "@components/calendar/NoTasks";

interface AssignedProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  subTitle: string;
  time: string;
  type: 'project' | 'team' | 'personal';
  status: 'overdue' | 'progress' | 'review' | 'completed';
  description: string;
  assignedTo: AssignedProps[];
  startDate: string;
  endDate: string;

}

interface State {
  id: 'overdue' | 'progress' | 'review' | 'completed' | 'pending' | 'cancelled';
  label: string;
}

interface ThemeColors {
  background: string;
  primary: string;
  white: string;
}

const headers: string[] = ["all", "projects", "assigned", "personal"];

const states: State[] = [
  { id: "overdue", label: "Overdue" },
  { id: "progress", label: "In Progress" },
  { id: "review", label: "In Review" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "cancelled", label: "Cancelled" },
];

function Tasks(): JSX.Element {
  const colors = useThemeColor() as ThemeColors;
  const [stateIndex, setStateIndex] = useState<number>(-1);
  const [headerIndex, setHeaderIndex] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const { get } = useAxios();

  const onStateChange = (index: number): void => setStateIndex(index);

  const onHeaderChange = (index: number): void => setHeaderIndex(index);

  // Fetch tasks
  useEffect(() => {
    const handleSubmit = async (): Promise<void> => {
      try {
        const response = await get({ endPoint: "tasks/" });
        if (response) {
          setTasks(response);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };
    handleSubmit();
  }, []);

  // Filter tasks based on header selection and status
  useEffect(() => {
    let filtered = [...tasks];

    // First filter by header selection
    switch (headerIndex) {
      case 0: // all
        filtered = tasks;
        break;
      case 1: // projects
        filtered = tasks.filter((task) => task.type === 'project');
        break;
      case 2: // assigned
        filtered = tasks.filter((task) => task.type === 'team');
        break;
      case 3: // personal
        filtered = tasks.filter((task) => task.type === 'personal');
        break;
      default: 
        filtered = tasks;
    }

    // Then filter by status if a status is selected
    if (stateIndex >= 0) {
      filtered = filtered.filter((task) => task.status === states[stateIndex].id);
    }

    setFilteredTasks(filtered);
  }, [tasks, headerIndex, stateIndex]);

  const renderHeader = (header: string, index: number): JSX.Element => (
    <Pressable
      key={index}
      onPress={() => onHeaderChange(index)}
      style={[
        styles.header,
        { borderColor: colors.primary },
        index === headerIndex && { backgroundColor: colors.primary },
      ]}
    >
      <Text
        style={[
          styles.headerTitle,
          {
            color: index === headerIndex ? colors.white : colors.primary,
          },
        ]}
      >
        {header}
      </Text>
    </Pressable>
  );

  const renderState = (state: State, index: number): JSX.Element => (
    <Pressable
      key={index}
      onPress={() => onStateChange(index)}
      style={[
        styles.headerState,
        index === stateIndex && {
          borderColor: TaskColors[state.id],
          borderBottomWidth: 1,
        },
      ]}
    >
      <Text
        style={{
          textAlign: "center",
          textTransform: "capitalize",
          color: TaskColors[state.id],
        }}
      >
        {state.label}
      </Text>
    </Pressable>
  );

  const renderTask = ({ item }: { item: Task }): JSX.Element => (
    <CalendarCard
    title={item.title} 
    state={item.status} 
    subTitle={item.description}
    assignedTo={item?.assignedTo}
    time={`${dayjs(item.startDate).format('DD MMM')} - ${dayjs(item.endDate).format('DD MMM')}`} 
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.headerRow}>
            {headers.map((header, index) => renderHeader(header, index))}
          </View>
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.headerRow}>
            {states.map((state, index) => renderState(state, index))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.listContainer}>
      {filteredTasks.length > 0 ?    <FlatList
          keyExtractor={(item, index) => item.title + index.toString()}
          showsVerticalScrollIndicator={false}
          data={filteredTasks}
          renderItem={renderTask}
        /> : <NoTasks />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "column",
    gap: 18,
    paddingVertical: 18,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    gap: 15,
  },
  header: {
    width: 100,
    padding: 8,
    borderWidth: 1,
    borderRadius: 16,
  },
  headerTitle: {
    textAlign: "center",
    textTransform: "capitalize",
  },
  headerState: {
    width: 100,
    padding: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
});

export default memo(Tasks);