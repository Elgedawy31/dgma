import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import Icon from '@blocks/Icon';
import { useThemeColor } from '@hooks/useThemeColor';
import IconModel from '@model/icon';

type ButtonProps = {
    label?: string;
    bgColor?: string;
    icon?: IconModel;
    conStyle?: ViewStyle;
    txtStyle?: ViewStyle;
    onPress?: () => void;
    align?: 'flex-start' | 'center' | 'flex-end';
    type?: 'primary' | 'float' | 'text';
    position?: { vertical: number, horizontal: number };
    width?: 100 | 90 | 80 | 70 | 60 | 50 | 40 | 30 | 20 | 10;
}

const Button = ({
    width,
    conStyle,
    txtStyle,
    icon,
    position = { vertical: 0, horizontal: 0 },
    align = 'center',
    label = "Button",
    type = 'primary',
    onPress = () => { alert("No Functionality Provided") },
}: ButtonProps) => {
    const colors = useThemeColor();

    return (
        <View>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles[type], { alignItems: align },
                    width && { width: `${width}%` },
                    type === 'float' && {
                        backgroundColor: colors.primary,
                        bottom: position?.vertical,
                        right: position?.horizontal
                    },

                    type === 'primary' && {
                        backgroundColor: pressed ? 'darkblue' : colors.primary
                    },
                    conStyle
                ]}
            >
                {type !== 'float' ? (
                    <Text style={[
                        styles.title,
                        {
                            color: type === 'text' ? colors.primary :
                                colors.white
                        },
                        type === 'text' && { fontSize: 16 },
                        txtStyle
                    ]}>
                        {label}
                    </Text>
                ) : (
                    <Icon
                        onPress={onPress}
                        size={34}
                        icon={icon!}
                        iconColor='white'
                        bgColor={colors.primary}
                    />
                )}
            </Pressable>
        </View>
    );
}

export default memo(Button);

const styles = StyleSheet.create({

    primary: {
        padding: 10,
        width: '100%',
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    float: {
        width: 65,
        aspectRatio: 1,
        borderRadius: 40,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '400',
        fontStyle: 'normal',
        textAlign: 'center',
    }
});