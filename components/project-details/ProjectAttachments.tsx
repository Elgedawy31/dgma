import File from '@blocks/File';
import Icon from '@blocks/Icon';
import Text from '@blocks/Text';
import FileModel from '@model/file';
import { FlatList, View } from 'react-native'
import useFilePicker from '@hooks/useFileUpload';
import { useThemeColor } from '@hooks/useThemeColor';
import { DocumentPickerAsset } from 'expo-document-picker';
import { projectDetailsContext } from '@ProjectDetailsContext';
import { FC, memo, useCallback, useContext, useState } from 'react';

type FlatListComponentProps = {
    onScrollBegin: () => void;
    onScrollEnd: () => void;
};
const ProjectAttachments: FC<FlatListComponentProps> = ({ onScrollBegin, onScrollEnd }) => {
    const colors = useThemeColor();
    const { uploadFiles, documentPicker } = useFilePicker();
    const [files, setFiles] = useState<FileModel[]>([])
    const { project: { attachments } } = useContext(projectDetailsContext)
    const pickFiles = useCallback(async () => {
        const res = await documentPicker();
        if (res) {
            const files: FileModel[] = res.map((file: DocumentPickerAsset) => ({
                uri: file.uri, name: file.name,
                mimeType: file.mimeType || '', size: file.size || 0
            }));
            setFiles(files);
        }
    }, []);
    return (
        <View style={{ gap: attachments.length ? 8 : 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text color={colors.primary} type='label' title='Upload Resources' />
                <Icon gap={1.2} type='complex' icon='add' onPress={pickFiles} />
            </View>

            <View style={{ gap: 3 }}>
                <View style={[
                    {
                        gap: 16,
                        flexDirection: attachments.length ? 'column' : 'row',
                        justifyContent: attachments.length ? 'flex-start' : 'center',
                    }
                ]}>
                    {!files.length ? <Text italic type='label' color={'red'} title='No Resources Uploaded' /> :
                        <View style={{ height: 195, width: '100%' }}>
                            <FlatList data={[/*...attachments,*/ ...files]}
                                style={{ paddingHorizontal: 8 }} nestedScrollEnabled
                                onScrollBeginDrag={onScrollBegin}
                                onScrollEndDrag={onScrollEnd}
                                onMomentumScrollEnd={onScrollEnd}
                                renderItem={({ item }) => (
                                    <File key={item.name} src={item} />
                                )}
                            />
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}

export default memo(ProjectAttachments)