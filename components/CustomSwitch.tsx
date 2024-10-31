import { useThemeColor } from "@hooks/useThemeColor";
import React, { useEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const CustomSwitch = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const colorScheme = useThemeColor();

  // Shared value for animation
  const switchTranslateX = useSharedValue(isActive ? 17 : 0); // Set initial value based on isActive

  // Define animated style
  const animatedSwitchStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(switchTranslateX.value, { duration: 300 }) },
      ],
    };
  });

  // Handle toggle
  const toggleSwitch = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    // Update the animation when isActive changes
    switchTranslateX.value = isActive ? 17 : 0; // Adjust this value based on the size of the switch
  }, [isActive]);

  const styles = StyleSheet.create({
    switchContainer: {
      width: 48,
      height: 30,
      borderRadius: 15,
      padding: 5,
      justifyContent: "center",
      backgroundColor: "#ddd",
    },
    active: {
      backgroundColor: colorScheme.primary,
    },
    inactive: {
      backgroundColor: '#6E6D6D',
    },
    switchCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#fff",
    },
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <View
        style={[
          styles.switchContainer,
          isActive ? styles.active : styles.inactive,
        ]}
      >
        <Animated.View style={[styles.switchCircle, animatedSwitchStyle]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomSwitch;
