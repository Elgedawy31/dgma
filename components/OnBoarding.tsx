import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import Logo from './blocks/Logo'

function OnBoarding(top: any, bottom: any) {
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                {top}
            </View>
            <View style={styles.bottom}>
                {bottom}
            </View>
        </View>
    )
}
export default memo(OnBoarding)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    head: {
        flex: 2,
        alignItems: 'stretch',
        backgroundColor: '#002D75',
    },
    bottom: {
        flex: 3,
    }
})