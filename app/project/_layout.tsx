//#region Imports
import { memo } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProjectDetailsContextProvider from '@ProjectDetailsContext'
//#endregion

function ProjectLayout() {
    //#region UI
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ProjectDetailsContextProvider>
                <Stack>
                    <Stack.Screen name='preview' options={{ headerShown: false, }} />
                    <Stack.Screen name='all-projects' options={{ headerShown: false, }} />
                    <Stack.Screen name='details' options={{ headerShown: false, }} />
                </Stack>
            </ProjectDetailsContextProvider>
        </SafeAreaView>
    )
    //#endregion
}
export default memo(ProjectLayout)
