import { Routes } from '@routes';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { memo } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthLayout() {

    return (
        <Stack
            initialRouteName='index'>
            <Stack.Screen name={Routes.login} options={{ headerShown: false }} />
            <Stack.Screen name={Routes.forgetPassword} options={{ headerShown: false }} />
            <Stack.Screen name={Routes.changePassword} options={{ headerShown: false }} />
            <Stack.Screen name={Routes.verifyPassword} options={{ headerShown: false }} />
        </Stack>
    );
}
export default memo(AuthLayout)