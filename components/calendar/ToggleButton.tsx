import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ViewType = 'list' | 'month';

interface ToggleViewProps {
  onViewChange?: (view: ViewType) => void;
}

const ToggleView: React.FC<ToggleViewProps> = ({ onViewChange }) => {
  const [activeView, setActiveView] = useState<ViewType>('list');

  const handlePress = (view: ViewType) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            activeView === 'list' && styles.activeButton,
            styles.leftButton,
          ]}
          onPress={() => handlePress('list')}
        >
          <Text
            style={[
              styles.buttonText,
              activeView === 'list' && styles.activeText,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeView === 'month' && styles.activeButton,
            styles.rightButton,
          ]}
          onPress={() => handlePress('month')}
        >
          <Text
            style={[
              styles.buttonText,
              activeView === 'month' && styles.activeText,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#002B7F', // Dark blue color from image
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
  },
  leftButton: {
    marginRight: 2,
  },
  rightButton: {
    marginLeft: 2,
  },
});

export default ToggleView;