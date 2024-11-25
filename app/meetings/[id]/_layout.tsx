import React, { memo } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

function Profilelayout() {
    return (
            <Stack initialRouteName='index'>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="reviewMeetings" options={{ headerShown: false }} />
                <Stack.Screen name='LandingMeeting' options={{ headerShown: false }} />
            </Stack>
    )
}
export default memo(Profilelayout)