import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@blocks/Text';
import { useThemeColor } from '@hooks/useThemeColor';
import IconWrapper from '@components/IconWrapper';


interface HeaderProps {
  onBackPress?: () => void;
  onSearchPress?: () => void;
}

const CalendarHeader: React.FC<HeaderProps> = ({ onBackPress, onSearchPress }) => {
    const colors = useThemeColor();
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBackPress}
      >
        <Ionicons name="chevron-back" size={20} color={colors.text} />
        <Text title='Calendar' />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.searchButton} 
        onPress={onSearchPress}
      >
       <IconWrapper size={40} Icon={<Ionicons name="search" size={20} color={colors.primary} />} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:8
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: -4,
  },
  searchButton: {
    padding: 4,
  },
});

export default CalendarHeader;