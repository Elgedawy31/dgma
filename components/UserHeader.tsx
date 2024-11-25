import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import ImageAvatar from "@blocks/ImageAvatar";

interface UserHeaderProps {
    logo: string;
    name: string;
}

export const UserHeader = ({ logo, name }: UserHeaderProps) => {
    return (
        <AppBar
            leading="back"
            title={
                <View style={styles.header}>
                    <ImageAvatar type="avatar" url={logo} size={50} />
                    <Text type="subtitle" title={name} />
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
});

export default UserHeader;
