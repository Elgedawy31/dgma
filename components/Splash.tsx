import { useFonts } from 'expo-font';
import { ThemeContext } from '@ThemeContext';
import StatusBar from '@blocks/StatusBar';
import { useRef, useEffect, useContext, useState, memo } from 'react';
import { Image, StyleSheet, Text, View, Animated } from 'react-native';

function Splash() {
    const [fontsLoaded] = useFonts({
        'Inter': require('@/assets/fonts/Inter-Regular.ttf'),
    });

    const { theme } = useContext(ThemeContext);
    const [statusBarVisible, setStatusBarVisible] = useState(true);

    const animations = {
        topAnimX: useRef(new Animated.Value(0)).current,
        topAnimY: useRef(new Animated.Value(0)).current,
        bottomAnimX: useRef(new Animated.Value(0)).current,
        bottomAnimY: useRef(new Animated.Value(0)).current,
        fadeAnim: useRef(new Animated.Value(0)).current,
    };

    useEffect(() => {
        if (!fontsLoaded) return;

        const { topAnimX, topAnimY, bottomAnimX, bottomAnimY, fadeAnim } = animations;

        const translateAnimation = Animated.parallel([
            Animated.timing(topAnimX, {
                toValue: -400,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.timing(topAnimY, {
                toValue: -400,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.timing(bottomAnimX, {
                toValue: 400,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.timing(bottomAnimY, {
                toValue: 400,
                duration: 2000,
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
            Animated.delay(100), // Short delay before fading in
            fadeAnimation,
        ]).start(() => {
            setStatusBarVisible(false);
        });

    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null; // Or a loading indicator
    }

    return (
        <View style={styles.container}>
            {statusBarVisible && <StatusBar />}

            <Animated.View style={[
                styles.top,
                {
                    transform: [
                        { translateX: animations.topAnimX },
                        { translateY: animations.topAnimY }
                    ]
                }
            ]} />

            <Animated.View style={[
                styles.bottom,
                {
                    transform: [
                        { translateX: animations.bottomAnimX },
                        { translateY: animations.bottomAnimY }
                    ]
                }
            ]} />

            <Animated.View style={[styles.centerContent, { opacity: animations.fadeAnim }]}>
                <Image source={require('@images/logo-dark.png')} />
                <Text style={styles.title}>
                    DEV<Text style={styles.titleHighlight}>GLOBAL</Text>
                </Text>
            </Animated.View>
        </View>
    );
}
export default memo(Splash);

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
        backgroundColor: '#002D75',
        borderBottomRightRadius: 120,
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#002D75',
        borderTopLeftRadius: 120,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#002d75',
        fontSize: 32,
        fontWeight: '400',
    },
    titleHighlight: {
        color: '#3FA9F5',
    },
});
