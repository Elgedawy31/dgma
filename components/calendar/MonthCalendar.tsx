import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'review' | 'overdue' | 'progress' | 'completed' | 'pending' | 'cancelled';
}

interface CalendarProps {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
}

const CustomCalendar: React.FC<CalendarProps> = ({ tasks, onTaskPress }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);

  const getDaysInMonth = (): number => {
    return currentDate.daysInMonth();
  };

  const getFirstDayOfMonth = (): number => {
    return currentDate.startOf('month').day();
  };

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const days: (number | null)[] = Array(firstDay).fill(null);
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    while (days.length < 42) {
      days.push(null);
    }

    setCalendarDays(days);
  };

  const isSameDay = (date1: Date, date2: dayjs.Dayjs): boolean => {
    const d1 = dayjs(date1);
    return d1.format('YYYY-MM-DD') === date2.format('YYYY-MM-DD');
  };

  const isWithinRange = (date: dayjs.Dayjs, start: Date, end: Date): boolean => {
    const dateStr = date.format('YYYY-MM-DD');
    const startStr = dayjs(start).format('YYYY-MM-DD');
    const endStr = dayjs(end).format('YYYY-MM-DD');
    return dateStr >= startStr && dateStr <= endStr;
  };

  const getTasksForDay = (day: number) => {
    if (!day) return [];
    
    const dayDate = currentDate.date(day);
    
    return tasks.filter(task => {
      return isWithinRange(dayDate, task.startDate, task.endDate);
    }).map(task => ({
      ...task,
      status: task?.status,
      isStart: isSameDay(task.startDate, dayDate),
      isEnd: isSameDay(task.endDate, dayDate),
      daysFromStart: dayjs(dayDate).diff(dayjs(task.startDate), 'day'),
      totalDays: dayjs(task.endDate).diff(dayjs(task.startDate), 'day') + 1
    }));
  };

  const renderTaskBars = (day: number) => {
    if (!day) return null;
    
    const dayTasks = getTasksForDay(day);
    
    return dayTasks.map((task, index) => {
      const barStyle = [
        styles.taskBar,
        styles[task.status],
        { 
          top: index * 28,
          marginLeft: task.isStart ? 4 : -8,
          marginRight: task.isEnd ? 4 : -8,
          borderRadius: 6,
          zIndex: task.isStart ? 2 : 1
        }
      ];

      const shouldShowTitle = task.totalDays >= 2;

      return (
        <TouchableOpacity
          key={`${task.id}-${day}`}
          style={barStyle}
          onPress={() => onTaskPress?.(task)}
          activeOpacity={0.7}
        >
          {shouldShowTitle && task.daysFromStart === 0 && (
            <Text style={styles.taskText} numberOfLines={1} ellipsizeMode="tail">
              {task.title}
            </Text>
          )}
        </TouchableOpacity>
      );
    });
  };

  const onPrevMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  };

  const onNextMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'));
  };

  const renderDayNumber = (day: number | null) => {
    if (!day) return null;

    const today = dayjs();
    const isToday = today.format('YYYY-MM-DD') === currentDate.date(day).format('YYYY-MM-DD');

    return (
      <View style={styles.dayNumberContainer}>
        <Text style={[styles.dayText, isToday && styles.todayText]}>
          {day}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevMonth} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {currentDate.format('MMMM YYYY')}
        </Text>
        
        <TouchableOpacity onPress={onNextMonth} style={styles.headerButton}>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.weekDays}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <View key={index} style={styles.weekDayContainer}>
              <Text style={styles.weekDayText}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calendarDays.map((day, index) => (
            <View key={index} style={styles.dayCell}>
              {day !== null && (
                <View style={styles.dayContent}>
                  {renderDayNumber(day)}
                  <View style={styles.taskContainer}>
                    {renderTaskBars(day)}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 48,
  },
  headerButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calendarContainer: {
    flex: 1,
    marginTop: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekDayContainer: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  weekDayText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  daysGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'stretch',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dayContent: {
    flex: 1,
    padding: 4,
  },
  dayNumberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    height: 24,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  taskContainer: {
    position: 'absolute',
    top: 30,
    left: 4,
    right: 4,
    bottom: 0,
  },
  taskBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 28,
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  taskText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    paddingLeft: 8,
    paddingRight: 8,
  },
  review: {
    backgroundColor: 'rgba(38, 132, 255, 0.9)',
  },
  overdue: {
    backgroundColor: 'rgba(229, 76, 76, 0.9)',
  },
  progress: {
    backgroundColor: 'rgba(255, 196, 0, 0.9)',
  },
  completed: {
    backgroundColor: 'rgba(87, 217, 163, 0.9)',
  },
  pending: {
    backgroundColor: 'rgba(217, 217, 217, 0.9)',
  },
  cancelled: {
    backgroundColor: 'rgba(3, 36, 60, 0.9)',
  },
});

export default CustomCalendar;