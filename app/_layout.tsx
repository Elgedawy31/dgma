import { Routes } from '@routes';
import { memo, useEffect } from 'react';
import Providers from '@ProviderContext';
import StatusBar from '@blocks/StatusBar';
import useStorage from '@hooks/useStorage';
import { router, Stack, usePathname } from 'expo-router';
import { ChatProvider } from '@context/ChatContext';
import useSecureStorage from '@hooks/useSecureStorage';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import NotificationSystem from '@components/NotificationSystem';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootLayout() {
    const { readStorage: readToken, } = useSecureStorage();
    const { readStorage: readOnboarding, removeStorage } = useStorage();
    useEffect(() => {
        const checkCondition = async () => {
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
                    <ChatProvider>
                        <NotificationSystem>
                            <StatusBar hidden />
                            <Stack>
                                <Stack.Screen name="chat" options={{ headerShown: false }} />
                                <Stack.Screen name="newGroup" options={{ headerShown: false }} />
                                <Stack.Screen name="task" options={{ headerShown: false }} />
                                <Stack.Screen name="index" options={{ headerShown: false }} />
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                                <Stack.Screen name="meetings" options={{ headerShown: false }} />
                                <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
                                <Stack.Screen name="profile" options={{ headerShown: false }} />
                                <Stack.Screen name="project" options={{ headerShown: false }} />
                                <Stack.Screen name="(meeting)" options={{ headerShown: false }} />
                                <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                            </Stack>
                        </NotificationSystem>
                    </ChatProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </Providers>
    )
}

export default memo(RootLayout);
