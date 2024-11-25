import { StyleSheet, View } from 'react-native'
import React, { memo, ReactElement, useContext } from 'react'
import { useThemeColor } from '@hooks/useThemeColor'
import StatusBar from '@blocks/StatusBar'
import Icon from '@blocks/Icon'
import { router } from 'expo-router'
import ImageAvatar from '@blocks/ImageAvatar'
import { userContext } from '@UserContext';
import Text from '@blocks/Text'
import { ThemeContext } from '@ThemeContext'

type AppBarProps = {
    dark?: boolean,
    height?: number,
    center?: boolean,
    action?: ReactElement,
    title?: string | ReactElement,
    leading?: 'avatar' | 'back' | ReactElement,
}
const AppBar = ({ center = false, leading, title, action, dark, height = 50 }: AppBarProps) => {
    const { user } = useContext(userContext);
    const colors = useThemeColor();

    return (
        <View style={[
            styles.container,
            { minHeight: height, alignItems: 'center' },
            { backgroundColor: colors.card },
        ]}>
            <StatusBar dark={dark} />
            <View style={{ width: '100%', flex: 1, flexDirection: 'row', alignItems: center ? 'center' : 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', }}>
                    {/* /**Leading Icon | Profile-Image */}
                    <View style={{ backgroundColor: colors.card }}>
                        {typeof leading === 'object' && leading}
                        {leading === 'back' && <Icon icon='back' iconColor={colors.text} size={24} onPress={() => router.back()} />}
                        {leading === 'avatar' && <ImageAvatar type="avatar" url={user?.avatar} onPress={() => router.push('/profile')} />}
                    </View>
                    {/* /** Trailing Icon | Notification | Title */}
                    <View>
                        {leading === 'avatar' && <Text type='subtitle' color={dark ? 'white' : 'black'} title={title as string || `Welcome ${user?.name?.first}!`} />}
                        {typeof title === 'string' ? <Text type='subtitle' color={dark ? 'white' : 'black'} title={title} /> : title}
                    </View>
                </View>
                {/* /** Action Buttons */}
                <View>
                    {action}
                </View>
            </View>
        </View>
    )
}
export default memo(AppBar)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16, paddingVertical: 8,
        flexDirection: 'row', alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
})