import { memo } from 'react'
import Text from '@blocks/Text'
import MeetingCard from '@cards/MeetingCard'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { useThemeColor } from '@hooks/useThemeColor'

const meetings = [
    { title: 'UI/UX&Graphic Team meeting', subTitle: 'Market research - User research ', time: '1PM - 2PM' },
    { title: 'UI/UX&Graphic Team meeting', subTitle: 'Market research - User research ', time: '1PM - 2PM' },
    { title: 'UI/UX&Graphic Team meeting', subTitle: 'Market research - User research ', time: '1PM - 2PM' },
]

function UpcomingMeetings() {
    const colors = useThemeColor();
    return (
        <View>
            <View style={styles.container}>
                <Text type='title' title='Current Projects' />
                <Ionicons name="add" size={32} color="black" style={{ padding: 2, backgroundColor: colors.secondary, borderRadius: 50 }} />
            </View>
            {meetings.map((meeting, index) => (
                <MeetingCard
                    key={meeting.title + "meeting" + index}
                    time={meeting.time}
                    title={meeting.title}
                    subTitle={meeting.subTitle}
                />))
            }
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