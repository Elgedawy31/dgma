import DatePicker from '@ui/DatePicker'
import { useForm } from 'react-hook-form'
import ImageAvatar from '@blocks/ImageAvatar'
import { StyleSheet, View } from 'react-native'
import TextInputField from '@ui/TextInputField'
import useFile from '@hooks/useFile'
import { useThemeColor } from '@hooks/useThemeColor'
import { projectDetailsContext } from '@ProjectDetailsContext'
import { memo, useCallback, useContext, useEffect, useState } from 'react'
import ImageViewerFunc from '@components/ImageViewer'

type ProjectDetailsInputsProps = {
    name: string;
    deadline: string;
    startDate: string;
    description: string;
}
const ProjectGeneralData = () => {
    const colors = useThemeColor();
    const { imagePicker, uploadFiles } = useFile();
    const [isNew, setIsNew] = useState<boolean>(true);
    const { control, reset, watch, setValue, formState: { errors } } = useForm<ProjectDetailsInputsProps>({});
    const { project, logoFile, setProjectLogo, setProjectGeneralData } = useContext(projectDetailsContext);
    const { _id, logo, name, description, deadline, startDate } = project
    const [openImageViewer, setOpenImageViewer] = useState(false);
    useEffect(() => {
        if (_id) {
            setIsNew(false);
            reset({ name, description, deadline, startDate });
        }
    }, [_id])

    const pickLogoImage = useCallback(async () => {
        if (isNew) {
            const res = await imagePicker({ multiple: false });
            if (res) {
                const uploaded = await uploadFiles(res);
                console.log("Uploaded", uploaded);
                // setProjectLogo(res[0]);
            }
            res && setProjectLogo(res[0]);
        }
        else { setOpenImageViewer(true); }
    }, [isNew]);

    const onDateSelect = useCallback((name: string, value: Date | undefined) => {
        value && setValue(name as keyof ProjectDetailsInputsProps, value.toISOString());

    }, [])

    useEffect(() => {
        const allFields = watch();
        const { name, description, startDate, deadline } = watch();
        name && description && startDate && deadline && setProjectGeneralData(allFields);
    }, [watch('name'), watch('description'), watch('startDate'), watch('deadline')]);

    console.log('watch startdat and deadline' , watch('deadline') , watch('startDate'))
    return (
        <View style={{ gap: 16, }}>
            <View style={[styles.logo, { backgroundColor: colors.card }, !logoFile?.uri && { paddingHorizontal: 60, paddingVertical: 20, }]}>
                <ImageAvatar onPress={pickLogoImage} type='project' url={logoFile?.uri || logo || ''} />
                <ImageViewerFunc
                    images={[{ url: logo || logoFile?.uri || '' }] as any}
                    setShowImageViewer={setOpenImageViewer}
                    showImageViewer={openImageViewer}
                    selectedImageIndex={0}
                    setSelectedImageIndex={() => { }}
                />
            </View>
            {isNew && <TextInputField
                name='name'
                control={control}
                label='Project title'
                labelColor={colors.primary}
                placeholder='Enter Project Name'
                errorMessage={errors.name?.message}
                rules={{ required: 'Project Name is required', minLength: { value: 5, message: 'Project Name is too short' } }}
            />}
            <TextInputField
            numberOfLines={6}
                multiline
                align='justify'
                control={control}
                name='description'
                label='Description'
                labelColor={colors.primary}
                errorMessage={errors.description?.message}
                rules={{ required: 'Description is required', minLength: { value: 5, message: 'Project Description is too short' } }}
                placeholder='enter description'

            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 24 }}>
                <DatePicker value={startDate} label='Start Date' onChange={(d) => onDateSelect('startDate', d)} />
                <DatePicker value={deadline} label='End Date' onChange={(d) => onDateSelect('deadline', d)} />
            </View>
        </View>
    )
}

export default memo(ProjectGeneralData)

const styles = StyleSheet.create({
    logo: { borderColor: 'black', borderWidth: .07, borderRadius: 4, }
})
