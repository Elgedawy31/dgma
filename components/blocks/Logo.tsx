import { Image, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'

function Logo() {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Image source={require('@images/logo.png')} />
                <Text style={styles.title}>DEV<Text style={{ color: '#3FA9F5' }}>GLOBAL</Text></Text>
            </View>
            <Text style={{ color: '#FFF' }}>Management</Text>
        </View>
    )
}
export default memo(Logo)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    row: {
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#FFF',
        // fontfamily: Inter,
        fontSize: 32,
        fontStyle: 'normal',
        fontWeight: '400',
    },
})