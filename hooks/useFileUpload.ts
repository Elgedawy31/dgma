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

    const imagePicker = useCallback(async ({ multiple = true }: PickerModel = {}) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                selectionLimit: 10,
                allowsEditing: false,
                allowsMultipleSelection: multiple
            });
            return result.canceled ? null : result.assets
        }
        catch (error) { console.error('Error picking image:', error); return null }
    }, []);


    const documentPicker = useCallback(async ({ multiple = true }: PickerModel = {}) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: multiple
            });
            return result.canceled ? null : result.assets
        }
        catch (error) { console.error('Error picking document:', error); return null }
    }, []);



    const uploadFiles = useCallback(async (file: FileModel) => {
        // const uploadFiles = useCallback(async (files: FileModel[]) => {
        // if (!files.length) return null; /** Files array is empty */
        setLoading(true);
        const formData = new FormData();
        // files.forEach(file => {
        //     formData.append('files', {
        //         name: file.name,
        //         type: file.mimeType,
        //         uri: Platform.OS === 'android' ? file.uri.replace('file://', '') : file.uri,
        //     } as any);
        //     return formData
        // })
        console.log("Uploading Logo", file);
        formData.append('files', {
            name: file.name,
            type: file.mimeType,
            uri: file.uri,
        } as any);
        console.log("formData", JSON.stringify(formData));

        await axios.post('http://localhost:5001/api/files/upload-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDNiZGQ1ODhkZmY1MGFmNGIyNWUxOCIsImlhdCI6MTcyOTc2MDQzN30.-ib2nVrDrhrTP-6W1_4xmNb4Q5UeeLeT-i3r0MRnyiA`
            }
        }).then(res => console.log(res)).catch(err => console.log(err)).finally(() => setLoading(false));
        // return post({ endPoint: 'files/upload-file', body: formData, isMedia: true })
        //     .then(res => { console.log(res); return res })
        //     .catch(err => console.log(err))
        //     .finally(() => setLoading(false));
    }, []);


    const obj = useMemo(() =>
    ({ loading, imagePicker, documentPicker, uploadFiles }
    ), [loading, imagePicker, documentPicker, uploadFiles,])

    return obj;
};
