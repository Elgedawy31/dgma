import { useThemeColor } from '@hooks/useThemeColor';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface DayProps {
  date: number;
  day: string;
  isSelected: boolean;
  isToday: boolean;
  onSelect: () => void;
}

const DayComponent: React.FC<DayProps> = ({
  date,
  day,
  isSelected,
  isToday,
  onSelect,
}) => {
  const colors = useThemeColor()
return  <TouchableOpacity
    style={[
      styles(colors).dayContainer,
      isSelected && styles(colors).selectedDay,
    ]}
    onPress={onSelect}
  >
    <Text
      style={[
        styles(colors).dateText,
        isToday && styles(colors).todayText,
        isSelected && styles(colors).selectedText,
      ]}
    >
      {date}
    </Text>
    <Text
      style={[
        styles(colors).dayText,
        isToday && styles(colors).todayText,
        isSelected && styles(colors).selectedText,
      ]}
    >
      {day}
    </Text>
  </TouchableOpacity>
}

interface HorizontalCalendarProps {
  onDateSelect?: (date: Date) => void;
  currentDate: string; // Format: "YYYY-MM-DD"
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  onDateSelect,
  currentDate,
}) => {
  const parsedDate = new Date(currentDate);
  const [selectedDate, setSelectedDate] = useState<Date>(parsedDate);
  const scrollViewRef = useRef<ScrollView>(null);
  const today = new Date();
  const colors = useThemeColor()

  const getDates = () => {
    const dates = [];
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month, i);
      dates.push(date);
    }

    return dates;
  };

  const dates = getDates();

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  useEffect(() => {
    const selectedDay = parsedDate.getDate();
    const selectedIndex = dates.findIndex(
      (date) => date.getDate() === selectedDay
    );
    
    if (selectedIndex !== -1 && scrollViewRef.current) {
      const xOffset = selectedIndex * 48;
      scrollViewRef.current.scrollTo({
        x: Math.max(0, xOffset - 40),
        animated: true,
      });
    }
    setSelectedDate(parsedDate);
  }, [currentDate]);

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles(colors).scrollContent}
      snapToInterval={48}
      decelerationRate="fast"
    >
      {dates.map((date, index) => (
        <DayComponent
          key={index}
          date={date.getDate()}
          day={formatDay(date)}
          isSelected={isSelected(date)}
          isToday={isToday(date)}
          onSelect={() => {
            setSelectedDate(date);
            onDateSelect?.(date);
          }}
        />
      ))}
    </ScrollView>
  );
};

const styles =(colors:any) =>  StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dayContainer: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
  },
  selectedDay: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.body,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  todayText: {
    color: '#000',

  },
  selectedText: {
    color: colors.primary,
  },
});

export default HorizontalCalendar;