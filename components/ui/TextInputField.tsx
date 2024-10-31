import React, { memo, useCallback, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  Text as RText,
} from "react-native";
import { useThemeColor } from "@hooks/useThemeColor";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import Icon from "@blocks/Icon";
import IconModel from "@model/icon";
import Text from "@blocks/Text";

type InputType = "text" | "email" | "password" | "date";

interface InputFieldProps extends Omit<TextInputProps, "onChangeText"> {
  label?: string;
  type?: InputType;
  noLabel?: boolean;
  hasIcon?: boolean;
  noBorder?: boolean;
  multiline?: boolean;
  capitalize?: boolean;
  errorMessage?: string;
  align?: "center" | "left" | "right" | "justify";
  onChangeText: (text: string) => void;
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    display: "flex",
  },
  label: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "500",
    color: "#232425",
  },
  input: {
    flex: 1,
    minHeight: 48,
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: "bold",
    borderWidth: 1,
  },
});

const InputField: React.FC<InputFieldProps> = ({
  label,
  hasIcon,
  type = "text",
  errorMessage,
  multiline,
  capitalize,
  align,
  noLabel,
  noBorder,
  onChangeText,
  ...props
}) => {
  const colors = useThemeColor();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const getInputProps = useCallback(() => {
    switch (type) {
      case "email":
        return {
          keyboardType: "email-address" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
        };
      case "password":
        return {
          secureTextEntry: !isPasswordVisible,
          autoCapitalize: "none" as const,
          autoCorrect: false,
        };

      default:
        return {};
    }
  }, []);

  const handleIcon = useCallback(() => {
    switch (type) {
      case "password":
        return isPasswordVisible
          ? ("eye-off" as IconModel)
          : ("eye" as IconModel);
      case "date":
        return "calendar-number" as IconModel;

      default:
        return "add" as IconModel;
    }
  }, []);

  return (
    <View style={styles.container}>
      {!noLabel && <RText style={styles.label}>{label}</RText>}
      <View
        style={{
          flexDirection: "row",
          position: "relative",
          alignItems: "center",
        }}
      >
        <TextInput
        editable={false}
          style={[
            styles.input,

            noBorder && { borderWidth: 0 },
            { width: "100%", flex: 1 },
            { textTransform: capitalize ? "capitalize" : "none" },
            { textAlign: align || "left" },
            { borderColor: "#ececec", backgroundColor: colors.card },
          ]}
          placeholder={`Enter ${label}`}
          placeholderTextColor={"#A0A3A6"}
          onChangeText={onChangeText}
          multiline={multiline}
          {...getInputProps()}
          {...props}
        />
        {hasIcon && (
          <Icon
            icon={handleIcon()}
            style={{ position: "absolute", right: 10 }}
            onPress={() => setPasswordVisibility(!isPasswordVisible)}
          />
          // <Ionicons
          //     name={isPasswordVisible ? "eye-off" : "eye"}
          //     size={24}
          //
          // />
        )}
      </View>
      {errorMessage && <Text type="error" title={errorMessage} />}
    </View>
  );
};

interface ControlledInputFieldProps
  extends Omit<InputFieldProps, "onChangeText"> {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
}

const TextInputField: React.FC<ControlledInputFieldProps> = ({
  control,
  name,
  rules,
  ...rest
}) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <InputField
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        errorMessage={error?.message}
        {...rest}
      />
    )}
  />
);
export default memo(TextInputField);
