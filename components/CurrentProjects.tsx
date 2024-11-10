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
import Button  from '@ui/Button';
//#endregion

function CurrentProjects() {
    const { user: { role } } = useContext(userContext)
    const { projects } = useContext(projectsContext);
    // console.log(projects);
    //#region UI
    return (
        <View>
            <View style={[styles.container, { paddingHorizontal: 16, }]}>
                <Text type='title' title='Current Projects' />
                {role === 'admin' ? <Ionicons name="add" size={32} color="black" onPress={() => router.push(Routes.projectDetails)} />
                    : <Button type='text' label='Show all' onPress={() => router.push(Routes.allProjects)} />}
            </View>
            <View>
                <ScrollView horizontal style={styles.scrolled}
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.cards}>
                        {projects?.slice(0, projects.length > 3 ? 3 : projects.length).map((proj) => (
                            <Link key={proj._id} href={{ pathname: '/project/[id]', params: { id: proj._id!, project: JSON.stringify(proj) } }}>
                                <View style={{ paddingLeft: 16 }}>
                                    <ProjectCard project={proj} />
                                </View>
                            </Link>
                        ))}
                    </View>
                    {role === 'admin' && <Pressable onPress={() => router.push(Routes.allProjects)} style={styles.linkContainer}>
                        <Text type='label' title='Show all' color='white' />
                    </Pressable>}
                </ScrollView>
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
        backgroundColor: 'gray',
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopEndRadius: 32,
        borderBottomEndRadius: 32,

    },
})
//#endregion