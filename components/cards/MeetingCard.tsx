//#region Imports
import { memo } from 'react'
import Text from '@blocks/Text'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { useThemeColor } from '@hooks/useThemeColor'
//#endregion

type TaskCardProps = {
    time: string,
    title: string,
    subTitle: string,
}

function MeetingCard({ time, title, subTitle, }: TaskCardProps) {
    const colors = useThemeColor()
    //#region UI
    return (
        <View style={[styles.container, { borderColor: colors.primary , backgroundColor:colors.card }]}>
            <Text type='body' title={title} />
            <Text type='label' title={subTitle} />
            <Text type='label' title={time} />
            {/* <Ionicons
                size={18} color="black"
                name="ellipsis-vertical"
                onPress={() => { alert("hello") }}
                style={{ position: 'absolute', right: 8, top: 10 }} /> */}
        </View >
    )
    //#endregion
}
export default memo(MeetingCard)

//#region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1, gap: 10, padding: 10,
        marginHorizontal: 10, marginBottom: 12,
     borderLeftWidth: 14, borderRadius: 10,
    },
})
//#endregion
