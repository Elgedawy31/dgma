import { memo, useEffect, useState } from "react";
import TaskCard from "@cards/TaskCard";
import { TaskColors2 } from "../../constants/Colors";
import { useThemeColor } from "@hooks/useThemeColor";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions 
} from "react-native";
import useAxios from "@hooks/useAxios";
import CalendarCard from "@components/calendar/CalendarCard";
import dayjs from "dayjs";
import NoTasks from "@components/calendar/NoTasks";
import CalendarHeader from "@components/calendar/CalendarHeader";
import TaskFormModal from "@components/calendar/AddPersonalTask";
import { usePathname } from "expo-router";
import LoadingSpinner from "@blocks/LoadingSpinner";

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
  status: 'Overdue' | 'In Progress' | 'In Review' | 'Completed' | 'Pending' | 'Cancelled' | 'To Do';
  description: string;
  assignedTo: AssignedProps[];
  startDate: string;
  endDate: string;
}

interface State {
  id: 'All' | 'Overdue' | 'In Progress' | 'In Review' | 'Completed' | 'Pending' | 'Cancelled' | 'To Do';
  label: string;
}

interface ThemeColors {
  background: string;
  primary: string;
  white: string;
}

const headers: string[] = ["all", "team", "personal"];

const states: State[] = [
  { id: "All", label: "All" },
  { id: "Pending", label: "Pending" },
  { id: "In Progress", label: "In Progress" },
  { id: "Overdue", label: "Overdue" },
  { id: "In Review", label: "In Review" },
  { id: "Cancelled", label: "Cancelled" },
  { id: "Completed", label: "Completed" },
  { id: "To Do", label: "To Do" },
];

function Tasks(): JSX.Element {
  const colors = useThemeColor() as ThemeColors;
  const [stateIndex, setStateIndex] = useState<number>(-1);
  const [headerIndex, setHeaderIndex] = useState<number>(0);
  const [taskAdded, setTaskAdded] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible , setModalVisible] = useState<boolean>(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const { getRequest , loading } = useAxios();
  const pathName = usePathname()

  const onStateChange = (index: number): void => setStateIndex(index);

  const onHeaderChange = (index: number): void => setHeaderIndex(index);

  // Fetch tasks
  useEffect(() => {
    const handleSubmit = async (): Promise<void> => {
      try {
        const response = await getRequest({ endPoint: "tasks/" });
        if (response) {
          setTasks(response);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };
    handleSubmit();
  }, [taskAdded , pathName]);

  // Filter tasks based on header selection and status
  useEffect(() => {
    let filtered = [...tasks];

    // First filter by header selection
    switch (headerIndex) {
      case 0: // all
        filtered = tasks;
        break;
      case 1: // assigned
        filtered = tasks.filter((task) => task.type === 'team');
        break;
      case 2: // personal
        filtered = tasks.filter((task) => task.type === 'personal');
        break;
      default: 
        filtered = tasks;
    }

    // Then filter by status if a status is selected and it's not "All"
    if (stateIndex > 0) {
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

  const getStateColor = (stateId: State['id']): string => {
    if (stateId === 'All') {
      return colors.primary;
    }
    return TaskColors2[stateId] || colors.primary;
  };

  const renderState = (state: State, index: number): JSX.Element => (
    console.log('state', state.id),
    <Pressable
      key={index}
      onPress={() => onStateChange(index)}
      style={[
        styles.headerState,
        index === stateIndex && {
          borderColor: getStateColor(state.id),
          borderBottomWidth: 1,
        },
      ]}
    >
      <Text
        style={{
          textAlign: "center",
          textTransform: "capitalize",
          color: getStateColor(state.id),
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
    link={`/task/${item.id}`}
    subTitle={item.description}
    assignedTo={item?.assignedTo}
    time={`${dayjs(item.startDate).format('DD MMM')} - ${dayjs(item.endDate).format('DD MMM')}`} 
    />
  );


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       <CalendarHeader
        fromCalenderTab
        title="Tasks"
        view={'month'}
        setModalVisible={setModalVisible}
        setDatePickerVisible={() => {}}
      />
      <View style={styles.headerContainer}>
        <View
        >
          <View style={[styles.headerRow , {justifyContent:'center'} ]}>
            {headers.map((header, index) => renderHeader(header, index))}
          </View>
        </View>

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

      {loading ? <LoadingSpinner/> :<View style={styles.listContainer}>
      {filteredTasks.length > 0 ?    <FlatList
          keyExtractor={(item, index) => item.title + index.toString()}
          showsVerticalScrollIndicator={false}
          data={filteredTasks}
          renderItem={renderTask}
        /> : <NoTasks />}
      </View>}

      <TaskFormModal
        isVisible={modalVisible} 
        onClose={() => setModalVisible(false)}
        setTaskAdded={setTaskAdded}
       
      />
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
