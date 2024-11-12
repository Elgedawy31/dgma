import Text from '@blocks/Text'
import ChatModal from '@model/chat'
import { router } from 'expo-router'
import useSocket from '@hooks/useSocket'
import ImageAvatar from '@blocks/ImageAvatar'
import React, { memo, useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

function ChatCard({ id, name, logo, type }: ChatModal) {
    const socket = useSocket()

    const onPress = useCallback(() => {
        socket?.emit("joinConversation", {
            conversationType: type,
            conversationId: id
        });
        console.log("Joining conversation", id);
        console.log("chat", JSON.stringify({ id, name, logo, type }));
        router.push({
            pathname: '/chat/[id]',
            params: { id, chat: JSON.stringify({ logo, name, type, id }) }
        })
    }, [socket]);

    return (
        <Pressable onPress={onPress}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                <ImageAvatar size={50} type='avatar' url={logo} />
                <View style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E1E1E1' }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 8 }}>
                        <Text type='subtitle' title={name} />
                    </View>
                </View>
            </View>
        </Pressable>
    )
}
export default memo(ChatCard)
const styles = StyleSheet.create({})

