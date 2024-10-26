import { memo } from 'react';
import Date from '@blocks/Date';
import Text from '@blocks/Text';
import Container from '@container';
import useDate from '@hooks/useDate';
import { Image, View } from 'react-native'
import ProgressBar from '@blocks/ProgressBar';
import { useThemeColor } from '@hooks/useThemeColor';

type ProjectDetailsCardProps = {
    logo: string
    deadline: string
    startDate: string
    progress: number
}

function ProjectDetailsCard({ logo, startDate, deadline, progress }: ProjectDetailsCardProps) {
    const colors = useThemeColor();
    const { shortDate } = useDate();
    return (
        <Container radius={10} style={{ padding: 8 }}>
            <Image source={{ uri: logo }} resizeMode='stretch' style={{ width: '100%', height: 200, borderRadius: 10 }} />
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 8, paddingVertical: 5, justifyContent: 'space-between', alignItems: 'center' }}>
                <ProgressBar progress={progress/100} />
                <Text type="label" color='#002D75' title={`${progress}%`} />
            </View>
            <View style={{ width: '100%', flexDirection: 'row', gap: 8, paddingHorizontal: 8, paddingVertical: 4, justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 8, alignItems: 'center' }}>
                <Date type="start" date={shortDate(startDate)} size={24} />
                <Date type="end" date={shortDate(deadline)} size={24} />
            </View>
        </Container>
    )
}
export default memo(ProjectDetailsCard)