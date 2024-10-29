import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TaskData {
  title: string;
  description: string;
  type: 'personal';
  startDate: string | null;
  deadline: string | null;
  projectId: string | null;
  assignedTo: string[];
  status: 'To Do';
}

interface CustomDatePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onDateSelect: (date: string, fieldType: 'startDate' | 'deadline') => void;
  dateType: 'startDate' | 'deadline';
  selectedStartDate: string | null;
  selectedDeadline: string | null;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  isVisible,
  onClose,
  onDateSelect,
  dateType,
  selectedStartDate,
  selectedDeadline
}) => {
  const initialDate = dateType === 'startDate' ? selectedStartDate : selectedDeadline;
  const [selectedDate, setSelectedDate] = React.useState<number>(
    initialDate ? new Date(initialDate).getDate() : new Date().getDate()
  );
  const [currentMonth, setCurrentMonth] = React.useState<number>(
    initialDate ? new Date(initialDate).getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    initialDate ? new Date(initialDate).getFullYear() : new Date().getFullYear()
  );
  
  const colors = useThemeColor();

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const totalDays = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    const days: (number | null)[] = Array(totalDays).fill(null);

    for (let i = 0; i < daysInMonth; i++) {
      days[i + firstDay] = i + 1;
    }

    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }

    return rows;
  };

  const isDateDisabled = (day: number | null): boolean => {
    if (!day) return true;
    
    const currentDate = new Date(currentYear, currentMonth, day);
    
    if (dateType === 'deadline' && selectedStartDate) {
      const startDate = new Date(selectedStartDate);
      return currentDate < startDate;
    }
    
    if (dateType === 'startDate' && selectedDeadline) {
      const deadlineDate = new Date(selectedDeadline);
      return currentDate > deadlineDate;
    }
    
    return false;
  };

  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(day);
    onDateSelect(dateString, dateType);
    onClose();
  };

  const renderWeekDays = () => {
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return weekDays.map((day, index) => (
      <View key={index} style={styles.weekDayContainer}>
        <Text style={styles.weekDay}>{day}</Text>
      </View>
    ));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.header}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
            <Text style={styles.headerTitle}>
              Select {dateType === 'startDate' ? 'start date' : 'deadline'}
            </Text>
          </TouchableOpacity>

          <View style={styles.monthSelector}>
            <View>
              <Text style={styles.monthYear}>
                {`${months[currentMonth]} ${currentYear}`}
              </Text>
            </View>
            <View style={styles.monthControls}>
              <TouchableOpacity onPress={handlePrevMonth}>
                <Ionicons name="chevron-back" size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calendar}>
            <View style={styles.weekDays}>{renderWeekDays()}</View>
            <View style={styles.daysGrid}>
              {generateCalendarDays().map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((day, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.dayCell,
                        day === selectedDate && styles.selectedDay,
                        isDateDisabled(day) && styles.disabledDay,
                      ]}
                      onPress={() => day && handleDateSelect(day)}
                      disabled={!day || isDateDisabled(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          day === selectedDate && styles.selectedDayText,
                          isDateDisabled(day) && styles.disabledDayText,
                        ]}
                      >
                        {day || ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 24,
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#CAC4D0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#515151',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
    marginTop: 10,
  },
  monthControls: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  monthYear: {
    fontSize: 17,
    fontWeight: '600',
    color: '#515151',
  },
  calendar: {
    paddingHorizontal: 10,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayContainer: {
    width: 40,
    alignItems: 'center',
  },
  weekDay: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  daysGrid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#515151',
  },
  selectedDay: {
    backgroundColor: '#007AFF10',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#002D75',
  },
  selectedDayText: {
    color: '#002D75',
    fontWeight: '600',
  },
  disabledDay: {
    opacity: 0.4,
  },
  disabledDayText: {
    color: '#999',
  },
});

export default CustomDatePicker;