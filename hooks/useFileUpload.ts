import useAxios from './useAxios';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useState, useCallback, useMemo } from 'react';
import FileModel from '@model/file';
import axios from 'axios';

type PickerModel = { multiple?: boolean }
export default function useFilePicker() {
    const { post } = useAxios();
    const [loading, setLoading] = useState(false);

    const validateFileName = useCallback((name: string) => {
        return name.replace(/\s/g, '_')
            .replace(/[^a-zA-Z0-9._]/g, '')
            .toLowerCase();
    }, [])

    const imagePicker = useCallback(async ({ multiple = true }: PickerModel = {}) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                selectionLimit: 10,
                allowsEditing: false,
                allowsMultipleSelection: multiple
            });
            return result.canceled ? null
                : result.assets.map((file: ImagePicker.ImagePickerAsset) => (
                    {
                        uri: file.uri,
                        size: file.fileSize,
                        name: validateFileName(file.fileName!),
                        mimeType: file.mimeType || 'image/jpeg'
                    } as FileModel
                ))
        }
        catch (error) { console.error('Error picking image:', error); return null }
    }, []);


    const documentPicker = useCallback(async ({ multiple = true }: PickerModel = {}) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: multiple
            });
            return result.canceled ? null
                : result.assets.map((file: DocumentPicker.DocumentPickerAsset) => {
                    console.log('file', file.name);
                    return {
                        uri: file.uri,
                        size: file.size,
                        name: validateFileName(file.name!),
                        mimeType: file.mimeType || 'application/pdf'
                    } as FileModel
                })
        }
        catch (error) { console.error('Error picking document:', error); return null }
    }, []);



    const uploadFiles = useCallback(async (files: FileModel[]) => {
        if (!files.length) return null;
        setLoading(true);
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', {
                type: file.mimeType,
                name: file.name,
                uri: file.uri,
            } as any);
        })
        console.log('formData', JSON.stringify(formData));
        return post({ endPoint: 'files/upload-file', body: formData, isMedia: true })
            .then(res => { console.log(res); return res })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);


    const obj = useMemo(() =>
    ({ loading, imagePicker, documentPicker, uploadFiles }
    ), [loading, imagePicker, documentPicker, uploadFiles,])

    return obj;
};
