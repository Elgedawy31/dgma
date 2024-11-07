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

function File({ src, type, onPress }: FileProps) {
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

    const file = useCallback(() => {
        const type = src.mimeType;
        const fileName: string = src.name;
        const sizeInBytes = src.size || 0;

        let icon: IconModel;
        if (type.includes('image')) {
            icon = 'file-image';
        } else if (type.includes('pdf')) {
            icon = 'file-pdf';
        } else {
            icon = 'file';
        }

        const sizeUnits = ['B', 'KB', 'MB', 'GB'];
        let size = sizeInBytes;
        let measure = 'B';

        for (let i = 0; i < sizeUnits.length; i++) {
            if (size < 1024) {
                measure = sizeUnits[i];
                break;
            }
            size /= 1024;
        }

        return {
            icon,
            measure,
            size: size.toFixed(2),
            title: fileName.slice(0, 20),
        };
    }, [src]);

    return (
        <View style={styles[`${type}Container`]}>
            <View style={styles[`${type}Content`]}>
                <Icon icon={file().icon} size={24} iconColor={colors.primary} />
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Text bold color={colors.text} type='details' title={file().title} />
                    <Text bold color={colors.body} type='small' title={`${file().size} ${file().measure}`} />
                </View>
            </View>
            {onPress && <Icon icon='delete' iconColor={type === 'view' ? colors.primary : colors.cancel} onPress={onPress} />}
        </View>
    );
}

export default memo(File);