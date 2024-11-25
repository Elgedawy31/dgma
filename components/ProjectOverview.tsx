//#region Imports
import Text from '@blocks/Text';
import { TaskColors } from '../constants/Colors';
import { projectsContext } from '@ProjectsContext';
import { useThemeColor } from '@hooks/useThemeColor';
import { Pressable, StyleSheet, View } from 'react-native';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import DonutChart from './DonutChart';
import { ChartDataItem } from '../models/donutChart';
//#endregion

type TextType = 'title' | 'body' | 'label' | 'error';

type ProjectStatusModel = {
    id: string;
    label: string;
    value: number;
    color: string;
}

function ProjectOverview() {
    const colors = useThemeColor();
    const { projects, loading } = useContext(projectsContext);
    const [statusPercent, setStatusPercent] = useState<number>(0);
    const [projectsStatus, setProjectsStatus] = useState<ProjectStatusModel[]>([]);

    const adjustProjectsStatus = useMemo(() => {
        const statusMap: Record<string, number> = { 'In Review': 0, 'Pending': 1, 'In Progress': 2, 'Completed': 3, 'Overdue': 4 };
        const initialStatus = [
            { id: 'In Review', label: 'In Review', value: 0, color: TaskColors.review },
            { id: 'Pending', label: 'Pending', value: 0, color: TaskColors.pending },
            { id: 'In Progress', label: 'In Progress', value: 0, color: TaskColors.progress },
            { id: 'Completed', label: 'Completed', value: 0, color: TaskColors.completed },
            { id: 'Overdue', label: 'Overdue', value: 0, color: TaskColors.overdue },
        ];

        if (!projects || !Array.isArray(projects)) {
            return initialStatus;
        }

        return projects.reduce((acc, project) => {
            if (project && project.status && statusMap[project.status] !== undefined) {
                acc[statusMap[project.status]].value += 1;
            }
            return acc;
        }, initialStatus).sort((a, b) => b.value - a.value);
    }, [projects]);

    const chartData: ChartDataItem[] = useMemo(() => {
        return projectsStatus.map(status => ({
            status: status.label as any,
            value: status.value
        }));
    }, [projectsStatus]);

    const calcTotalStatus = useMemo(() => {
        if (!Array.isArray(projectsStatus) || projectsStatus.length === 0) return 0;
        return projectsStatus.reduce((a, b) => a + b.value, 0);
    }, [projectsStatus]);

    const calcCurrentStatus = useMemo(() => {
        if (!Array.isArray(projectsStatus) || 
            projectsStatus.length === 0 || 
            statusPercent >= projectsStatus.length || 
            statusPercent < 0) {
            return 0;
        }
        const temp = projectsStatus[statusPercent].value / calcTotalStatus;
        return temp ? (temp * 100).toFixed(2) : 0;
    }, [projectsStatus, statusPercent, calcTotalStatus]);

    useEffect(() => {
        setProjectsStatus(adjustProjectsStatus);
    }, [adjustProjectsStatus]);

    return (
        <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
            <View style={styles.headerContainer}>
                <Text type='title' title='Projects Overview' />
                <Text type='body' title='View your projects overall progress based on the statuses in your workflow' />
            </View>

            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text type='body' title='Loading projects...' />
                </View>
            ) : !Array.isArray(projects) || projects.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text type='body' title='No projects available' />
                    <Text type='label' title='Create a project to see the overview' />
                </View>
            ) : projectsStatus.length > 0 && (
                <View style={styles.container}>
                    <View style={styles.chartContainer}>
                        <DonutChart 
                            data={chartData}
                            size={175}
                            strokeWidth={35}
                            centerLabelSize={24}
                            centerSubLabelSize={14}
                        />
                    </View>

                    <View style={styles.conChartText}>
                        {projectsStatus.map((item, index) => (
                            <Pressable 
                                key={item.id} 
                                style={styles.statusItem} 
                                onPress={() => setStatusPercent(index)}
                            >
                                <View style={styles.statusLabel}>
                                    <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                                    <Text type='label' title={item.label} />
                                </View>
                                <Text type='label' title={item.value.toString()} />
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
    //#endregion
}

//#region Styles
const styles = StyleSheet.create({
    cardContainer: {
        padding: 8,
        borderRadius: 10
    },
    headerContainer: {
        gap: 3
    },
    container: {
        gap: 16,
        marginTop: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    chartContainer: {
        position: 'relative'
    },
    conChartContent: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    conChartText: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    statusItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusLabel: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    colorIndicator: {
        width: 16,
        aspectRatio: 1,
        borderRadius: 4
    },
    emptyContainer: {
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    }
});
//#endregion

export default memo(ProjectOverview);
