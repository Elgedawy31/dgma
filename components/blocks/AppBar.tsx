import { StyleSheet, View } from 'react-native'
import React, { memo, ReactElement, useContext } from 'react'
import { useThemeColor } from '@hooks/useThemeColor'
import StatusBar from '@blocks/StatusBar'
import Icon from '@blocks/Icon'
import { router } from 'expo-router'
import ImageAvatar from '@blocks/ImageAvatar'
import { userContext } from '@UserContext';
import Text from '@blocks/Text'

type AppBarProps = {
    dark?: boolean,
    height?: number,
    center?: boolean,
    action?: ReactElement,
    title?: string | ReactElement,
    leading?: 'avatar' | 'back' | ReactElement,
}
// 'calendar' | 'search' | 'chat' | 'settings' | 'more' | 'edit' |
function AppBar({ center = false, leading, title, action, dark, height = 1 }: AppBarProps) {
    const { user: { profilePicture, role, name: { first } } } = useContext(userContext);
    const colors = useThemeColor();
    console.log("AppBar");
    return (
        <View style={[
            styles.container,
            { minHeight: height },
            { backgroundColor: dark ? colors.primary : colors.white },
        ]}>
            <StatusBar dark={dark} />
            {/* Leading && Trailing */}
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                {/* /**Leading Icon | Profile-Image */}
                <View>
                    {typeof leading === 'object' && leading}
                    {leading === 'back' && <Icon icon='back' iconColor={dark ? 'white' : 'black'} size={24} onPress={() => router.back()} />}
                    {leading === 'avatar' && <ImageAvatar type="avatar" url={profilePicture} href='/profile' />}
                </View>
                {/* /** Trailing Icon | Notification | Title */}
                <View>
                    {typeof title === 'object' && title}
                    {leading === 'avatar' && <Text type='subtitle' color={dark ? 'white' : 'black'} title={title as string || `Welcome ${role === 'admin' ? "Admin" : first}!`} />}
                </View>
            </View>
            {/* /** Action Buttons */}
            <View>
                {action}
            </View>
        </View>
    )
}
export default memo(AppBar)

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16, paddingVertical: 8,
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', //backgroundColor: 'red'
    },
})