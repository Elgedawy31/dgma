//#region Imports
import Text from '@blocks/Text'
import Auth from '@components/Auth'
import { memo, useCallback } from 'react'
import { router } from 'expo-router'
import Button  from '@ui/Button'
import TextInputField from '@ui/TextInputField'
import { StyleSheet, View } from 'react-native'
import { useForm } from 'react-hook-form'
//#endregion

function ForgetPassword() {
    const { control, handleSubmit, formState: { errors }, } =
        useForm<{ email: string }>({ defaultValues: { email: "" } });

    const onSubmit = handleSubmit((data: { email: string }) => {
        router.push('/(auth)/verification-code')
    });
    //#region UI
    return (
        <Auth>
            <View style={styles.container}>
                <View style={styles.form}>
                    <View style={styles.header}>
                        <Text type='title' title='Forget Password' />
                        <Text type='body' title='Enter your email adderss to reset password.' />
                    </View>
                    <TextInputField
                        name="email"
                        type="email"
                        label="Email"
                        control={control}
                        errorMessage={errors.email?.message}
                        rules={{ required: 'Email is required', }}
                    />
                </View>
            </View>
            <Button label="Reset Password" onPress={onSubmit} />
        </Auth >
    );
    //#endregion
}
export default memo(ForgetPassword);

//#region Styles
const styles = StyleSheet.create({
    form: { display: 'flex', gap: 12 },
    container: { flex: 1, justifyContent: 'space-between' },
    header: { width: '60%', display: "flex", alignSelf: 'flex-start', gap: 10 }
})
//#endregion