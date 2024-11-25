import { useThemeColor } from '@hooks/useThemeColor';
import React, { useRef, useEffect, memo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

function ProgressBar({ progress }: { progress: number }) {
    const colors = useThemeColor();
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const widthInterpolation = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={[styles.progressBar, { borderColor: colors.primary, }]}>
            <Animated.View style={[styles.progress, { width: widthInterpolation, backgroundColor: colors.primary }]} />
        </View>
    );
}
export default memo(ProgressBar);

const styles = StyleSheet.create({
    progress: { height: '100%', borderRadius: 30 },
    progressBar: {
        height: 12,
        width: '90%',
        borderWidth: 1,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
});
