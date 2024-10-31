import React, { memo } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

function Profilelayout() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack initialRouteName='index'>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
                <Stack.Screen name="users" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaView>
    )
}
export default memo(Profilelayout)