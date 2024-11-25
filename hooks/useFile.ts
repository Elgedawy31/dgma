import useAxios from '@hooks/useAxios';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useState, useCallback, useMemo } from 'react';
import FileModel from '@model/file';
import axios from 'axios';
const FILE_TYPES = {
    // Images
    jpg: { type: 'image', mimeType: 'image/jpeg' },
    jpeg: { type: 'image', mimeType: 'image/jpeg' },
    png: { type: 'image', mimeType: 'image/png' },
    gif: { type: 'image', mimeType: 'image/gif' },
    webp: { type: 'image', mimeType: 'image/webp' },

    // Documents
    pdf: { type: 'document', mimeType: 'application/pdf' },
    doc: { type: 'document', mimeType: 'application/msword' },
    docx: { type: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    xls: { type: 'document', mimeType: 'application/vnd.ms-excel' },
    xlsx: { type: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
};
type PickerModel = { multiple?: boolean }
export default function useFile() {
    const { postRequest } = useAxios();
    const [loading, setLoading] = useState(false);
    const FILE_TYPES = useMemo(() => ({
        // Images
        jpg: { type: 'image', mimeType: 'image/jpeg' },
        jpeg: { type: 'image', mimeType: 'image/jpeg' },
        png: { type: 'image', mimeType: 'image/png' },
        gif: { type: 'image', mimeType: 'image/gif' },
        webp: { type: 'image', mimeType: 'image/webp' },

        // Documents
        pdf: { type: 'document', mimeType: 'application/pdf' },
        doc: { type: 'document', mimeType: 'application/msword' },
        docx: { type: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        xls: { type: 'document', mimeType: 'application/vnd.ms-excel' },
        xlsx: { type: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    }), []);

    const validateFileName = useCallback((name: string) => {
        return name.replace(/\s/g, '_')
            .replace(/[^a-zA-Z._]/g, '')
            .toLowerCase();
    }, [])

    const calcFileSize = useCallback((size: number) => {
        const sizeUnits = ['B', 'KB', 'MB', 'GB'];
        let measure = 'B';

        for (let i = 0; i < sizeUnits.length; i++) {
            if (size < 1024) {
                measure = sizeUnits[i];
                break;
            }
            size /= 1024;
        }
        return { size: +size.toFixed(2), measure };
    }, [])

    const decodeFile = useCallback((file: string, size?: string) => {
        const name = file.split('/').pop()?.split(/\d+_/).pop() || '';
        const extension = file.split('.').pop()?.toLowerCase() || '';
        const mimeType = FILE_TYPES[extension as keyof typeof FILE_TYPES].mimeType;

        const [value, measure] = size?.split(' ') || ["1", "KB"];
        return {
            name: name,
            uri: file,
            size: +value,
            mimeType: mimeType,
            measure: measure
        } as FileModel;
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
                : result.assets.map((file: ImagePicker.ImagePickerAsset) => {
                    const { size, measure } = calcFileSize(file.fileSize || 0);
                    return {
                        size: size,
                        uri: file.uri,
                        measure: measure,
                        name: validateFileName(file.fileName!),
                        mimeType: file.mimeType || 'image/jpeg'
                    } as FileModel
                })
        }
        catch (error) { console.error('Error picking image:', error); return null }
    }, []);

    const cameraCapture = useCallback(async (): Promise<FileModel[] | null> => {
        try {
            // Request camera permissions
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
                console.log('Camera permission denied');
                return null;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (result.canceled) return null;

            const file = result.assets[0];
            const { size, measure } = calcFileSize(file.fileSize || 0);

            return [{
                size: size,
                uri: file.uri,
                measure: measure,
                name: validateFileName(`camera_${Date.now()}.jpg`),
                mimeType: file.mimeType || 'image/jpeg'
            }] as FileModel[];
        } catch (error) {
            console.error('Error capturing image:', error);
            return null;
        }
    }, [calcFileSize, validateFileName]);


    const documentPicker = useCallback(async ({ multiple = true }: PickerModel = {}) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: multiple
            });
            return result.canceled ? null
                : result.assets.map((file: DocumentPicker.DocumentPickerAsset) => {
                    const { size, measure } = calcFileSize(file.size || 0);
                    return {
                        size: size,
                        uri: file.uri,
                        measure: measure,
                        name: validateFileName(file.name!),
                        mimeType: file.mimeType || 'image/jpeg'
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
        return postRequest({ endPoint: 'files/upload-file', body: formData, isMedia: true })
            .then(res => { console.log(res); return res })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);


    const obj = useMemo(() =>
    ({ loading, imagePicker, cameraCapture, documentPicker, uploadFiles, decodeFile }
    ), [loading, imagePicker, cameraCapture, documentPicker, uploadFiles, decodeFile])

    return obj;
};
