import useAxios from './useAxios';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState, useCallback, useMemo } from 'react';

type ImageUploadProps = {
    maxCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export default function useFileUpload() {
    const { post } = useAxios();
    const [loading, setLoading] = useState(false);

    const pickSingleFile = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                selectionLimit: 1,
                allowsEditing: true,
            });
            return result.canceled ? null : result.assets[0]
        }
        catch (error) { console.error('Error picking image:', error); return null }
    }, []);

    const pickMultipleFiles = useCallback(async ({ maxCount = 2 }: ImageUploadProps) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1, allowsEditing: true,
                selectionLimit: maxCount, allowsMultipleSelection: true,
            });
            return result.canceled ? null : result.assets
        }
        catch (error) { console.error('Error picking image:', error); return null }
    }, []);

    const uploadFiles = useCallback(async (files: ImagePicker.ImagePickerAsset[]) => {
        if (!files.length) return null; /** Files array is empty */

        setLoading(true);
        files.forEach(file => {
            const imageUri = file.uri;
            const fileInfo = FileSystem.getInfoAsync(imageUri);
            fileInfo.then(res => {
                const formData = new FormData();
                formData.append('files', {
                    name: file.fileName,
                    type: file.type,
                    uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
                } as any);
                post({ endPoint: 'files/upload-file', body: formData, isMedia: true })
                    .then(res => console.log(res))
                    .catch(err => console.log(err))
                    .finally(() => setLoading(false));
            })
        })
    }, []);


    const obj = useMemo(() =>
    ({ loading, pickSingleFile, pickMultipleFiles, uploadFiles }
    ), [loading, pickSingleFile, pickMultipleFiles, uploadFiles,])

    return obj;
};
