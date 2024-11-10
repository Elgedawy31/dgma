import File from '@blocks/File';
import Icon from '@blocks/Icon';
import Text from '@blocks/Text';
import FileModel from '@model/file';
import { FlatList, View } from 'react-native'
import useFile from '@hooks/useFile';
import { useThemeColor } from '@hooks/useThemeColor';
import { DocumentPickerAsset } from 'expo-document-picker';
import { projectDetailsContext } from '@ProjectDetailsContext';
import { FC, memo, useCallback, useContext, useEffect, useState } from 'react';

type FlatListComponentProps = {
    onScrollBegin: () => void;
    onScrollEnd: () => void;
};
const ProjectAttachments: FC<FlatListComponentProps> = ({ onScrollBegin, onScrollEnd }) => {
    const colors = useThemeColor();
    const { documentPicker, uploadFiles } = useFile();
    const [files, setFiles] = useState<FileModel[]>([])
    const { setProjectAttachments, project: { attachments }, } = useContext(projectDetailsContext)

    useEffect(() => {
        setProjectAttachments(files);
    }, [files])

    const pickFiles = useCallback(async () => {
        const res = await documentPicker();
        res && setFiles(files);
    }, []);
    const removeFile = useCallback((file: FileModel) => {
        setFiles(files.filter((f) => f.uri !== file.uri));
    }, [files]);


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
                        <View style={{ maxHeight: 195, width: '100%' }}>
                            <FlatList
                                nestedScrollEnabled
                                style={{ paddingHorizontal: 8 }}
                                data={[...attachments, ...files]}
                                contentContainerStyle={{ gap: 10 }}
                                showsVerticalScrollIndicator={false}
                                onScrollEndDrag={onScrollEnd}
                                onScrollBeginDrag={onScrollBegin}
                                onMomentumScrollEnd={onScrollEnd}
                                renderItem={({ item: file }) => (
                                    <View />
                                    // <File src={file}
                                    //     key={file.name} type='attachment'
                                    //     onPress={() => removeFile(file)} />
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