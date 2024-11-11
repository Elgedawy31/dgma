import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@hooks/useThemeColor";
import CalendarHeader from "@components/calendar/CalendarHeader";
import TaskDetailsCard from "./components/TaskDetailsCard";
import ResourcesList from "./components/TaskResources";
import { Platform } from "react-native";
import { TaskColors } from "@colors";
import useAxios from "@hooks/useAxios";
import dayjs from "dayjs";

interface Resource {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "doc" | "image";
  url?: string;
}

const Task = () => {
  const color = useThemeColor();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<any>({});
  const {get} = useAxios();

  const sampleHandlers = {
    handleDownload: (resource: Resource) => {
      console.log(`Downloading ${resource.name}`);
      // Add your download logic here
    },

    handleSeeAll: () => {
      console.log("Viewing all resources");
      // Add your navigation logic here
    },

    handleTaskPress: (task: any) => {
      console.log(`Selected task: ${task.title}`);
      // Add your task selection logic here
    },
  };

  const styles = StyleSheet.create({
    customBtn: {
      // Light green color
      borderRadius: 30,
      paddingVertical: 12,
      marginHorizontal: 16,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

   useEffect(() => {
    const handleSubmit = async () => {
      await get({ endPoint: `tasks/${id}` })
        .then((res) => {
          if (res) {
         setTask(res)
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    };
    handleSubmit(); 

  }, [id]);  

console.log(task.attachments)

  return (
    <View style={{ paddingBottom: 24, gap:24 , backgroundColor: color.background  , flex:1}}>
      <CalendarHeader fromCalenderTab={false} title="Task details" />
     
        <TaskDetailsCard
          title={task?.title}
          description={task?.description}
          startDate={dayjs(task?.startDate).format('DD MMM')}
          endDate={dayjs(task?.deadline).format('DD MMM')}
        />
        <ResourcesList
          resources={task.attachments || []}
          onSeeAll={sampleHandlers.handleSeeAll}
        />
        <View style={{ gap: 16 , marginTop:16 }}>
        {task?.status === 'cancelled' && 
          <TouchableOpacity
          style={[
            styles.customBtn,
            { backgroundColor: TaskColors["completed"] },
          ]}
        >
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>}
         {task?.status ==='cancelled' && 
          <TouchableOpacity
          style={[
            styles.customBtn,
            { backgroundColor: TaskColors["cancelled"] },
          ]}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>
            Cancelled
          </Text>
        </TouchableOpacity>}
        </View>
    </View>
  );
};

export default Task;
