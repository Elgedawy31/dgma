import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, TextInput, View, TextInputProps } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Text from "@blocks/Text";
import { useThemeColor } from "@hooks/useThemeColor";
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import Icon from '@blocks/Icon';
import IconModel from '@model/icon';

type InputType = 'text' | 'email' | 'password';

interface InputFieldProps extends Omit<TextInputProps, 'onChangeText'> {
    editable?: boolean
    label?: string;
    labelColor?: any;
    type?: InputType;
    noLabel?: boolean;
    hasIcon?: boolean;
    noBorder?: boolean;
    multiline?: boolean;
    capitalize?: boolean;
    errorMessage?: string;
    align?: 'center' | 'left' | 'right' | 'justify';
    onChangeText: (text: string) => void;
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        display: "flex",
    },
    label: {
        margin: 0,
        padding: 0,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '500',
        fontStyle: 'normal',
    },
    input: {
        flex: 1,
        minHeight: 48,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    inputContainer: {
        flexDirection: "row",
        position: "relative",
        alignItems: "center"
    },
    icon: {
        position: "absolute",
        right: 10,
        padding: 8, // Add padding for better touch target
    }
});

const InputField: React.FC<InputFieldProps> = ({
    editable = true,
    label,
    labelColor,
    hasIcon,
    type = 'text',
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
            case 'email':
                return {
                    keyboardType: 'email-address' as const,
                    autoCapitalize: 'none' as const,
                    autoCorrect: false,
                };
            case 'password':
                return {
                    secureTextEntry: !isPasswordVisible,
                    autoCapitalize: 'none' as const,
                    autoCorrect: false,
                };
            default:
                return {};
        }
    }, [type, isPasswordVisible]); // Add isPasswordVisible to dependencies

    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility(prev => !prev);
    }, []);

    return (
        <View style={styles.container}>
            {!noLabel && <Text color={labelColor} type='label' title={label} />}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholderTextColor={colors.body}
                    editable={editable}
                    style={[
                        styles.input,
                        { color: colors.text },
                        noBorder && { borderWidth: 0 },
                        { width: '100%', flex: 1, verticalAlign: multiline ? 'top' : 'middle' },
                        { textTransform: capitalize ? 'capitalize' : 'none' },
                        { textAlign: align || 'left' },
                        { borderColor: colors.primary, backgroundColor: colors.card }
                    ]}
                    placeholder={`Enter ${label}`}
                    onChangeText={onChangeText}
                    multiline={multiline}
                    {...getInputProps()}
                    {...props}
                />
                {type === 'password' && hasIcon && (
                    <Icon
                        icon={isPasswordVisible ? "hide-password" : "show-password"}
                        iconColor={colors.icons}
                        size={24}
                        style={styles.icon}
                        onPress={togglePasswordVisibility}
                    />
                )}
            </View>
            {errorMessage && <Text type='error' title={errorMessage} />}
        </View>
    );
};

interface ControlledInputFieldProps extends Omit<InputFieldProps, 'onChangeText'> {
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