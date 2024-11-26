//#region Imports
import Text from '@blocks/Text';
import { Routes } from '@routes';
import { Link, router } from 'expo-router';
import ProjectCard from '@cards/ProjectCard'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Pressable } from 'react-native';
import { memo, useCallback, useContext } from 'react';
import { userContext } from '@UserContext';
import { projectsContext } from '@ProjectsContext';
import Button from '@ui/Button';
import { useThemeColor } from '@hooks/useThemeColor';
import ProjectModel from '@model/project';
import { activeProjectContext } from '@context/ActiveProjectContextProvider';
//#endregion

function CurrentProjects() {
    const { user } = useContext(userContext)
    const { projects } = useContext(projectsContext);
    const { setProject: setActiveProject } = useContext(activeProjectContext);
    const colors = useThemeColor();
    const handleClick = useCallback((proj: ProjectModel) => {
        setActiveProject(proj);
        router.push('/project/preview');
    }, [])
    console.log('projects' , projects)
    return (
        <View>
            <View style={[styles.container, { paddingHorizontal: 16, }]}>
                <Text type='title' title='Current Projects' />
                {user?.role === 'admin' ? <Ionicons name="add" size={32} color={colors.text} onPress={() => router.push({ pathname: Routes.projectDetails, params: { type: 'new' } })} />
                    : projects?.length ? <Button type='text' label='Show all' onPress={() => router.push(Routes.allProjects)} /> : null}
            </View>
            <View>
                {projects?.length > 0 ?
                    <ScrollView horizontal style={styles.scrolled}
                        showsHorizontalScrollIndicator={false}>
                        <View style={styles.cards}>
                            {projects.slice(0, projects.length > 3 ? 3 : projects?.length).map((proj) => (
                                <Pressable key={proj._id} onPress={() => handleClick(proj)}>
                                    <View style={{ paddingLeft: 16 }}>
                                        <ProjectCard project={proj} />
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                        {projects?.length > 1 && user?.role === 'admin' && <Pressable onPress={() => router.push(Routes.allProjects)} style={[styles.linkContainer, { backgroundColor: colors.body }]}>
                            <Text type='label' title='Show all' color='white' />
                        </Pressable>}
                    </ScrollView> :
                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <Text type='error' title='No projects found' />
                    </View>
                }
            </View>
        </View>
    )
    //#endregion
}
export default memo(CurrentProjects)

//#region Styles
const styles = StyleSheet.create({
    scrolled: { marginTop: 8 },
    cards: { flexDirection: 'row', },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    linkContainer: {
        marginHorizontal: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopEndRadius: 32,
        borderBottomEndRadius: 32,

    },
})
//#endregion