import Text from '@blocks/Text'
import FileModel from '@model/file'
import AppBar from '@blocks/AppBar'
import useFile from '@hooks/useFile'
import useAxios from '@hooks/useAxios'
import ProjectModel from '@model/project'
import BottomSheet from '@blocks/BottomSheet'
import { projectsContext } from '@ProjectsContext'
import { useThemeColor } from '@hooks/useThemeColor'
import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, View, Alert, StyleSheet, ActivityIndicator } from 'react-native'
import ProjectUploadData from '@project-details/ProjectUploadData'
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import TextInputField from '@ui/TextInputField'
import { useForm } from 'react-hook-form'
import useDate from '@hooks/useDate'
import ImageAvatar from '@blocks/ImageAvatar'
import ImageViewerFunc from '@components/ImageViewer'
import DatePicker from '@ui/DatePicker'
import UserModel from '@model/user'
import StackUI from '@blocks/StackUI'
import Icon from '@blocks/Icon'
import File from '@blocks/File'
import Button from '@ui/Button'
import StatusBar from '@blocks/StatusBar'
import { activeProjectContext } from '@context/ActiveProjectContextProvider'

type UploadStep = { msg: string; index: 0 | 1 | 2 } | null;

type ProjectInputs = {
    startDate: string; deadline: string;
    name: string; description: string; teamValue: string;
}

type TeamMemberModel = {
    id: string, avatar: string
    name: { first: string, last: string }
}

function ProjectDetails() {
    //#region Hooks and States
    // General Hooks
    const colors = useThemeColor();
    const { nextMonth } = useDate();
    const [loading, setLoading] = useState(true);
    const { decodeFile, imagePicker, documentPicker, uploadFiles } = useFile();
    // Local State
    const [isNew, setIsNew] = useState<boolean>(true);
    const [isEdited, setIsEdited] = useState<boolean>(false);
    const { control, reset, watch, setValue, handleSubmit, formState: { errors } } =
        useForm<ProjectInputs>({
            defaultValues: {
                deadline: nextMonth(new Date()),
                startDate: new Date().toISOString(),
                name: '', description: '', teamValue: '',
            }
        });

    // General Data: Logo, Name, Description, Start Date, Deadline
    const [logo, setLogo] = useState<FileModel | null>(null);
    const [openImageViewer, setOpenImageViewer] = useState(false);
    const { getRequest, postRequest, putRequest, patchRequest, deleteRequest } = useAxios();

    //Attachments Data
    const [expand, setExpand] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<FileModel[]>([])

    //Members Data
    const [users, setUsers] = useState<UserModel[]>([]);
    const [team, setTeam] = useState<TeamMemberModel[]>([]);


    // Uploading Data
    const [openModal, setOpenModal] = useState(false);
    const [uploadStep, setUploadStep] = useState<UploadStep>(null);
    //#endregion

    // Context
    const type = useLocalSearchParams().type as string;
    const { project: activeProject } = useContext(activeProjectContext)
    const { loadProjects, addNewProject, updateProject, removeProject, addBulkProject } = useContext(projectsContext);


    useEffect(() => {

        getRequest({ endPoint: "users" })
            .then(res => res && // filter users by role != "admin"
                setUsers(res.filter((user: UserModel) => user.role === "user"))
            );
        if (type == 'edit' && activeProject._id) {
            setIsNew(false);
            setLogo(decodeFile(activeProject.logo));
            console.log(activeProject.team.length );
            // setTeam(activeProject.team);
            // setAttachments(activeProject.attachments.map((attach: string) => decodeFile(attach)));
            reset({ name: activeProject.name, description: activeProject.description, deadline: activeProject.deadline, startDate: activeProject.startDate });

        }
        setLoading(false);
    }, []);
    useEffect(() => { !isNew && setIsEdited(true) }, [watch("name"), watch("description"), watch("deadline"), watch("startDate",)]);

    // Project Timeout {Start Date, Deadline}
    const onDateSelect = useCallback((name: string, value: Date | undefined) => {
        value && setValue(name as keyof ProjectInputs, value.toISOString());
    }, [])

    // Remove Project Attachment File 
    const removeFile = useCallback((file: FileModel) => {
        setAttachments(prev => prev.filter((attach) => attach.uri !== file.uri));
    }, []);

    //#region  Handle Files Modifiers {imgs, docs}, {pick, upload}
    const handlePickFiles = useCallback(async (type: "img" | "doc") => {
        if (type === "img") {
            const res = await imagePicker({ multiple: false });
            res && setLogo(res[0]);
        }
        else {
            const res = await documentPicker();
            res && setAttachments(res);
        }
    }, [isNew]);

    const handleUploadFiles = useCallback(async () => {
        const res: { uploadedLogo: string, uploadedAttachments: string[] } = { uploadedLogo: "", uploadedAttachments: [] };
        //Check Logo
        if (logo && logo.isNeedToUpload) {
            console.log("Logo is Need to Upload")
            await uploadFiles([logo]).then((files: { name: string, size: string }[]) => res.uploadedLogo = files[0].name);
            console.log("Logo", res.uploadedLogo);
        }
        if (attachments.length) {
            const newAttaches = attachments.filter((attach) => !attach.isNeedToUpload);
            if (newAttaches.length) {
                await uploadFiles(newAttaches).then((files: { name: string, size: string }[]) => {
                    res.uploadedAttachments = files.map((file: { name: string, size: string }) => file.name);
                })
            }
        }
        return res;
    }, [logo, attachments]);/**VIP: Example for useCallback  without dependencies function can`t see updates because dependencies are the cached values*/
    //#endregion

    //#region  Project Members Modifiers {add, remove}
    const addNewMember = useCallback((member: TeamMemberModel) => {
        setTeam(prev => prev.some(m => m.id === member.id) ? prev : [...prev, member])
    }, [])

    const removeMember = useCallback((id: string) => {
        setTeam(prev => prev.filter((member) => member.id !== id))
    }, [])
    //#endregion


    //#region AppBar Action Button Project Modifiers {create, edit, delete}
    // Create Project Handler
    const handleCreate = useCallback(handleSubmit(async ({ startDate, deadline, name, description }: ProjectInputs) => {
        try {
            let channel;
            setOpenModal(true);

            // Step 1: Upload Files
            const { uploadedLogo, uploadedAttachments } = await handleUploadFiles();

            // Step 2: Create Project
            setUploadStep({ index: 1, msg: 'Creating project...' });
            console.log(
                {
                    name, description, deadline, startDate, logo: uploadedLogo,
                    attachments: uploadedAttachments, team: team.map(member => member)
                }
            )
            await postRequest({
                endPoint: '/projects',
                body: {
                    name, description, deadline, startDate, logo: uploadedLogo,
                    attachments: uploadedAttachments, team: team.map(member => member.id)
                }
            }).then(res => { console.log(JSON.stringify(res)); loadProjects(); channel = res.channel; });

            console.log("channel", channel)

            // Step 3: Update Channel
            setUploadStep({ index: 2, msg: 'Updating channel...' });
            await putRequest({
                endPoint: `/channels/${channel}`,
                body: { photo: uploadedLogo }
            });
            setUploadStep({ index: 2, msg: 'Channel updated successfully' });
            // router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to create project. Please try again.');
            console.error('Create Error:', error);
        } finally {
            setOpenModal(false);
            setUploadStep(null);
        }
    }), [attachments, team, logo]);

    // Edit Project Handler
    const handleUpdate = useCallback(async () => {
        // if (!project._id) return;

        try {
            setOpenModal(true);

            // Step 1: Handle File Updates
            // const { logo, attachments } = await handleFileUploads();

            // Step 2: Update Project
            setUploadStep({ index: 1, msg: 'Updating project...' });
            // const { name, description, deadline, startDate, _id } = project;

            // await patchRequest({
            //     endPoint: `/projects/${_id}`,
            //     body: { description, deadline, startDate, attachments, team: members.map(member => member.id) }
            // }).then(response => console.log("\n\n\nResponse", response));

            // Step 3: Update Channel if logo changed
            setUploadStep({ index: 2, msg: 'Channel updated successfully' });

        } catch (error) {
            Alert.alert('Error', 'Failed to update project. Please try again.');
            console.error('Update Error:', error);
        } finally {
            setOpenModal(false);
            setUploadStep(null);
            // resetEdited();
            router.back();
        }
    }, [attachments, team, logo]);

    // Delete Project Handler
    const handleDelete = useCallback(() => {
        // if (!project._id) return;

        Alert.alert(
            'Delete Project',
            'Are you sure you want to delete this project?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // await deleteRequest({
                            //     endPoint: `/projects/${project._id}`,
                            // });
                            // removeProject(project._id!);
                            router.back();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete project. Please try again.');
                            console.error('Delete Error:', error);
                        }
                    }
                }
            ]
        );
    }, [attachments, team, logo]);
    //#endregion

    //#region UI
    return (
        <View style={[{ flex: 1, backgroundColor: colors.background }, loading && { justifyContent: 'center', alignItems: 'center' }]}>
            {loading ?
                <>
                    <StatusBar hidden />
                    <ActivityIndicator size='large' color={colors.primary} />
                </>
                : <>
                    <AppBar leading='back'
                        title={<Text type='subtitle' title={isNew ? 'New Project' : watch('name')} />}
                        action={
                            <Pressable onPress={() => isNew ? handleCreate() : isEdited ? handleUpdate() : handleDelete()}>
                                <Text bold type='subtitle'
                                    title={isNew ? 'Create' : isEdited ? 'Update' : 'Delete'}
                                    color={isNew ? colors.primary : isEdited ? colors.body : colors.cancel}
                                />
                            </Pressable>}
                    />


                    <View style={{
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        justifyContent: 'space-between',
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Project General Details View {Logo, Name, Description, Start-Date, Deadline}*/}
                            <View style={{ gap: 16, paddingBottom: 16 }}>
                                <View style={{ gap: 16, }}>
                                    <View style={[styles.logo, { backgroundColor: colors.card }, !logo && { paddingHorizontal: 60, paddingVertical: 20, }]}>
                                        <ImageAvatar onPress={() => handlePickFiles("img")} type='project' url={logo?.uri} />
                                        {/* <ImageViewerFunc
                                            selectedImageIndex={0}
                                            showImageViewer={openImageViewer}
                                            setSelectedImageIndex={() => { }}
                                            images={[{ url: logo?.uri }] as any}
                                            setShowImageViewer={setOpenImageViewer}
                                        /> */}
                                    </View>
                                    {isNew && <TextInputField
                                        name='name' control={control}
                                        label='Project title' labelColor={colors.primary}
                                        placeholder='Enter Project Name...' errorMessage={errors.name?.message}
                                        rules={{ required: 'Project Name is required', minLength: { value: 5, message: 'Project Name is too short' } }}
                                    />}
                                    <TextInputField multiline control={control}
                                        numberOfLines={6} align='justify' name='description' label='Description'
                                        errorMessage={errors.description?.message} placeholder='Write Project Description...' labelColor={colors.primary}
                                        rules={{ minLength: { value: 5, message: 'Project Description is too short' } }}

                                    />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 24 }}>
                                        <DatePicker value={watch('startDate')} label='Start Date' onChange={(d) => onDateSelect('startDate', d)} />
                                        <DatePicker value={watch('deadline')} label='End Date' onChange={(d) => onDateSelect('deadline', d)} />
                                    </View>
                                </View>

                                {/* Project Attachments View*/}
                                <View style={{ gap: attachments.length ? 8 : 4 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text color={colors.primary} type='label' title='Upload Resources' />
                                        <Icon gap={1.2} type='complex' icon='add' onPress={() => handlePickFiles("doc")} />
                                    </View>

                                    <View style={{ gap: 3 }}>
                                        <View style={[
                                            {
                                                gap: 16,
                                                flexDirection: attachments.length ? 'column' : 'row',
                                                justifyContent: attachments.length ? 'flex-start' : 'center',
                                            }
                                        ]}>
                                            {!attachments.length ? <Text italic type='label' color={'#363e50'} title='No Resources Uploaded' /> :
                                                <View style={{ width: '100%', gap: 12 }}>
                                                    <View style={{ gap: 8 }}>
                                                        {attachments.slice(0, expand ? attachments.length : 3).map((file) => (
                                                            <File src={file} key={file.uri} type='attachment' onPress={() => removeFile(file)} />
                                                        ))}
                                                    </View>
                                                    {attachments.length > 3 && (
                                                        <Button type='text' conStyle={{ width: '100%', justifyContent: 'flex-end' }} onPress={() => setExpand(!expand)} align='flex-start'
                                                            label={expand ? 'Show Less' : `Show More (+${attachments.length - 3})`}
                                                        />
                                                    )}
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>

                                {/* Project Members View*/}
                                <View style={{ gap: team.length ? 8 : 4 }}>
                                    <Text color={colors.primary} type='label' title='Project Members' />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
                                        {team.length > 0 && !team.length ? <Text italic type='error' title='No Members Assigned to This Project' /> :
                                            team.map((member) =>
                                                <Pressable key={member.id} onPress={() => removeMember(member.id)}>
                                                    <StackUI base={<ImageAvatar type='avatar' url={member.avatar} size={50} />}
                                                        position={{ vertical: 'bottom', horizontal: 'right' }} value={{ vertical: 2, horizontal: -2 }}
                                                        sec={<Icon border iconColor='white' bgColor='red' type='complex' gap={1} icon='close' size={18} />}
                                                    />
                                                </Pressable>
                                            )
                                        }
                                    </View>
                                    {team.length !== users.length && (
                                        <TextInputField
                                            noLabel control={control}
                                            name='teamValue' placeholder='Search By Name...'
                                        />
                                    )}
                                    {users.length === 0 ?
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, }}>
                                            <Text italic size={14} type='error' title='No Users Found' />
                                            <Icon icon='back' iconColor={colors.primary} />
                                        </View>
                                        : <View style={{ gap: 8, marginVertical: 8 }}>
                                            <View style={{ height: users.length && 220 }}>
                                                {!users.length ? <ActivityIndicator size='large' color={colors.primary} /> :
                                                    <View style={{ width: '100%', gap: 12 }}>
                                                        <View style={{ gap: 8 }}>
                                                            {users
                                                                .filter(({ id }) => !team.some((m) => m.id === id))
                                                                .map(({ avatar, name: { first, last }, id }) => (
                                                                    <Pressable style={{ marginVertical: 2 }} key={id}
                                                                        onPress={() => addNewMember({ avatar: avatar || '', id: id || Date.now().toString(), name: { first, last } })}>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} key={id}>
                                                                            <ImageAvatar type='avatar' url={avatar} size={50} />
                                                                            <Text type='subtitle' title={`${first} ${last}`} />
                                                                        </View>
                                                                    </Pressable>
                                                                ))}
                                                        </View>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                        </ScrollView>

                        <BottomSheet open={openModal} index={1}>
                            <ProjectUploadData step={uploadStep} mode={isNew ? 'create' : 'update'} />
                        </BottomSheet>
                    </View>
                </>
            }

        </View>
    );
    //#endregion
}

export default memo(ProjectDetails);

const styles = StyleSheet.create({
    logo: { borderColor: 'black', borderWidth: .07, borderRadius: 4, }
})