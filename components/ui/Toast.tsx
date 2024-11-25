import { useThemeColor } from "@hooks/useThemeColor";
import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Modal from "react-native-modal";

interface ToastProps {
  isVisible: boolean;
  message: string;
  onHide: () => void;
  isError?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  message,
  onHide,
  isError=false,
}) => {
  const colors = useThemeColor();
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0}
      animationIn="fadeInDown"
      animationOut="fadeOutUp"
      useNativeDriver
      style={styles.modal}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isError ? colors.cancel : "rgba(0, 0, 0, 0.8)" },
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  container: {
    padding: 16,
    borderRadius: 8,
    maxWidth: "80%",
  },
  message: {
    color: "white",
    textAlign: "center",
  },
});
