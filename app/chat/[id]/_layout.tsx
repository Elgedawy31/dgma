import { memo } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatLayout = () => {
    return (
        <Stack initialRouteName='index'>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='attachments' options={{ headerShown: false }} />
        </Stack>
    )
}

export default memo(ChatLayout)