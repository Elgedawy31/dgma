import File from '@blocks/File';
import Icon from '@blocks/Icon';
import Text from '@blocks/Text';
import FileModel from '@model/file';
import { FlatList, View } from 'react-native'
import useFile from '@hooks/useFile';
import { useThemeColor } from '@hooks/useThemeColor';
import { DocumentPickerAsset } from 'expo-document-picker';
import { projectDetailsContext } from '@ProjectDetailsContext';
import { FC, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Button from '@ui/Button';

type FlatListComponentProps = {
    onScrollBegin: () => void;
    onScrollEnd: () => void;
};
const ProjectAttachments: FC<FlatListComponentProps> = ({ onScrollBegin, onScrollEnd }) => {
    const colors = useThemeColor();
    const [files, setFiles] = useState<FileModel[]>([])
    const [expand, setExpand] = useState<boolean>(false);
    const { documentPicker, uploadFiles, decodeFile } = useFile();
    const { setProjectAttachments, removeAttachment, project: { attachments }, } = useContext(projectDetailsContext)

    useEffect(() => {
        setProjectAttachments(files);
        console.log(files);
    }, [files])

    const pickFiles = useCallback(async () => {
        const res = await documentPicker();
        console.log("Picked Files", res);
        res && setFiles(res);
    }, []);

    const removeFile = useCallback((file: FileModel) => {
        removeAttachment(file);
        setFiles(files.filter((f) => f.uri !== file.uri));
    }, []);

    const castAttachments = useMemo(() => attachments.map((file) => decodeFile(file)), [attachments]);

    const catchAllAttachments = useMemo(() => [...files, ...castAttachments], [castAttachments, files]);

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
                    {(!files.length && !castAttachments.length) ? <Text italic type='label' color={'red'} title='No Resources Uploaded' /> :
                        <View style={{ width: '100%', gap: 12 }}>
                            <View style={{ gap: 8 }}>
                                {catchAllAttachments.slice(0, expand ? catchAllAttachments.length : 3).map((file) => (
                                    <File src={file}
                                        key={file.uri} type='attachment'
                                        onPress={() => removeFile(file)}
                                    />
                                ))}
                            </View>
                            {catchAllAttachments.length > 3 && (
                                <Button type='text' conStyle={{ width: '100%', justifyContent: 'flex-end' }} onPress={() => setExpand(!expand)} align='flex-start'
                                    label={expand ? 'Show Less' : `Show More (+${catchAllAttachments.length - 3})`}
                                />
                            )}
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}

export default memo(ProjectAttachments)