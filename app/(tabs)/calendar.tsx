import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import CustomCalendar from "@components/calendar/CustomCalendar";
import TaskCard from "@cards/TaskCard";
import CalendarCard from "@components/calendar/CalendarCard";
import CalendarHeader from "@components/calendar/CalendarHeader";
import { useThemeColor } from "@hooks/useThemeColor";
import ToggleView from "@components/calendar/ToggleButton";
import HorizontalCalendar from "@components/calendar/DayComponent";
import CalendarHead from "@components/calendar/CalenderHead";
import TaskFormModal from "@components/calendar/AddPersonalTask";

const explore = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSubmit = (data:any): void => {
    console.log('Form data:', data);
    // Handle the form submission
  };
  const handleViewChange = (view: "list" | "month") => {
    console.log("Current view:", view);
    // Handle view change logic here
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

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      {/* <CustomCalendar
        events={events}
        onDateSelect={handleDateSelect}
        initialDate={new Date()} 
      />  
      */}
      <CalendarHeader />
      <ToggleView onViewChange={handleViewChange} />
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


      <TaskFormModal 
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default explore;
