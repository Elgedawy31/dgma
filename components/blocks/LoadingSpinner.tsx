import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';


interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#2684FF',
  style,
}) => {
 

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1 ,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default LoadingSpinner;
