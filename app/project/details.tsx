import Text from '@blocks/Text'
import Button from '@ui/Button'
import Icon from '@blocks/Icon'
import AppBar from '@blocks/AppBar'
import StackUI from '@blocks/StackUI'
import DatePicker from '@ui/DatePicker'
import { useForm } from 'react-hook-form'
import ImageAvatar from '@blocks/ImageAvatar'
import TextInputField from '@ui/TextInputField'
import useFileUpload from '@hooks/useFileUpload'
import { useLocalSearchParams } from 'expo-router'
import { useThemeColor } from '@hooks/useThemeColor'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { memo, useCallback, useEffect, useState } from 'react'
import ProjectModel, { ProjectAttachmentModel, ProjectMemberModel } from '@model/project'
import { usersData } from '@data/users'

type ProjectDetailsInputsProps = {
    logo: string;
    name: string;
    deadline: string;
    teamValue: string;
    startDate: string;
    description: string;
    attachmentValue: string;
}

function ProjectDetails() {
    const colors = useThemeColor();
    const [isNew, setIsNew] = useState(true);
    const { pickSingleFile } = useFileUpload();
    const [logo, setLogo] = useState<string | undefined>('');
    const localParams = useLocalSearchParams<{ project: string }>();
    const [members, setMembers] = useState<ProjectMemberModel[]>([]);
    const [attachments, setAttachments] = useState<ProjectAttachmentModel[]>([]);
    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } =
        useForm<ProjectDetailsInputsProps>({});
    const project: ProjectModel | undefined =
        localParams?.project ? JSON.parse(localParams.project) : undefined;
    console.log(isNew);
    useEffect(() => {
        if (project?._id) {
            console.log("Not New Project");
            setIsNew(false);
            setMembers(project.team);
            setAttachments(project.attachments);
            reset({
                logo: project.logo,
                name: project.name,
                deadline: project.deadline,
                startDate: project.startDate,
                description: project.description,
                teamValue: "",
                attachmentValue: "",
            });
        }
    }, []);


    const pickLogoImage = useCallback(async () => {
        const res = await pickSingleFile();
        console.log(res?.uri);
        setLogo(res?.uri);
    }, [logo]);

    const removeMember =
        useCallback((id: string) => {
            console.log("id", id);
            setMembers(prevMembers => prevMembers
                .filter(member => member._id !== id)
            )
        }, [])

    const addNewMember = useCallback((member: ProjectMemberModel) => {
        setMembers(prev =>
            !prev.some(mem =>
                mem._id === member._id) ?
                [...prev, member] : prev);
    }, [])
    const onDateSelect = useCallback((name: string, value: Date | undefined) => {
        value && setValue(name as keyof ProjectDetailsInputsProps, value.toISOString());
    }, [])
    const onSubmit = handleSubmit(async (data) => {
        console.log("Data", data);
        console.log(data);
        if (isNew) {

        } else {

        }
    })

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <AppBar leading='back' title={isNew ? 'Create New Project' : 'Edit Project'} />
            <View style={{ paddingHorizontal: 16, justifyContent: 'space-between', flex: 1, paddingVertical: 8, }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ gap: 16, paddingBottom: 16 }}>
                        <StackUI
                            value={{ vertical: 5, horizontal: 5 }}
                            position={{ vertical: 'bottom', horizontal: 'right' }}
                            sec={<Icon type='complex' icon={isNew ? 'add' : 'edit-img'} onPress={pickLogoImage} size={24} />}
                            base={<ImageAvatar type='project' url={logo || ''} />}
                        />

                        <TextInputField
                            name='name'
                            control={control}
                            label='Project title'
                            placeholder='Enter Project Name'
                            errorMessage={errors.name?.message}
                            rules={{ required: 'Project Name is required', minLength: { value: 5, message: 'Project Name is too short' } }}
                        />
                        <TextInputField
                            multiline
                            align='justify'
                            control={control}
                            name='description'
                            label='Description'
                            errorMessage={errors.description?.message}
                            rules={{ required: 'Description is required', minLength: { value: 25, message: 'Project Description is too short' } }}
                            placeholder='Lorem ipsum dolor sit amet consectetur. Viverra ut felis nisl duis elit nulla. Vulputate phar. Enim ultricies enim non blandit neque. Aliquam nibh pulvinar diam odio malesuada aliquet.'

                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 24 }}>
                            <DatePicker label='Start Date' onChange={(d) => onDateSelect('startDate', d)} />
                            <DatePicker label='End Date' onChange={(d) => onDateSelect('deadline', d)} />
                        </View>
                        <View style={{ gap: 8 }}>
                            <Text type='label' title='Project Members' />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
                                {
                                    members.map((member) =>
                                        <StackUI key={member._id}
                                            position={{ vertical: 'bottom', horizontal: 'right' }} value={{ vertical: -5, horizontal: -1.5 }}
                                            sec={<Icon type='complex' gap={1.2} icon='close' size={18} onPress={() => removeMember(member._id)} />}
                                            base={<ImageAvatar type='avatar' url={member.avatar} size={50} onPress={() => removeMember(member._id)} />}
                                        />
                                    )
                                }
                            </View>
                            {members.length !== usersData.length && <TextInputField
                                noLabel
                                name='teamValue'
                                control={control}
                                placeholder='Search for Project Members By Name or specialty'
                                errorMessage={errors.teamValue?.message}
                                rules={{ required: 'Members are required' }}
                            />}
                            <View style={{ gap: 8, marginVertical: 8 }}>
                                {usersData
                                    .filter((user) => !members.some((mem) => mem._id === user._id))
                                    .filter((user) => {
                                        const searchValue = watch('teamValue').toLowerCase().trim();
                                        console.log("searchValue", searchValue);
                                        return !searchValue?true :
                                            (
                                                user.name.first.toLowerCase().includes(searchValue) ||
                                                user.name.last.toLowerCase().includes(searchValue) ||
                                                user.specialty.toLowerCase().includes(searchValue) ||
                                                `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchValue)
                                            );
                                    }).map((member) => <Pressable key={member._id}
                                        onPress={() => addNewMember(member as ProjectMemberModel)}>
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <ImageAvatar type='avatar' url={member.avatar} size={50} />
                                            <View style={{ justifyContent: 'space-between' }}>
                                                <Text type='subtitle' title={`${member.name.first} ${member.name.last}`} />
                                                <Text type='details' title={member.specialty} />
                                            </View>
                                        </View>
                                    </Pressable>
                                    )
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {logo && watch('name') && watch('description') && watch('startDate') && watch('deadline')
                    /*&& members.length > 0 && attachments.length > 0*/ && <Button type='float' icon='add' label={isNew ? 'Create Project' : 'Edit Project'} onPress={onSubmit} />}
            </View>
        </View >
    )
}
export default memo(ProjectDetails)

const styles = StyleSheet.create({
    memberRemove: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'white',
        backgroundColor: 'red',
    }
})


const res = < View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

    {/* <View>
        <TextInputField
            name='attachmentValue'
            control={control}
            label='Upload Resources'
            placeholder='Upload Resources'
            errorMessage={errors.attachmentValue?.message}
            rules={{ required: 'Resources are required' }}
        />
        <View style={{ gap: 3 }}>
            {
                attachments.map((res) =>
                    (<File key={res._id} type={res.type} title={res.name} fileSize={res.size} />))
            }
        </View>
    </View> */}

</View>
