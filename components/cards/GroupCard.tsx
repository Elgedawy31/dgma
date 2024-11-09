import { Pressable, StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import ImageAvatar from '@blocks/ImageAvatar'
import Text from '@blocks/Text'
import {ChatModal} from '@model/user'
import { router } from 'expo-router'
type GroupCardProps = {
    group: ChatModal
    msgID: string
}

function GroupCard({ msgID, group: { photo,  name } }: GroupCardProps) {
    return (
        <Pressable onPress={() => router.push({ pathname: '/chat/[id]', params: { id: msgID, group: JSON.stringify({ group: { photo,  name } }) } })}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                <ImageAvatar size={50} type='avatar' url={photo} />
                <View style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E1E1E1' }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 8 }}>
                        <Text type='subtitle' title={name} />
                    </View>
                </View>
            </View>
        </Pressable>
    )  
}
export default memo(GroupCard)
const styles = StyleSheet.create({})

