import { View, FlatList } from "react-native";
import React, { useState } from "react";
import CalendarCard from "@components/calendar/CalendarCard";
import CalendarHeader from "@components/calendar/CalendarHeader";
import { useThemeColor } from "@hooks/useThemeColor";
import ToggleView from "@components/calendar/ToggleButton";
import HorizontalCalendar from "@components/calendar/DayComponent";
import CalendarHead from "@components/calendar/CalenderHead";
import TaskFormModal from "@components/calendar/AddPersonalTask";
import MonthCalendar from "@components/calendar/MonthCalendar";
import DatePickerModal from "@components/calendar/DatePickerModal";

const explore = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [view, setView] = useState<"list" | "month">("list");
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const tasksMonth = [
    {
      id: "1",
      title: "Landing page",
      startDate: new Date(2024, 7, 8),
      endDate: new Date(2024, 7, 10),
      status: "pink",
    },
    {
      id: "2",
      title: "Landing page",
      startDate: new Date(2024, 7, 15),
      endDate: new Date(2024, 7, 17),
      status: "purple",
    },
    {
      id: "3",
      title: "Landing page",
      startDate: new Date(2024, 7, 15),
      endDate: new Date(2024, 7, 18),
      status: "lightPurple",
    },
  ];

  const handleSubmit = (data: any): void => {
    console.log("Form data:", data);
    // Handle the form submission
  };
  const handleViewChange = (view: "list" | "month") => {
    setView(view);
  };
  const color = useThemeColor();

  // const events = [
  //   {
  //     status: "success",
  //     date: new Date(2024, 2, 2), // March 2, 2024
  //   },
  //   {
  //     status: "inprogress",
  //     date: new Date(2024, 2, 8), // March 8, 2024
  //   },
  //   {
  //     status: "started",
  //     date: new Date(2024, 9, 15), // October 15, 2024
  //   },
  //   {
  //     status: "canceled",
  //     date: new Date(2024, 9, 20), // October 20, 2024
  //   },
  // ];

  const handleDateSelect = (date: Date) => {
    console.log("Selected date:", date);
  };

  const tasks = [
    {
      id: "overdue",
      title: "Research Process",
      subTitle: "Market research - User research ",
      time: "12 Aug-14 Aug",
    },
    {
      id: "progress",
      title: "Wirefiraming Design",
      subTitle: "Market research - User research ",
      time: "12 Aug-14 Aug",
    },
    {
      id: "review",
      title: "Landing Page",
      subTitle: "Market research - User research ",
      time: "12 Aug-14 Aug",
    },
    {
      id: "completed",
      title: "Research Process",
      subTitle: "Market research - User research ",
      time: "12 Aug-14 Aug",
    },
    {
      id: "completed",
      title: "Wirefiraming Design",
      subTitle: "Market research - User research ",
      time: "12 Aug-14 Aug",
    },
    {
      id: "progress",
      title: "Landing Page",
      subTitle: "Market research - User research ",
      time: "12 Aug-14 Aug",
    },
    {
      id: "review",
      title: "Research Process",
      subTitle: "Market res earch - User research ",
      time: "12 Aug-14 Aug",
    },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateSelect2 = (date: any) => {
    setSelectedDate(date.dateString);
  };

  console.log(selectedDate) 

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      {/* <CustomCalendar
        events={events}
        onDateSelect={handleDateSelect}
        initialDate={new Date()} 
      />   
      */}
      <CalendarHeader
        fromCalenderTab
        title="Calender"
        view={view}
        setModalVisible={setModalVisible}
        setDatePickerVisible={setDatePickerVisible}
      />
      <ToggleView onViewChange={handleViewChange} />
      {view === "list" ? (
        <>
          <View>
            <HorizontalCalendar onDateSelect={handleDateSelect} />
          </View>
          <CalendarHead setModalVisible={setModalVisible} />
          <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 0 }}>
            <FlatList
              keyExtractor={(item, index) => item.title + index}
              showsVerticalScrollIndicator={false}
              data={tasks}
              renderItem={({ item }) => (
                <CalendarCard
                  title={item.title}
                  state={item.id}
                  subTitle={item.subTitle}
                  time={item.time}
                />
              )}
            />
          </View>
        </>
      ) : (
        <MonthCalendar tasks={tasksMonth} />
      )}

      <TaskFormModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
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
