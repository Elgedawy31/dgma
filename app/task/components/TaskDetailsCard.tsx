import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  startDate,
  endDate,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateWrapper}>
            <Ionicons name="calendar-outline" size={16} color="#666" style={styles.icon} />
            <Text style={styles.dateLabel}>Start Date:</Text>
            <Text style={styles.dateTextBlue}>{startDate}</Text>
          </View>
          
          <View style={styles.dateWrapper}>
            <Ionicons name="calendar-outline" size={16} color="#666" style={styles.icon} />
            <Text style={styles.dateLabel}>End Date:</Text>
            <Text style={styles.dateTextRed}>{endDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F1010',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
    fontWeight:'400',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  icon: {
    marginRight: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#515151',
  },
  dateTextBlue: {
    fontSize: 14,
    color: '#2684FF',
    fontWeight: '500',
  },
  dateTextRed: {
    fontSize: 14,
    color: '#E54C4C',
    fontWeight: '500',
  },
});

export default TaskCard;