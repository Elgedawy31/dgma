//#region Imports
import { memo } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
//#endregion

function ProjectLayout() {
    //#region UI
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name='[id]' options={{ headerShown: false, }} />
            </Stack>
        </SafeAreaView>
    )
    //#endregion
}
export default memo(ProjectLayout)
