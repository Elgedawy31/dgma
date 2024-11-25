import { Routes } from '@routes';
import { Link, router } from 'expo-router';
import AppBar from '@blocks/AppBar';
import { memo, useCallback, useContext } from 'react'
import ProjectCard from '@cards/ProjectCard';
import { projectsContext } from '@ProjectsContext';
import { useThemeColor } from '@hooks/useThemeColor';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { activeProjectContext } from '@context/ActiveProjectContextProvider';
import ProjectModel from '@model/project';

function ShowAllProjects() {
  const colors = useThemeColor();
  const { projects } = useContext(projectsContext);
  const { setProject: setActiveProject } = useContext(activeProjectContext);

  const handleClick = useCallback((proj: ProjectModel) => {
    setActiveProject(proj);
    router.push('/project/preview');
  }, [])
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppBar dark title='Projects List' leading='back' />
      <View style={styles.list}>
        <FlatList numColumns={2} data={projects}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ gap: 16 }}
          style={{ flex: 1 }}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 8 }}
          renderItem={({ item, index }) =>
            <Pressable key={item._id} style={{ flex: 1 }}
              onPress={() => handleClick(item)}>
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
  list: { flex: 1, paddingHorizontal: 8 }
})