import { Routes } from '@routes';
import { Link, router } from 'expo-router';
import AppBar from '@blocks/AppBar';
import { memo, useContext } from 'react'
import ProjectCard from '@cards/ProjectCard';
import { projectsContext } from '@ProjectsContext';
import { useThemeColor } from '@hooks/useThemeColor';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

function ShowAllProjects() {
  const colors = useThemeColor();
  const { projects } = useContext(projectsContext);
  return (

    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <AppBar dark title='Projects List' leading='back' />
      <View style={[styles.list, { backgroundColor: colors.background }]}>
        <FlatList numColumns={2} data={projects}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
          style={{ flex: 1 }}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 8 }}
          renderItem={({ item, index }) =>
            <Pressable key={item._id} style={{ flex: 1}}
              onPress={() => router.push({ pathname: Routes.project, params: { id: item._id!, project: JSON.stringify(item) } })}>
              <ProjectCard DateIcon={false} key={`${item._id} + ${index}`} project={item} />
            </Pressable>
          }
        />
      </View>
    </View >
  )
}
export default memo(ShowAllProjects)

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  list: { flex: 1, paddingHorizontal: 8, paddingTop: 16, borderTopEndRadius: 30, borderTopStartRadius: 30, }
})