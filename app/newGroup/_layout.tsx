import {  StyleSheet } from 'react-native'
import { memo, } from 'react'
import { Stack } from 'expo-router'
import AppBar from '@blocks/AppBar'
import Icon from '@blocks/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

function MessagingLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                          </Stack>
        </SafeAreaView>
    )
}
export default memo(MessagingLayout)
const styles = StyleSheet.create({})