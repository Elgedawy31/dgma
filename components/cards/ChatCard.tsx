import { Pressable, StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import ImageAvatar from '@blocks/ImageAvatar'
import Text from '@blocks/Text'
import {UserModel} from '@model/user'
import { router } from 'expo-router'
type ChatCardProps = {
    user: UserModel
    msgID: string
}

function ChatCard({ msgID, user: { avatar,  name: { first, last } } }: ChatCardProps) {
    return (
        <Pressable onPress={() => router.push({ pathname: '/chat/[id]', params: { id: msgID, user: JSON.stringify({ user: { avatar, name: { first, last } } }) } })}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                <ImageAvatar size={50} type='avatar' url={avatar} />
                <View style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E1E1E1' }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 8 }}>
                        <Text type='subtitle' title={`${first} ${last}`} />
                    </View>
                </View>
            </View>
        </Pressable>
    )
}
export default memo(ChatCard)
const styles = StyleSheet.create({})

