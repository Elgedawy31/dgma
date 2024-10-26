import { ImageBackground, StyleSheet, View } from 'react-native'
import { memo, useState } from 'react'
import Text from '@blocks/Text'
import Icon from '@blocks/Icon'
import ImageAvatar from '@blocks/ImageAvatar'
import { useThemeColor } from '@hooks/useThemeColor'
type CallCardModel = {
    user: {
        avatar: string | null
        name: {
            first: string
            last: string
        },
    }
    // type: 'incoming' | 'outgoing'
}
const CallCard = ({ user: { avatar, name: { first, last } } }: CallCardModel) => {
    const colors = useThemeColor();
    const [mic, setMic] = useState(false)
    const [camera, setCamera] = useState(false)
    return (
        <View style={styles.container}>
            <ImageAvatar type='profile' url={avatar} />
            <View style={styles.content}>
                <Text type='subtitle' title={`${first} ${last}`} color={'white'} />
                <Icon type='complex' gap={1.7} icon={mic ? 'mic' : 'mic-off'} bgColor={mic?colors.primary:'#2d3644'} iconColor='white' onPress={() => setMic(!mic)} />
            </View>
        </View>
    )
}

export default memo(CallCard)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 16,
        marginBottom: 16,
        position: 'relative',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        width: '100%', paddingLeft: 8,
        justifyContent: 'space-between',
        borderRadius: 20, bottom: 0, paddingVertical: 0,
        backgroundColor: '',
    }
})