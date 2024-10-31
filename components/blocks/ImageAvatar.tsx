import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { router } from 'expo-router'

type ImageAvatarProps = {
    onPress?: () => void
    url: string | null
    type: 'avatar' | 'member' | 'project' | 'profile'
    size?: 50 | 60 | 70 | 80 | 90 | 100
}
function ImageAvatar({ onPress, url, type, size, }: ImageAvatarProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image style={[styles[type], size && { width: size, height: size, borderRadius: size / 2 }]}
                source={{
                    uri: url ||
                        (type === 'project' && 'https://th.bing.com/th/id/OIP.JRrDtLz53jNL0MAtrOWRHwHaEK?w=321&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7') ||
                        'https://cdn.dribbble.com/users/5534/screenshots/14230133/profile_4x.jpg'
                }}
            />
        </TouchableOpacity>
        // />
    )

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