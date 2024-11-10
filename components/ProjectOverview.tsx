//#region Imports
import Text from '@blocks/Text';
import PieChart from 'react-native-pie-chart';
import { TaskColors } from '@/constants/Colors';
import { projectsContext } from '@ProjectsContext';
import { useThemeColor } from '@hooks/useThemeColor';
import { Pressable, StyleSheet, View } from 'react-native';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
//#endregion
type ProjectStatusModel = {
    id: string;
    label: string;
    value: number;
    color: string;
}
function ProjectOverview() {
    const colors = useThemeColor();
    const { projects } = useContext(projectsContext);
    const [projectsStatus, setProjectsStatus] = useState<ProjectStatusModel[]>([]);
    const [statusPercent, setStatusPercent] = useState<number>(0);
    const adjustProjectsStatus = useCallback(() => {
        const res = [
            // { id: 'overdue', label: 'Overdue', value: 0, color: TaskColors.overdue },
            { id: 'review', label: 'In Review', value: 0, color: TaskColors.review },
            { id: 'pending', label: 'Pending', value: 0, color: TaskColors.pending },
            { id: 'progress', label: 'In Progress', value: 0, color: TaskColors.progress },
            { id: 'completed', label: 'Completed', value: 0, color: TaskColors.completed },
            // { id: 'cancelled ', label: 'Cancelled ', value: 0, color: TaskColors.cancelled },
        ]
        projects?.forEach((project) => {
            switch (project.status) {
                case 'In Review': res[0].value += 1; break;
                // case 'overdue': res[0].value += 1; break;
                case 'Pending': res[1].value += 1; break;
                case 'In Progress': res[2].value += 1; break;
                case 'Completed': res[3].value += 1; break;
                // case 'cancelled': res[5].value += 1; break;
            }
        })
        setProjectsStatus([...res]);
    }, [])

    useEffect(() => adjustProjectsStatus(), [])
    //#region UI
    return (
        <View style={{ backgroundColor: colors.card, padding: 8, borderRadius: 10 }}>
            <View style={{ gap: 3 }}>
                <Text type='title' title='Projects Overview' />
                <Text type='body' title='View your projects overall progress bades on the statuses in your workflow' />
            </View>
            {projectsStatus.length > 0 &&
                <View style={styles.container}>
                    <View style={{ position: 'relative' }}>
                        <PieChart
                            coverRadius={0.6}
                            widthAndHeight={175}
                            series={projectsStatus.map((item) => item.value)}
                            sliceColor={projectsStatus.map((item) => item.color)}
                        />
                        <View style={styles.conChartContent}>
                            <Text type='label' size={20} color={projectsStatus[statusPercent].color}
                                title={((projectsStatus[statusPercent].value / projectsStatus.reduce((a, b) => a + b.value, 0)) * 100).toFixed(2) + '%'} />
                            <Text type='label' title={projectsStatus[statusPercent].label} />
                        </View>
                    </View>
                    <View style={[styles.conChartText]}>
                        {
                            projectsStatus.filter(item => item.value > 0).map((item, index) => (
                                <Pressable key={item.label} style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }} onPress={() => setStatusPercent(index)}>
                                    <View style={{ width: 16, aspectRatio: 1, backgroundColor: item.color, borderRadius: 4 }} />
                                    <Text type='label' title={item.label} />
                                </Pressable>
                            ))
                        }
                    </View>

                    <View style={styles.conChartText}>
                        {projectsStatus.filter(item => item.value > 0).map(item => (<Text type='label' key={item.label} title={item.value + ""} />))}
                    </View>
                </View>
            }
        </View >
    )
    //#endregion
}
export default memo(ProjectOverview);

//#region Styles
const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    conChartContent: {
        top: 0, bottom: 0,
        left: 0, right: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    conChartText: {
        gap: 8,
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
})
//#endregion
