import { StyleSheet, View } from 'react-native'
import { memo, useMemo } from 'react'
import ImageAvatar from '@blocks/ImageAvatar'
import Text from '@blocks/Text'
import Icon from '@blocks/Icon'
import { styles } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList'
import { useThemeColor } from '@hooks/useThemeColor'
type MessageCardProps = {
    msg: string
    avatar: string
    receiver?: boolean
    isSameNextUser?: boolean
}

const MessageCard = ({ msg, receiver, avatar, isSameNextUser }: MessageCardProps) => {
    const colors = useThemeColor()
    const styles = useMemo(() => StyleSheet.create({
        container: { flex: 1, flexDirection: receiver ? 'row' : 'row-reverse', gap: 8, justifyContent: 'flex-start', alignItems: 'flex-end', marginVertical: 8 },
        bottom: { alignSelf: receiver ? 'flex-start' : 'flex-end', flexDirection: receiver ? 'row' : 'row-reverse', justifyContent: 'flex-start', gap: 12, alignItems: 'center' },
        content: { flex: 1, backgroundColor: receiver ? colors.receiver : colors.sender, paddingHorizontal: 16, paddingVertical: 8,minWidth: '28%', maxWidth: '95%', borderBottomLeftRadius: receiver ? 0 : 12, borderBottomRightRadius: receiver ? 12 : 0, borderTopStartRadius: 12, borderTopEndRadius: 12 },
    }), [])
    return (
        <View style={styles.container}>
            {isSameNextUser ? <View style={{ width: 40 }} /> : <ImageAvatar type='avatar' url={avatar} />}
            <View style={{ flex: 1, alignItems: receiver ? 'flex-start' : 'flex-end' }}>
                <View style={styles.content}>
                    <Text type='details' title={msg} />
                </View>
                <View style={styles.bottom}>
                    <Icon icon='seen' iconColor={colors.text} />
                    <Text type='label' title='6.02 PM' />
                </View>
            </View>
        </View>
    )
}

export default memo(MessageCard)