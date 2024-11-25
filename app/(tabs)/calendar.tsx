import { View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import CalendarCard from "@components/calendar/CalendarCard";
import CalendarHeader from "@components/calendar/CalendarHeader";
import { useThemeColor } from "@hooks/useThemeColor";
import ToggleView from "@components/calendar/ToggleButton";
import HorizontalCalendar from "@components/calendar/DayComponent";
import CalendarHead from "@components/calendar/CalenderHead";
import TaskFormModal from "@components/calendar/AddPersonalTask";
import MonthCalendar from "@components/calendar/MonthCalendar";
import DatePickerModal from "@components/calendar/DatePickerModal";
import dayjs from "dayjs";
import useAxios from "@hooks/useAxios";
import NoTasks from "@components/calendar/NoTasks";
import { usePathname } from "expo-router";
import LoadingSpinner from "@blocks/LoadingSpinner";

const explore = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [view, setView] = useState<"list" | "month">("list");
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [TaskAdded, setTaskAdded] = useState<boolean | any>(false);
  const [filteredTasks, setFilteredTasks] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const pathName = usePathname();
  const [tasks, setTasks] = useState<any>([]);
  const color = useThemeColor();
  const { getRequest, loading } = useAxios();

  const handleViewChange = (view: "list" | "month") => {
    setView(view);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
  };

  const handleDateSelect2 = (date: any) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const handleSubmit = async () => {
      await getRequest({ endPoint: "projects/personal/kanban" })
        .then((res) => {
          if (res) {
            // Extract all tasks from columns into a flat array
            const allTasks = res.columns.reduce((acc: any[], column: any) => {
              return [...acc, ...column.tasks];
            }, []);
            setTasks(allTasks);
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    };
    handleSubmit();
  }, [TaskAdded, pathName]);

  useEffect(() => {
    if (selectedDate !== null) {
      let date = dayjs(selectedDate).format("YYYY-MM-DD");
      const filtered = tasks.filter((task: any) => {
        return dayjs(task.startDate).format("YYYY-MM-DD") === date;
      });
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [selectedDate, tasks]);

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <CalendarHeader
        fromCalenderTab
        title="Calender"
        view={view}
        setModalVisible={setModalVisible}
        setDatePickerVisible={setDatePickerVisible}
      />
      <ToggleView onViewChange={handleViewChange} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {view === "list" ? (
            <>
              <View>
                <HorizontalCalendar
                  onDateSelect={handleDateSelect}
                  currentDate={
                    selectedDate ? selectedDate : dayjs().format("YYYY-MM-DD")
                  }
                />
              </View>
              <CalendarHead
                date={
                  selectedDate ? selectedDate : dayjs().format("YYYY-MM-DD")
                }
                setModalVisible={setModalVisible}
              />
              <View
                style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 0 }}
              >
                {filteredTasks.length > 0 ? (
                  <FlatList
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    data={filteredTasks}
                    renderItem={({ item }) => (
                      <CalendarCard
                        link={`/task/${item._id}`}
                        title={item.title}
                        state={item.status}
                        subTitle={item.description}
                        assignedTo={item?.assignedTo}
                        time={`${dayjs(item.startDate).format(
                          "DD MMM"
                        )} - ${dayjs(item.deadline).format("DD MMM")}`}
                      />
                    )}
                  />
                ) : (
                  <NoTasks />
                )}
              </View>
            </>
          ) : (
            <MonthCalendar
              tasks={tasks.map((task: any) => ({
                id: task._id,
                title: task.title,
                startDate: task.startDate,
                endDate: task.deadline,
                status: task.status
              }))}
            />
          )}
        </>
      )}

      <TaskFormModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        setTaskAdded={setTaskAdded}
      />

      <DatePickerModal
        isVisible={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onDateSelect={handleDateSelect2}
      />
    </View>
  );
};

export default explore;
