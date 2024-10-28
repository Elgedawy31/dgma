// CustomCalendar.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'pink' | 'purple' | 'lightPurple';
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
      isStart: isSameDay(task.startDate, dayDate),
      isEnd: isSameDay(task.endDate, dayDate)
    }));
  };

  const renderTaskBars = (day: number) => {
    if (!day) return null;
    
    const dayTasks = getTasksForDay(day);
    
    return dayTasks.map((task, index) => {
      const barStyle = [
        styles.taskBar,
        styles[task.status],
        { top: index * 24 },
        task.isStart && { marginLeft: 0, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
        task.isEnd && { marginRight: 0, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
        !task.isStart && { marginLeft: -1 },
        !task.isEnd && { marginRight: -1 },
      ];

      return (
        <TouchableOpacity
          key={`${task.id}-${day}`}
          style={barStyle}
          onPress={() => onTaskPress?.(task)}
          activeOpacity={0.7}
        >
          {task.isStart && (
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
      <Text style={[styles.dayText, isToday && styles.todayText]}>
        {day}
      </Text>
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
            <Text key={index} style={styles.weekDayText}>
              {day}
            </Text>
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
    backgroundColor: 'white',
    padding: 16,
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
    marginTop: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  daysGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'stretch',
    height: '100%',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: `${100 / 6}%`,
    padding: 2,
  },
  dayContent: {
    flex: 1,
    padding: 4,
    borderRadius: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  taskContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
  },
  taskBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    justifyContent: 'center',
    zIndex: 1,
  },
  taskText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    paddingLeft: 4,
    paddingRight: 4,
  },
  pink: {
    backgroundColor: '#ffb6c1',
  },
  purple: {
    backgroundColor: '#e6e6fa',
  },
  lightPurple: {
    backgroundColor: '#d8bfd8',
  },
});

export default CustomCalendar;