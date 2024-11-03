import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

type Guest = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

type MeetingGuestListProps = {
  guests: Guest[];
  title?: string;
};

const GuestItem = ({ guest }: { guest: Guest }) => (
  <View style={styles.guestItem}>
    <Image
      source={{ uri: guest.avatar }}
      style={styles.avatar}
    />
    <View style={styles.guestInfo}>
      <Text style={styles.guestName}>{guest.name}</Text>
      <Text style={styles.guestRole}>{guest.role}</Text>
    </View>
  </View>
);

const MeetingGuestList = ({ guests, title = "Guests" }: MeetingGuestListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={guests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GuestItem guest={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000000',
  },
  listContent: {
    gap: 16,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  guestRole: {
    fontSize: 14,
    color: '#666666',
  },
});

export default MeetingGuestList;