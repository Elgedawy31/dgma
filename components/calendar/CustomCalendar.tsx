import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ViewStyle, TextStyle, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  WithSpringConfig
} from 'react-native-reanimated';

interface CalendarEvent {
  status: 'success' | 'inprogress' | 'canceled' | 'started';
  date: Date;
}

interface CalendarStyles {
  container: ViewStyle;
  header: ViewStyle;
  monthYear: TextStyle;
  monthYearContainer: ViewStyle;
  navigationContainer: ViewStyle;
  navigationButton: ViewStyle;
  weekDays: ViewStyle;
  weekDayContainer: ViewStyle;
  weekDay: TextStyle;
  daysGrid: ViewStyle;
  dayContainer: ViewStyle;
  day: ViewStyle;
  dayText: TextStyle;
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  monthItem: ViewStyle;
  monthItemText: TextStyle;
}

interface CustomCalendarProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
  events: CalendarEvent[];
  style?: ViewStyle;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAYS: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS: string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const STATUS_COLORS = {
  success: '#90EE90',    // Green
  inprogress: '#FFD700', // Yellow
  canceled: '#FFB6C1',   // Pink/Red
  started: '#87CEEB'     // Blue
};

const springConfig: WithSpringConfig = {
  damping: 10,
  stiffness: 100,
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  initialDate = new Date(),
  onDateSelect,
  events = [],
  style,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const scaleValue = useSharedValue<number>(1);

  const dateStatusMap = useMemo(() => {
    const map = new Map<string, string>();
    events.forEach(event => {
      const eventDate = new Date(event.date);
      const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
      map.set(dateKey, STATUS_COLORS[event.status]);
    });
    return map;
  }, [events]);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = (): (number | null)[] => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getStatusColor = (day: number): string | null => {
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${day}`;
    return dateStatusMap.get(dateKey) || null;
  };

  const animatePress = (day: number | null): void => {
    if (!day) return;
    
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    onDateSelect?.(newDate);

    scaleValue.value = withSpring(0.9, springConfig, () => {
      scaleValue.value = withSpring(1, springConfig);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const navigateYear = (direction: number): void => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setSelectedDate(newDate);
  };

  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    setShowMonthPicker(false);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.monthYearContainer}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.monthYear}>
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            onPress={() => navigateYear(-1)} 
            style={styles.navigationButton}
          >
            <MaterialIcons name="arrow-back-ios" size={16} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigateYear(1)} 
            style={styles.navigationButton}
          >
            <MaterialIcons name='arrow-forward-ios' size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekDays}>
        {DAYS.map((day, index) => (
          <View key={index} style={styles.weekDayContainer}>
            <Text style={styles.weekDay}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {generateCalendarDays().map((day, index) => (
          <Animated.View key={index} style={[styles.dayContainer, animatedStyle]}>
            {day && (
              <TouchableOpacity
                onPress={() => animatePress(day)}
                style={[
                  styles.day,
                  getStatusColor(day) && {
                    backgroundColor: getStatusColor(day),
                    borderRadius: 20,
                  },
                ]}
              >
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ))}
      </View>

      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          onPress={() => setShowMonthPicker(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            {MONTHS.map((month, index) => (
              <TouchableOpacity
                key={month}
                style={styles.monthItem}
                onPress={() => selectMonth(index)}
              >
                <Text style={[
                  styles.monthItemText,
                  selectedDate.getMonth() === index && { color: '#007AFF', fontWeight: 'bold' }
                ]}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create<CalendarStyles>({
  container: {
    padding: 16,
    borderRadius: 10,
    width: SCREEN_WIDTH,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  navigationButton: {
    padding: 5,
  },
  weekDays: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weekDayContainer: {
    width: (SCREEN_WIDTH - 32) / 7,
    alignItems: 'center',
  },
  weekDay: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 0,
    rowGap: 15,
  },
  dayContainer: {
    width: (SCREEN_WIDTH - 32) / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  monthItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  monthItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomCalendar;