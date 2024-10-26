//#region Imports
import Text from '@blocks/Text';
import { memo, useCallback } from 'react';
import Auth from '@components/Auth';
import { router } from 'expo-router';
import { OTP } from '@components/OTP';
import Button  from '@ui/Button';
import { StyleSheet, View } from 'react-native'
//#endregion

function VerificationCode() {
    const onSubmit = useCallback(() => router.push('/(auth)/change-password'), []);

    //#region UI
    return (
        <Auth>
            <View style={styles.container}>
                <View style={styles.form}>
                    <View style={styles.header}>
                        <Text type='title' title='Verfication code' />
                        <Text type='body' title='Please enter code form email' />
                    </View>
                    <OTP />
                </View>
                <Button label="Submit" onPress={onSubmit} />
            </View>
        </Auth >
    )
    //#endregion
}
export default memo(VerificationCode);

//#region Styles
const styles = StyleSheet.create({
    form: { display: 'flex', gap: 18 },
    container: { flex: 1, justifyContent: 'space-between' },
    header: { width: '60%', display: "flex", alignSelf: 'flex-start', gap: 18 }
})
//#endregion
