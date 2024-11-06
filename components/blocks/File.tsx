import Text from '@blocks/Text';
import Icon from '@blocks/Icon';
import IconModel from '@model/icon';
import FileModel from '@model/file';
import { StyleSheet, View } from 'react-native';
import React, { memo, ReactNode, useCallback } from 'react'

type FileProps = {
    src: FileModel,
    color?: string,
    action?: ReactNode,
}

function File({ color, src, action }: FileProps) {
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
        <View style={styles.container}>
            <View style={styles.content}>
                <Icon icon={file().icon} iconColor={color} />
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Text type='subtitle' title={file().title} />
                    <Text type='small' title={`${file().size} ${file().measure}`} />
                </View>
            </View>
            {action}
        </View>
    );
}

export default memo(File);

const styles = StyleSheet.create({
    container: {
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

/**
 * {"mimeType": "image/jpeg", "name": "Brunching-In-Style-1024x1024.jpg", "size": 179670,
 *  "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/ce8a0296-aa7f-49b0-b9f2-64fac5ad7542.jpg"}
 * 
 * {"mimeType": "application/pdf", "name": "dummy-pdf_2.pdf", "size": 7478, 
 * "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/c1b15ebb-0515-41ae-a491-1f7fc973f414.pdf"}
 * 
 * 
 * 
 * 
 * {"assetId": null, "base64": null, "duration": null, "exif": null, "fileName": "zoeyshen_dashboard3_2x.png", 
 * "fileSize": 482387, "height": 600, "mimeType": "image/png", "rotation": null, "type": "image", "width": 800
 * "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDevGlobal-e92551a9-9074-4959-88ad-d0799d805cb8/ImagePicker/83e6a7e0-6a03-49ca-8dd4-a474aec010aa.png"}
 */
