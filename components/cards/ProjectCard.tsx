//#region Imports
import { memo } from 'react';
import Date from '@blocks/Date';
import Text from '@blocks/Text';
import useDate from '@hooks/useDate';
import ProjectModel from '@model/project';
import { Image, StyleSheet, View } from 'react-native'
//#endregion

type ProjectCardProps = {
    project: ProjectModel,
    DateIcon?: boolean
}

function ProjectCard({
    project: { logo, name, startDate, deadline, },
    DateIcon = true, }: ProjectCardProps) {
    const { shortDate } = useDate();
    //#region UI
    return (
        <View style={styles.container}>
            <Image source={{ uri: logo }}
                style={styles.image} resizeMode='stretch' />
            <View style={styles.conDetails}>
                <Text type='label' title={name} />
                <View style={styles.conBottom}>
                    <Date icon={DateIcon} type="start" date={shortDate(startDate)} size={16} />
                    <Date icon={DateIcon} type="end" date={shortDate(deadline)} size={16} />
                    <Text type='small' title='Members' />
                </View>
            </View>
        </View>
    )
    //#endregion
}
export default memo(ProjectCard)

//#region Styles
const styles = StyleSheet.create({
    container: {
        gap: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#E1E1E1'
    },
    conDetails: {
        gap: 8,
        display: 'flex',
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    conBottom: {
        gap: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    image: {
        height: 150,
        width: '100%',
        borderWidth: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
})
//#endregion