import { memo, useContext } from 'react'
import Text from '@blocks/Text';
import { Routes } from '@routes';
import AppBar from '@blocks/AppBar';
import ProjectCard from '@cards/ProjectCard';
import { FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useThemeColor } from '@hooks/useThemeColor';
import { projectsContext } from '@ProjectsContext';

function ShowAllProjects() {
  const colors = useThemeColor();
  const { projects } = useContext(projectsContext);
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <AppBar dark title='Projects List' leading='back' />
      <View style={[styles.list, { backgroundColor: colors.background }]}>
        <FlatList numColumns={2} data={projects}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>
            <Link key={item._id} href={{ pathname: Routes.project, params: { id: item._id || '', project: JSON.stringify(item) } }}>
              <View style={{ padding: 8 }}>
                <ProjectCard DateIcon={false} key={`${item._id} + ${index}`} project={item} />
              </View>
            </Link>
          }
        />
      </View>
    </View>
  )
}
export default memo(ShowAllProjects)
const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  list: { paddingHorizontal: 8, paddingTop: 16, borderTopEndRadius: 30, borderTopStartRadius: 30, }
})