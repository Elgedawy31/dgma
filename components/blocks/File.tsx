import Text from '@blocks/Text';
import Icon from '@blocks/Icon';
import IconModel from '@model/icon';
import FileModel from '@model/file';
import { StyleSheet, View } from 'react-native';
import React, { memo, ReactNode, useCallback, useMemo } from 'react'
import { useThemeColor } from '@hooks/useThemeColor';

type FileProps = {
    src: FileModel,
    onPress?: () => void;
    type: 'view' | 'attachment'
}

function File({ src: { name, uri, size, mimeType, measure }, type, onPress }: FileProps) {
    const colors = useThemeColor();

    const styles = useMemo(() => StyleSheet.create({
        viewContainer: {
            gap: 4,
            paddingVertical: 8,
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#E1E1E1',
            justifyContent: 'space-between',
        },
        viewContent: {
            gap: 8,
            alignItems: 'center',
            flexDirection: 'row',
        },
        attachmentContainer: {
            gap: 4,
            borderRadius: 8,
            borderWidth: 1,
            paddingVertical: 6,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: colors.primary,
            justifyContent: 'space-between',
        },
        attachmentContent: {
            gap: 8,
            alignItems: 'center',
            flexDirection: 'row',
        }

    }), [colors]);

    const iconMapping = useCallback(() => {
        return mimeType.includes('pdf') ? 'file-pdf'
            : mimeType.includes('image') ?
                'file-image'
                : 'file';
    }, []);

    return (
        <View style={styles[`${type}Container`]} >
            <View style={styles[`${type}Content`]}>
                <Icon icon={iconMapping() as IconModel} size={24} iconColor={colors.primary} />
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Text bold={type === 'attachment'} color={colors.text} type='details' title={name.slice(0, 50)} />
                    <Text bold={type === 'attachment'} color={colors.body} type='small' title={`${size} ${measure}`} />
                </View>
            </View>
            {onPress && <Icon onPress={onPress}
                icon={type === 'view' ? 'download' : 'delete'}
                iconColor={type === 'view' ? colors.primary : colors.cancel}
            />
            }
        </View >
    );
}

export default memo(File);