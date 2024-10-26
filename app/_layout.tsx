import { Routes } from '@routes';
import { memo, useEffect } from 'react';
import StatusBar from '@blocks/StatusBar';
import useStorage from '@hooks/useStorage';
import { router, Stack } from 'expo-router';
import Providers from '@ProviderContext';
import useSecureStorage from '@hooks/useSecureStorage';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootLayout() {
    const { readStorage: readToken, removeStorage: removeToken } = useSecureStorage();
    const { readStorage: readOnboarding, removeStorage } = useStorage();
    useEffect(() => {
        const checkCondition = async () => {
            // removeStorage('role');
            // removeStorage('name');
            // removeToken('token');
            const token = await readToken('token');
            setTimeout(async () => {
                if (token) {
                    router.replace(Routes.tabs);
                } else {
                    await readOnboarding('onboarding') === 'done' ?
                        router.replace(Routes.auth)
                        : router.replace(Routes.onboarding);
                }
            }, 3500);
        };
        checkCondition();
    }, []);

    return (
        <Providers>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <StatusBar />
                    <Stack>
                        <Stack.Screen name="chat" options={{ headerShown: false }} />
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="profile" options={{ headerShown: false }} />
                        <Stack.Screen name="project" options={{ headerShown: false }} />
                        <Stack.Screen name="(meeting)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                    </Stack>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </Providers>
    )
}
export default memo(RootLayout)