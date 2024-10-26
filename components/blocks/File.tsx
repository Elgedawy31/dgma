import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import Text from '@blocks/Text';
import { useThemeColor } from '@hooks/useThemeColor';

type FileProps = {
    title?: string,
    size?: number,
    color?: string,
    fileSize?: number,
    type?: 'pdf' | 'image' | 'file',
    measure?: 'GB' | 'MB' | 'KB' | 'B',
}

function File({ type = 'file', size, color, title, fileSize, measure = 'MB' }: FileProps) {
    const colors = useThemeColor();
    const iconMap = {
        file: 'file',
        pdf: 'file-pdf-o',
        image: 'file-image-o',
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <FontAwesome name={iconMap[type] || 'file'} size={size || 24} color={color || colors.primary} />
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', }}>
                    <Text type='subtitle' title={title || 'File'} />
                    <Text type='small' title={fileSize + ' ' + measure} />
                </View>
            </View>
            <Feather name="download" size={24} color="black" />
        </View>)
}

export default memo(File)
const styles = StyleSheet.create({
    container:
    {
        gap: 4,
        paddingVertical: 8,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#E1E1E1',
        justifyContent: 'space-between',
    },
    content: {
        gap: 8,
        alignItems: 'center',
        flexDirection: 'row',
    }
});