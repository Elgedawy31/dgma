import { memo } from 'react'
import Text from '@blocks/Text'
import MeetingCard from '@cards/MeetingCard'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { useThemeColor } from '@hooks/useThemeColor'

const meetings: any = []

function UpcomingMeetings() {
    const colors = useThemeColor();
    return (
        <View>
            <View style={styles.container}>
                <Text type='title' title='Ongoing Meetings' />
                <Ionicons name="add" size={32} color={colors.text} style={{ padding: 2, backgroundColor: colors.secondary, borderRadius: 50 }} />
            </View>
            {meetings?.length > 0 ? meetings.map((meeting: any, index: number) => (
                <MeetingCard
                    time={meeting.time}
                    title={meeting.title}
                    subTitle={meeting.subTitle}
                    key={meeting.title + "meeting" + index}
                />))
                : <View style={{ marginVertical: 32, alignItems: 'center', justifyContent: 'center' }}>
                    <Text type='title' title='No Meetings Yet ' color={colors.body} />
                </View>}
        </View>
    )
}
export default memo(UpcomingMeetings)

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})