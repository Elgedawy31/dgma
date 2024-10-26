import React, { useRef, useEffect, memo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

function ProgressBar({ progress }: { progress: number }) {
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
        <View style={styles.progressBar}>
            <Animated.View style={[styles.progress, { width: widthInterpolation }]} />
        </View>
    );
}
export default memo(ProgressBar);

const styles = StyleSheet.create({
    progressBar: {
        height: 12,
        width: '90%',
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#FCFCFC',
        borderColor: '#002D75',
        borderWidth: 1,
    },
    progress: {
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#002D75',
    },
});
