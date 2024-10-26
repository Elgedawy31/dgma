//#region Imports
import Text from '@blocks/Text'
import Auth from '@components/Auth'
import { memo, useCallback } from 'react'
import { router } from 'expo-router'
import Button  from '@ui/Button'
import { StyleSheet, View } from 'react-native'
import { PasswordInputField } from '@ui/TextInputField'
//#endregion

function ChangePassword() {
    const onSubmit = useCallback(() => router.push('/(tabs)/'), []);
    //#region UI
    return (
        <Auth>
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text type='title' title='New Password' />

                    <PasswordInputField label="Enter New Password" onChangeText={(password) => { console.log(password); }} />

                    <PasswordInputField label="Confirm Password" onChangeText={(password) => { console.log(password); }} />
                </View>
                <Button label="Confirm" onPress={onSubmit} />
            </View>
        </Auth>
    )
    //#endregion
}
export default memo(ChangePassword);
const styles = StyleSheet.create({
    form: { display: 'flex', gap: 18 },
    container: { flex: 1, justifyContent: 'space-between' },
});