import { FlatList, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Text from '@blocks/Text'
import { useThemeColor } from '@hooks/useThemeColor'
import { router, usePathname } from 'expo-router'
import useAxios from '@hooks/useAxios'
import NoTasks from './calendar/NoTasks'
import CalendarCard from './calendar/CalendarCard'
import dayjs from 'dayjs'
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
    id: 'Overdue' | 'In Progress' | 'In Review' | 'completed' | 'Pending' | 'Cancelled' | 'To Do' | 'Completed' ;
    label: string;
  }
const HomeTasks = () => {
    const colors = useThemeColor()
    const {getRequest} = useAxios()
    const [tasks, setTasks] = React.useState([])
    const pathName = usePathname();
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
      }, [pathName]);
  return (
    <View>
      <View style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
        <Text title='Tasks for you' type='title' />
        <TouchableOpacity onPress={() => router.push('/tasks')} ><Text type='details' title='see all' color={colors.primary} /></TouchableOpacity>
      </View>
        {tasks.length > 0 ?    <FlatList
          keyExtractor={(item, index) => item.title + index.toString()}
          showsVerticalScrollIndicator={false}
          data={tasks.slice(0 ,3)}
          renderItem={renderTask}
        /> :<View style={{ marginVertical: 32, alignItems: 'center', justifyContent: 'center' }}>
        <Text type='title' title='No Tasks  For YOu ' color={colors.body} />
    </View>}
    </View>
  )
}

export default HomeTasks