import DatePicker from '@ui/DatePicker'
import { useForm } from 'react-hook-form'
import ImageAvatar from '@blocks/ImageAvatar'
import { Platform, StyleSheet, View } from 'react-native'
import TextInputField from '@ui/TextInputField'
import useFilePicker from '@hooks/useFileUpload'
import { useThemeColor } from '@hooks/useThemeColor'
import { projectDetailsContext } from '@ProjectDetailsContext'
import { memo, useCallback, useContext, useEffect } from 'react'
import axios from 'axios'

type ProjectDetailsInputsProps = {
    name: string;
    deadline: string;
    startDate: string;
    description: string;
}
const ProjectGeneralData = () => {
    const colors = useThemeColor();
    const { imagePicker, uploadFiles } = useFilePicker();
    const { project: { _id, name, description, deadline, startDate }, logoFile, setProjectLogo, setProjectGeneralData } = useContext(projectDetailsContext);
    const { control, reset, watch, setValue, formState: { errors } } = useForm<ProjectDetailsInputsProps>({});

    useEffect(() => {
        if (_id)
            reset({
                name, description,
                startDate, deadline
            })
    }, [])

    const pickLogoImage = useCallback(async () => {
        const res = await imagePicker({ multiple: false });
        if (res) {
            const formData = new FormData();
            formData.append('files', {
                uri:Platform.OS === 'android' ? res[0].uri.replace('file://', '') : res[0].uri,
                type: res[0].type,
                name: res[0].fileName
            } as any);
            console.log("Uploading Logo", JSON.stringify(formData));
            await axios.post('http://192.168.1.71:5001/api/files/upload-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDNiZGQ1ODhkZmY1MGFmNGIyNWUxOCIsImlhdCI6MTcyOTc2MDQzN30.-ib2nVrDrhrTP-6W1_4xmNb4Q5UeeLeT-i3r0MRnyiA`
                }
            }).then(resp => console.log(resp)).catch(err => console.log(err));
            res && setProjectLogo(res[0]);
        }
    }, []);

    const onDateSelect = useCallback((name: string, value: Date | undefined) => {
        value && setValue(name as keyof ProjectDetailsInputsProps, value.toISOString());

    }, [])

    useEffect(() => {
        const allFields = watch();
        const { name, description, startDate, deadline } = watch();
        name && description && startDate && deadline && setProjectGeneralData(allFields);
    }, [watch('name'), watch('description'), watch('startDate'), watch('deadline')]);

    return (
        <View style={{ gap: 16, }}>
            <View style={[styles.logo, { backgroundColor: colors.card }, !logoFile?.uri && { paddingHorizontal: 60, paddingVertical: 20, }]}>
                <ImageAvatar onPress={pickLogoImage} type='project' url={logoFile?.uri || ''} />
            </View>
            {<TextInputField
                name='name'
                control={control}
                label='Project title'
                labelColor={colors.primary}
                placeholder='Enter Project Name'
                errorMessage={errors.name?.message}
                rules={{ required: 'Project Name is required', minLength: { value: 5, message: 'Project Name is too short' } }}
            />}
            <TextInputField
                multiline
                align='justify'
                control={control}
                name='description'
                label='Description'
                labelColor={colors.primary}
                errorMessage={errors.description?.message}
                rules={{ required: 'Description is required', minLength: { value: 5, message: 'Project Description is too short' } }}
                placeholder='Lorem ipsum dolor sit amet consectetur. Viverra ut felis nisl duis elit nulla. Vulputate phar. Enim ultricies enim non blandit neque. Aliquam nibh pulvinar diam odio malesuada aliquet.'

            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 24 }}>
                <DatePicker label='Start Date' onChange={(d) => onDateSelect('startDate', d)} />
                <DatePicker label='End Date' onChange={(d) => onDateSelect('deadline', d)} />
            </View>
        </View>
    )
}

export default memo(ProjectGeneralData)

const styles = StyleSheet.create({
    // memberRemove: {
    //     borderWidth: 1,
    //     borderRadius: 20,
    //     borderColor: 'white',
    //     backgroundColor: 'red',
    // },
    // submit: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 10 },
    logo: { borderColor: 'black', borderWidth: .07, borderRadius: 4, }
})
