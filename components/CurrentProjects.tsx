//#region Imports
import Text from '@blocks/Text';
import { Routes } from '@routes';
import { Link, router } from 'expo-router';
import ProjectCard from '@cards/ProjectCard'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Pressable } from 'react-native';
import { memo, useContext } from 'react';
import { userContext } from '@UserContext';
import { projectsContext } from '@ProjectsContext';
import Button from '@ui/Button';
import { useThemeColor } from '@hooks/useThemeColor';
//#endregion

function CurrentProjects() {
    const { user } = useContext(userContext)
    const { projects } = useContext(projectsContext);
    const colors = useThemeColor();
    return (
        <View>
            <View style={[styles.container, { paddingHorizontal: 16, }]}>
                <Text type='title' title='Current Projects' />
                {user?.role  === 'admin' ? <Ionicons name="add" size={32} color={colors.text} onPress={() => router.push(Routes.projectDetails)} />
                    : projects?.length ? <Button type='text' label='Show all' onPress={() => router.push(Routes.allProjects)} /> : null}
            </View>
            <View>
                {projects?.length > 0 ?
                    <ScrollView horizontal style={styles.scrolled}
                        showsHorizontalScrollIndicator={false}>
                        <View style={styles.cards}>
                            {projects.slice(0, projects.length > 3 ? 3 : projects?.length).map((proj) => (
                                <Link key={proj._id} href={{ pathname: '/project/[id]', params: { id: proj._id!, project: JSON.stringify(proj) } }}>
                                    <View style={{ paddingLeft: 16 }}>
                                        <ProjectCard project={proj} />
                                    </View>
                                </Link>
                            ))}
                        </View>
                        {projects?.length > 3 && user?.role  === 'admin' && <Pressable onPress={() => router.push(Routes.allProjects)} style={[styles.linkContainer, { backgroundColor: colors.body }]}>
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