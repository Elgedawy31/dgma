import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions 
} from 'react-native';

interface DayProps {
  date: number;
  day: string;
  isSelected: boolean;
  isToday: boolean;
  onSelect: () => void;
}

const DayComponent: React.FC<DayProps> = ({ date, day, isSelected, isToday, onSelect }) => (
  <TouchableOpacity 
    style={[
      styles.dayContainer,
      isSelected && styles.selectedDay,
    ]} 
    onPress={onSelect}
  >
    <Text style={[
      styles.dateText,
      isToday && styles.todayText,
      isSelected && styles.selectedText
    ]}>
      {date}
    </Text>
    <Text style={[
      styles.dayText,
      isToday && styles.todayText,
      isSelected && styles.selectedText
    ]}>
      {day}
    </Text>
  </TouchableOpacity>
);

interface HorizontalCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const scrollViewRef = useRef<ScrollView>(null);
  const today = new Date();

  // Generate dates for the current month
  const getDates = () => {
    const dates = [];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month, i);
      dates.push(date);
    }

    return dates;
  };

  const dates = getDates();

  // Format day name (Mon, Tue, etc)
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  useEffect(() => {
    // Scroll to today's date
    const todayIndex = dates.findIndex(
      date => date.getDate() === today.getDate()
    );
    if (todayIndex !== -1 && scrollViewRef.current) {
      const xOffset = todayIndex * 80; // Adjust based on item width
      scrollViewRef.current.scrollTo({ x: xOffset - 40, animated: true });
    }
  }, []);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      snapToInterval={80} // Match item width for snapping
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

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dayContainer: {
    width: 40,
    height:60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
  },
  selectedDay: {
    borderWidth: 1,
    borderColor: '#002B7F',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  todayText: {
    color: '#002B7F',
  },
  selectedText: {
    color: '#002B7F',
  },
});

export default HorizontalCalendar;