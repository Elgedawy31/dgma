import { StyleSheet, View } from 'react-native'
import React, { memo, useCallback, useContext } from 'react'
import AppBar from '@blocks/AppBar'
import Text from '@blocks/Text'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import ImageAvatar from '@blocks/ImageAvatar'
import { userContext } from '@UserContext';
import { useForm } from 'react-hook-form'
import TextInputField from '@ui/TextInputField'
import Button from '@ui/Button'
import useAxios from '@hooks/useAxios'
import useSecureStorage from '@hooks/useSecureStorage'
import useStorage from '@hooks/useStorage'

function profile() {
    const { post } = useAxios()
    const { removeStorage: removeToken } = useSecureStorage();
    const { removeStorage } = useStorage();
    const { user, resetUser } = useContext(userContext);
    const { control, handleSubmit, formState: { errors }, } =
        useForm({ defaultValues: { name: `${user.name.first} ${user.name.last}`, gender: "Male", phone: "", birth: "4 - Novmber 1999" }, });

    const onLogoutPress = useCallback(async () => {
        await post({ endPoint: '/users/logout' })
            .then(async (res) => {
                console.log(res);
                await removeToken('token');
                await removeStorage('role');
                await removeStorage('name');
                resetUser();
                router.replace('/(auth)/');
            })
    }, [])
    return (
        <View style={{ flex: 1, }}>
            <AppBar center
                title={<Text type="subtitle" title="Profile" />}
                leading={<Ionicons name="chevron-back" size={24} color="black" onPress={() => { router.back() }} />}
                action={<Ionicons name="settings" size={24} color="black" onPress={() => { alert('Settings Page will coming soon') }} />}
            />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-between", width: '100%', padding: 16 }}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <ImageAvatar size={100} type='avatar' url={user.profilePicture} />
                    <View style={{ width: '100%' }}>
                        <TextInputField
                            capitalize
                            name="name"
                            label="Full Name"
                            control={control}
                            errorMessage={errors.name?.message}
                            rules={{ required: 'Name is required', }}
                        />
                        <TextInputField
                            name="gender"
                            label="Select Gender"
                            control={control}
                            errorMessage={errors.gender?.message}
                            rules={{ required: 'Gender is required', }}
                        />
                        <TextInputField
                            name="phone"
                            label="Phone Number"
                            control={control}
                            errorMessage={errors.phone?.message}
                            rules={{ required: 'Gender is required', }}
                        />
                        <TextInputField
                            name="birth"
                            label="Date of Birth"
                            control={control}
                            errorMessage={errors.birth?.message}
                            rules={{ required: 'Date of Birth is required', }}
                        />
                    </View>
                </View>
                <View>
                    <Button label="Logout" onPress={onLogoutPress} />
                </View>
            </View>
        </View>
    )
}
export default memo(profile)

const styles = StyleSheet.create({})