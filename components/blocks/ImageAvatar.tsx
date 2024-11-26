import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { router } from 'expo-router'

type ImageAvatarProps = {
    onPress?: () => void
    url: string | null | undefined
    type: 'avatar' | 'member' | 'project' | 'profile' | 'channel' | 'homeProject'
    size?: 50 | 60 | 70 | 80 | 90 | 100
}
function ImageAvatar({ onPress, url, type, size,  }: ImageAvatarProps) {
    return onPress ? <Pressable onPress={onPress}>
        <Image  style={[styles[type], size && { width: size, height: size, borderRadius: size / 2 }]}
            source={url && { uri: url } ||
                ((type === 'project' || type ==='homeProject') ?
                    require('@images/select.png')
                    : require('@images/user.png')
                )}
        />
    </Pressable>
        :
        <Image style={[styles[type], size && { width: size, height: size, borderRadius: size / 2 }]}
            source={url && { uri: url } ||
            ((type === 'project' || type ==='homeProject') ?
                    require('@images/select.png')
                    : type === 'channel' ? require('@images/groups-no-img.png') : require('@images/user.png')
                )}
        />
}

export default memo(ImageAvatar)
const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        aspectRatio: 1,
        borderRadius: 20,
    },
    member: {
        width: 20,
        height: 20,
        aspectRatio: 1,
        borderRadius: 10,
    },
    channel: {
        width: 60,
        height: 60,
        aspectRatio: 1,
        borderRadius: 30,
    },
    profile: { height: 150, borderRadius: 12, },
    project: { width: '100%', height: 200, } ,
    homeProject:{width:180 , height:150}
})