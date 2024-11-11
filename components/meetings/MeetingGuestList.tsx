import { useThemeColor } from '@hooks/useThemeColor';
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

const GuestItem = ({ guest }: { guest: Guest }) => {
  const color = useThemeColor();

  return <View style={styles.guestItem}>
    <Image
      source={{ uri: guest.avatar }}
      style={styles.avatar}
    />
    <View style={styles.guestInfo}>
      <Text style={[styles.guestName , {color:color.text}]}>{guest.name}</Text>
      <Text style={[styles.guestRole ,{color:color.body}]}>{guest.role}</Text>
    </View>
  </View>
}

const MeetingGuestList = ({ guests, title = "Guests" }: MeetingGuestListProps) => {
  const color = useThemeColor();
  return (
    <View style={styles.container}>
      <Text style={[styles.title , {color:color.text}]}>{title}</Text>
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
    marginBottom: 4,
  },
  guestRole: {
    fontSize: 14,
  },
});

export default MeetingGuestList;