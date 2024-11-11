import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { useThemeColor } from "@hooks/useThemeColor";

const IconWrapper = ({
  size,
  Icon,
  theme = "dark",
  onPress,
}: {
  size: number;
  Icon: any;
  theme?: "dark" | "light";
  onPress?: any;
}) => {
  const color = useThemeColor();
  return (
    <TouchableOpacity
    onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor:
          theme === "dark"
            ? `${color.primary}10`
            : `${color.primary}10`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Icon}
    </TouchableOpacity>
  );
};

export default IconWrapper;
