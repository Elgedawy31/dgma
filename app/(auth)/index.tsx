import React, { memo, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from "react-hook-form";
import { router } from 'expo-router';
import Text from '@blocks/Text';
import Auth from '@components/Auth';
import { useThemeColor } from '@hooks/useThemeColor';
import Button from '@ui/Button';
import TextInputField from '@ui/TextInputField';
import useStorage from '@hooks/useStorage';
import useAxios from '@hooks/useAxios';
import axios from 'axios';
import Constants from 'expo-constants';
import { userContext } from '@UserContext';

type LoginModel = {
    email: string;
    password: string;
}

function Login() {
    const { setUserData, user } = useContext(userContext);
    const { post } = useAxios();
    const { control, handleSubmit, formState: { errors }, } =
        useForm<LoginModel>({ defaultValues: { email: "", password: "", }, });


    const onSubmit = handleSubmit(async (data: LoginModel) => {
        console.log(data);
        await post({ endPoint: 'users/login', body: data, hasToken: false })
            .then((res) => {
                console.log("token", res["token"]);
                if (res["token"]) {
                    setUserData(res["token"], res["user"]);
                    router.replace('/(tabs)/');
                }
            })
            .catch((err) => { console.error(`Error: ${err}`); })
    });


    const onForgetPassword = () => {
        console.log("Forget Password");
        router.push('/forget-password');
    };

    return (
        <Auth>
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text type='title' title='Welcome Back.' />
                    <View style={styles.header}>
                        <TextInputField
                            name="email"
                            type="email"
                            label="Email"
                            control={control}
                            errorMessage={errors.email?.message}
                            rules={{ required: 'Email is required', }}
                        />
                        <TextInputField
                            name="password"
                            type="password"
                            label="Password"
                            control={control}
                            errorMessage={errors.password?.message}
                            rules={{ required: 'Password is required' }}
                        />
                    </View>
                    <Button type='text' align='flex-end' label="Forgot Password" onPress={onForgetPassword} />
                </View>
                <Button label="Login" onPress={onSubmit} />
            </View>
        </Auth>
    );
}
export default memo(Login);

const styles = StyleSheet.create({
    form: { flex: 1, gap: 8 },
    header: { display: 'flex', gap: 28 },
    container: { flex: 1, justifyContent: 'space-between' },
});