import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';

type MeetingDetailsCardProps = {
  title: string;
  description: string;
  host: string;
  date: string;
  time: string;
  onJoin?: () => void;
};

const MeetingDetailsCard = ({
  title,
  description,
  host,
  date,
  time,
  onJoin
}: MeetingDetailsCardProps) => {
    const color = useThemeColor()
  const {id} = useLocalSearchParams();

  return (
    <View style={styles(color).container}>
      <View style={styles(color).content}>
        <Text style={styles(color).title}>{title}</Text>
        <Text style={styles(color).description}>{description}</Text>
        
        <View style={styles(color).infoContainer}>
          <View style={styles(color).infoItem}>
            <Feather name="user" size={20} color={color.primary} />
            <View style={styles(color).infoTextContainer}>
              <Text style={styles(color).infoLabel}>Host</Text>
              <Text style={styles(color).infoValue}>{host}</Text>
            </View>
          </View>

          <View style={styles(color).infoItem}>
            <Feather name="calendar" size={20} color={color.primary} />
            <View style={styles(color).infoTextContainer}>
              <Text style={styles(color).infoLabel}>Date</Text>
              <Text style={styles(color).infoValue}>{date}</Text>
            </View>
          </View>

          <View style={styles(color).infoItem}>
            <Feather name="clock" size={20} color={color.primary} />
            <View style={styles(color).infoTextContainer}>
              <Text style={styles(color).infoLabel}>Time</Text>
              <Text style={styles(color).infoValue}>{time}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles(color).joinButton}
          onPress={() => router.push(`/meetings/${id}/ReviewMeetings`)} 
        >
          <Text style={styles(color).joinButtonText}>Join meeting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles =(color:any) =>  StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: color.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: color.body,
    marginBottom: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    alignItems: 'center',
    gap: 8,
  },
  infoTextContainer: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: color.body,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '400',
    color: color.text,
  },
  joinButton: {
    backgroundColor: color.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width:'90%' ,
    marginHorizontal: 'auto',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default MeetingDetailsCard;