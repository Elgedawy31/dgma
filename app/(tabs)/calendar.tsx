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
const explore = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [view, setView] = useState<"list" | "month">("list");
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [TaskAdded , setTaskAdded] = useState<boolean | any>(false);
  const [filteredTasks, setFilteredTasks] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null );

  const [tasks , setTasks ] = useState<any>([]);
  const color = useThemeColor();
  const { get } = useAxios();


  const handleViewChange = (view: "list" | "month") => {
    setView(view);
  }; 

  const handleDateSelect = async (data: string) => {
  setSelectedDate(data);
  };

  const handleDateSelect2 = (date: any) => {
    setSelectedDate(date);
  };
 

  useEffect(() => {
    const handleSubmit = async () => {
      await get({ endPoint: "tasks/" })
        .then((res) => {
          if (res) {
          setTasks(res)
        
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    };
    handleSubmit(); 

  }, [TaskAdded]);  

  useEffect(() => {
    if(selectedDate!==null){
      let date = dayjs(selectedDate).format('YYYY-MM-DD');
      const filtered = tasks.filter((task: any) => {
        return dayjs(task.startDate).format('YYYY-MM-DD') === date; 
      });
      setFilteredTasks(filtered);
    }else{
      console.log('object')
      setFilteredTasks(tasks); 
    }
  } , [selectedDate , tasks]) 
 

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
      {view === "list" ? (
        <> 
          <View>
            <HorizontalCalendar
              onDateSelect={handleDateSelect}
              currentDate={selectedDate ? selectedDate :dayjs().format("YYYY-MM-DD")}
            />
          </View>
          <CalendarHead date={ selectedDate ? selectedDate :dayjs().format("YYYY-MM-DD")} setModalVisible={setModalVisible} />
          <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 0 }}>
            {filteredTasks.length > 0 ? <FlatList
              keyExtractor={(item, index) => item.title + index}
              showsVerticalScrollIndicator={false}
              data={filteredTasks}
              renderItem={({ item }) => (
                <CalendarCard
                link={`/task/${item.id}`}
                  title={item.title} 
                  state={item.status} 
                  subTitle={item.description}
                  assignedTo={item?.assignedTo}
                  time={`${dayjs(item.startDate).format('DD MMM')} - ${dayjs(item.deadline).format('DD MMM')}`} 
                />
              )}
            /> : <NoTasks />}
          </View>
        </>
      ) : (
        <MonthCalendar tasks={tasks.map((ele: any) => ({ 
          id: ele.id,
          title:ele?.title,
          startDate: ele?.startDate, 
          endDate: ele?.deadline, 
          status: ele.status as const 
        }))} />
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
