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
  _id: string;
  title: string;
  description: string;
  type: 'project' | 'team' | 'personal';
  status: 'Pending' | 'In Progress' | 'In Review' | 'Completed' | 'Overdue' | 'Cancelled' | 'To Do';
  assignedTo: AssignedProps[];
  startDate: string | null;
  deadline: string | null;
}

interface State {
  id: 'All' | 'Overdue' | 'In Progress' | 'In Review' | 'Completed' | 'Pending' | 'Cancelled' | 'To Do';
  label: string;
}

const HomeTasks = () => {
  const colors = useThemeColor()
  const {getRequest} = useAxios()
  const [tasks, setTasks] = React.useState<Task[]>([])
  const pathName = usePathname();

  const renderTask = ({ item }: { item: Task }): JSX.Element => (
    <CalendarCard
      title={item.title} 
      state={item.status} 
      link={`/task/${item._id}`}
      subTitle={item.description}
      assignedTo={item?.assignedTo}
      time={`${item.startDate ? dayjs(item.startDate).format('DD MMM') : 'No start'} - ${item.deadline ? dayjs(item.deadline).format('DD MMM') : 'No end'}`} 
    />
  );

  useEffect(() => {
    const handleSubmit = async (): Promise<void> => {
      try {
        const response = await getRequest({ endPoint: "projects/personal/kanban" });
        if (response) {
          // Extract all tasks from columns into a flat array
          const allTasks = response.columns.reduce((acc: Task[], column: any) => {
            return [...acc, ...column.tasks];
          }, []);
          setTasks(allTasks);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };
    handleSubmit();
  }, [pathName]);

  return (
    <View>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <Text title='Tasks for you' type='title' />
        <TouchableOpacity onPress={() => router.push('/tasks')}>
          <Text type='details' title='see all' color={colors.primary} />
        </TouchableOpacity>
      </View>
      {tasks.length > 0 ? (
        <FlatList
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          data={tasks.slice(0, 3)}
          renderItem={renderTask}
        />
      ) : (
        <View style={{ marginVertical: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Text type='title' title='No Tasks For You' color={colors.body} />
        </View>
      )}
    </View>
  )
}

export default HomeTasks
