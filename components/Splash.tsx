// components/Splash.tsx
import { useFonts } from 'expo-font';
import { ThemeContext } from '@ThemeContext';
import { useRef, useEffect, useContext, useState, memo } from 'react';
import { Image, StyleSheet, Text, View, Animated } from 'react-native';
import { useThemeColor } from '@hooks/useThemeColor';

function Splash() {
    const colors = useThemeColor();
    const [fontsLoaded] = useFonts({
        'Inter': require('@/assets/fonts/Inter-Regular.ttf'),
    });

    const { theme } = useContext(ThemeContext);
    const [statusBarVisible, setStatusBarVisible] = useState(true);

    const animations = {
        topAnim: useRef(new Animated.Value(0)).current,
        bottomAnim: useRef(new Animated.Value(0)).current,
        fadeAnim: useRef(new Animated.Value(0)).current,
    };

    useEffect(() => {
        if (!fontsLoaded) return;

        const { topAnim, bottomAnim, fadeAnim } = animations;

        const translateAnimation = Animated.parallel([
            Animated.timing(topAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(bottomAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]);

        const fadeAnimation = Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        });

        Animated.sequence([
            translateAnimation,
            Animated.delay(50),
            fadeAnimation,
        ]).start(() => {
            setStatusBarVisible(false);
        });

    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const topTransform = {
        transform: [
            {
                translateX: animations.topAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -400]
                })
            },
            {
                translateY: animations.topAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -400]
                })
            }
        ]
    };

    const bottomTransform = {
        transform: [
            {
                translateX: animations.bottomAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 400]
                })
            },
            {
                translateY: animations.bottomAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 400]
                })
            }
        ]
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.welcomeLogo }]}>
            <Animated.View
                style={[
                    styles.top,
                    {
                        backgroundColor: colors.splash,
                    },
                    topTransform
                ]}
            />

            <Animated.View
                style={[
                    styles.bottom,
                    {
                        backgroundColor: colors.splash,
                    },
                    bottomTransform
                ]}
            />

            <Animated.View
                style={[
                    styles.centerContent,
                    { opacity: animations.fadeAnim }
                ]}
            >
                <Image
                    source={require('@images/logo-dark.png')}
                    style={styles.logo}
                />
                <Text style={[
                    styles.title,
                    { color: theme === 'dark' ? "#2460dd" : "#002d75" }
                ]}>
                    DEV
                    <Text style={{
                        color: theme === 'dark' ? "#b7e6ff" : "#3fa9f5"
                    }}>
                        GLOBAL
                    </Text>
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    top: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '50%',
        borderBottomRightRadius: 120,
        backfaceVisibility: 'hidden',
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: '50%',
        borderTopLeftRadius: 120,
        backfaceVisibility: 'hidden',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: '400',
        fontFamily: 'Inter',
    },
});

export default memo(Splash);