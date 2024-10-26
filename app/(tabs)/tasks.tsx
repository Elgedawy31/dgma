import { memo, useState } from 'react'
import TaskCard from '@cards/TaskCard'
import { TaskColors } from '@/constants/Colors'
import { useThemeColor } from '@hooks/useThemeColor'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, Touchable, View } from 'react-native'

const headers = ['all', 'projects', 'assigned', 'personal']

const states = [
  { id: 'overdue', label: 'Overdue', },
  { id: 'progress', label: 'In Progress', },
  { id: 'review', label: 'In Review', },
  { id: 'completed', label: 'Completed', },
]

const tasks = [
  { id: 'overdue', title: 'Research Process', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
  { id: 'progress', title: 'Wirefiraming Design', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
  { id: 'review', title: 'Landing Page', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
  { id: 'completed', title: 'Research Process', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
  { id: 'completed', title: 'Wirefiraming Design', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
  { id: 'progress', title: 'Landing Page', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
  { id: 'review', title: 'Research Process', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
  { id: 'overdue', title: 'Wirefiraming Design', subTitle: 'Market research - User research ', time: '12 Aug-14 Aug' },
]
function Tasks() {
  const colors = useThemeColor();
  const [stateIndex, setStateIndex] = useState(-1)
  const [headerIndex, setHeaderIndex] = useState(0)

  const onStateChange = (index: number) => setStateIndex(index)

  const onHeaderChange = (index: number) => setHeaderIndex(index)

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'column', gap: 18, paddingVertical: 18 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', gap: 15 }}>
            {
              headers.map((header, index) => (
                <Pressable
                  key={index} onPress={() => onHeaderChange(index)}
                  style={[styles.header, { borderColor: colors.primary }, index === headerIndex && { backgroundColor: colors.primary }]}>
                  <Text style={[styles.headerTitle, { color: index === headerIndex ? colors.white : colors.primary }]}>{header}</Text>
                </Pressable>
              ))
            }
          </View>
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', gap: 15 }}>
            {
              states.map((state, index) => (
                <Pressable
                  key={index} onPress={() => onStateChange(index)}
                  style={[styles.headerState, index === stateIndex && { borderColor: TaskColors[state.id], borderBottomWidth: 1 }]}>
                  <Text style={{ textAlign: 'center', textTransform: 'capitalize', color: TaskColors[state.id] }}>{state.label}</Text>
                </Pressable>
              ))
            }
          </View>
        </ScrollView>
      </View >
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 0 }}>
        <FlatList
          keyExtractor={(item, index) => item.title + index}
          showsVerticalScrollIndicator={false}
          data={stateIndex < 0 ? tasks : tasks.filter(item => item.id === states[stateIndex].id)}
          renderItem={({ item }) => <TaskCard title={item.title} state={item.id} subTitle={item.subTitle} time={item.time} />}
        />
      </View>
    </View >
  )
}
export default memo(Tasks)

const styles = StyleSheet.create({
  header: {
    width: 100,
    padding: 8,
    borderWidth: 1,
    borderRadius: 16,
  },
  headerTitle: {
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  headerState: {
    width: 100,
    padding: 8,
  },
  headerStateActive: {},
})