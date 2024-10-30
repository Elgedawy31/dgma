import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@hooks/useThemeColor";
import CalendarHeader from "@components/calendar/CalendarHeader";
import TaskDetailsCard from "./components/TaskDetailsCard";
import ResourcesList from "./components/TaskResources";
import { Platform } from 'react-native';

// Types for our data
interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Resource {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'image';
  url?: string;
}

// Sample tasks data
export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Landing page wireframe',
    description: 'Design and create wireframes for the new product landing page. Focus on user experience and conversion optimization.',
    startDate: 'sep15',
    endDate: 'sep19',
    status: 'in-progress',
  },
  {
    id: '2',
    title: 'User Research Report',
    description: 'Compile and analyze user feedback from the latest usability testing sessions. Include key findings and recommendations.',
    startDate: 'sep20',
    endDate: 'sep25',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Mobile App Design',
    description: 'Create detailed UI/UX design for the mobile application. Including all main user flows and interactive elements.',
    startDate: 'sep18',
    endDate: 'sep30',
    status: 'pending',
  },
];

// Sample resources data
export const sampleResources: Resource[] = [
  {
    id: '1',
    name: 'Project Requirements.pdf',
    size: '87MB',
    type: 'pdf',
    url: Platform.select({
      ios: 'project-requirements.pdf',
      android: 'file:///android_asset/project-requirements.pdf',
    }),
  },
  {
    id: '2',
    name: 'Design Guidelines.pdf',
    size: '45MB',
    type: 'pdf',
    url: Platform.select({
      ios: 'design-guidelines.pdf',
      android: 'file:///android_asset/design-guidelines.pdf',
    }),
  },
  {
    id: '3',
    name: 'Technical Specifications.pdf',
    size: '92MB',
    type: 'pdf',
    url: Platform.select({
      ios: 'technical-specs.pdf',
      android: 'file:///android_asset/technical-specs.pdf',
    }),
  },
  {
    id: '4',
    name: 'User Research Data.pdf',
    size: '67MB',
    type: 'pdf',
    url: Platform.select({
      ios: 'user-research.pdf',
      android: 'file:///android_asset/user-research.pdf',
    }),
  },
];

const Task = () => {
  const color = useThemeColor();
  const { id } = useLocalSearchParams();

   const sampleHandlers = {
    handleDownload: (resource: Resource) => {
      console.log(`Downloading ${resource.name}`);
      // Add your download logic here
    },
    
    handleSeeAll: () => {
      console.log('Viewing all resources');
      // Add your navigation logic here
    },
    
    handleTaskPress: (task: Task) => {
      console.log(`Selected task: ${task.title}`);
      // Add your task selection logic here
    },
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: color.background, gap: 24 }}>
      <CalendarHeader fromCalenderTab={false} title="Task details" />

      <TaskDetailsCard
        title="Landing page wirefram "
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        startDate="15 Sep"
        endDate="18 Sep"
      />
     <ResourcesList
        resources={sampleResources}
        onDownload={sampleHandlers.handleDownload}
        onSeeAll={sampleHandlers.handleSeeAll}
      />
    </View>
  );
};

export default Task;
