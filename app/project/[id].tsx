import Text from '@blocks/Text'
import { Routes } from '@routes'
import AppBar from '@blocks/AppBar'
import { memo, useContext } from 'react'
import { ScrollView, View } from 'react-native'
import { useThemeColor } from '@hooks/useThemeColor'
import ProjectMembers from '@components/ProjectMembers'
import { router, useLocalSearchParams } from 'expo-router'
import ProjectDetailsCard from '@cards/ProjectDetailsCard'
import ProjectResources from '@components/ProjectResources'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { userContext } from '@UserContext';

function ProjectDetails() {
    const colors = useThemeColor();
    const { user: { role } } = useContext(userContext)
    const { project } = useLocalSearchParams<{ project: string }>();
    const { name, description, attachments, team } = JSON.parse(project);
    return (
        <View style={{ flex: 1, backgroundColor: colors.primary, gap: 16 }}>
            <AppBar dark title={name} leading='back'
                action={role === 'user' ? <View /> :
                    <MaterialIcons size={24} color="white" name="mode-edit-outline"
                        onPress={() => router.push({ pathname: Routes.projectDetails, params: { project: project } })}
                    />
                }
            />
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, borderTopEndRadius: 30, borderTopStartRadius: 30, backgroundColor: colors.background }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ProjectDetailsCard {...JSON.parse(project)} />
                    <View style={{ paddingVertical: 8, gap: 8 }}>
                        <Text type="body" align='justify' size={14} title={description} />
                    </View>
                    <ProjectResources data={attachments} />
                    {/* <ProjectLinks data={links} /> */}
                    {/* <ProjectTasks data={tasks} /> */}
                    <ProjectMembers data={team} />

                </ScrollView>
            </View>
        </View>
    )
}
export default memo(ProjectDetails)