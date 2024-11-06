import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { router } from 'expo-router'

type ImageAvatarProps = {
    onPress?: () => void
    url: string | null
    type: 'avatar' | 'member' | 'project' | 'profile'
    size?: 50 | 60 | 70 | 80 | 90 | 100
}
function ImageAvatar({ onPress, url, type, size, }: ImageAvatarProps) {
    return onPress ? <Pressable onPress={onPress}>
        <Image style={[styles[type], size && { width: size, height: size, borderRadius: size / 2 }]}
            source={!url && type === 'project' ? require('@images/select.png') :
                { uri: url || 'https://cdn.dribbble.com/users/5534/screenshots/14230133/profile_4x.jpg' }}
        />
    </Pressable>
        :
        <Image style={[styles[type], size && { width: size, height: size, borderRadius: size / 2 }]}
            source={!url && type === 'project' ? require('@images/select.png') :
                { uri: url || 'https://cdn.dribbble.com/users/5534/screenshots/14230133/profile_4x.jpg' }}
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
    profile: { height: 150, borderRadius: 12, },
    project: { width: '100%', height: 200, }
})