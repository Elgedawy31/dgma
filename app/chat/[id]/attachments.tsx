import { Pressable, StyleSheet, View } from 'react-native'
import { memo, useState } from 'react'
import AppBar from '@blocks/AppBar'
import ImageAvatar from '@blocks/ImageAvatar'
import Text from '@blocks/Text'
import { useLocalSearchParams } from 'expo-router'
import Icon from '@blocks/Icon'
import { useThemeColor } from '@hooks/useThemeColor'
import IconModel from '@model/icon'

const attachmentsHeader = [
    { label: 'Photos', icon: 'image' },
    { label: 'Documents', icon: 'image' },
    { label: 'Links', icon: 'back' },]
const ChatAttachments = () => {
    const colors = useThemeColor();
    const [selectedHeader, setSelectedHeader] = useState(0);
    const { id, user } = useLocalSearchParams<{ id: string, user: string }>();
    const { user: { avatar, name: { first, last } } } = JSON.parse(user); return (
        <View style={{ flex: 1 }}>
            <AppBar
                leading='back'
                title={
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <ImageAvatar type='avatar' url={avatar} />
                        <Text type='subtitle' title={`${first} ${last}`} />
                    </View>
                }
            />
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                    {
                        attachmentsHeader.map((attachment, index) => (
                            <Pressable key={attachment.label} onPress={() => setSelectedHeader(index)} style={[styles.attachmentsHeader,
                            { backgroundColor: index === selectedHeader ? colors.primary : colors.white }]}>
                                <Icon disabledPress icon={attachment.icon as IconModel} iconColor={index === selectedHeader ? 'white' : colors.primary}  />
                                <Text type='subtitle' color={index === selectedHeader && 'white'} title={attachment.label} />
                            </Pressable>
                        ))
                    }
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text type='label' title={`${attachmentsHeader[selectedHeader].label} Page` }/>
                </View>

            </View>
        </View>
    )
}

export default memo(ChatAttachments)

const styles = StyleSheet.create({
    attachmentsHeader: {
        gap: 8,
        borderRadius: 20,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    }
})