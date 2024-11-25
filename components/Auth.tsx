import React, { memo } from 'react'
import Logo from './blocks/Logo'
import StatusBar from '@blocks/StatusBar';
import { StyleSheet, View } from 'react-native'
import { useThemeColor } from '@hooks/useThemeColor';

function Auth({ children }: any) {
    const colors = useThemeColor();

    return (
        <View style={[styles.container, { backgroundColor: colors.authTop }]}>
            <StatusBar hidden />
            <View style={[styles.head, { backgroundColor: colors.background }]}>
                <View style={[styles.headContent, { backgroundColor: colors.authTop }]}>
                    <Logo />
                </View>
            </View>
            <View style={[styles.form, { backgroundColor: colors.background }]}>
                {children}
            </View>
        </View>
    )
}
export default memo(Auth)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',

    },
    head: {
        flex: 1,
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'stretch',
    },

    headContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 120,
    },
    form: {
        flex: 2,
        gap: 12,
        fontSize: 30,
        fontWeight: 'bold',
        paddingVertical: 48,
        alignItems: 'stretch',
        paddingHorizontal: 16,
        borderTopRightRadius: 120,
    },
})