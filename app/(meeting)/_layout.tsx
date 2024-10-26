import { StyleSheet } from 'react-native'
import { memo, } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

function MeetingLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name='[id]' options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView >
  )
}
export default memo(MeetingLayout)
const styles = StyleSheet.create({})