import Text from '@blocks/Text'
import FileModel from '@model/file'
import AppBar from '@blocks/AppBar'
import useFile from '@hooks/useFile'
import useAxios from '@hooks/useAxios'
import ProjectModel from '@model/project'
import BottomSheet from '@blocks/BottomSheet'
import { projectsContext } from '@ProjectsContext'
import { useThemeColor } from '@hooks/useThemeColor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { projectDetailsContext } from '@ProjectDetailsContext'
import { Pressable, ScrollView, View, Alert } from 'react-native'
import ProjectAttachments from '@project-details/ProjectAttachments'
import ProjectTeamMembers from '@project-details/ProjectTeamMembers'
import ProjectGeneralData from '@project-details/ProjectGeneralData'
import ProjectUploadData from '@project-details/ProjectUploadData'
import { memo, useCallback, useContext, useEffect, useState } from 'react'

type UploadStep = {
    index: 0 | 1 | 2;
    msg: string;
} | null;

function ProjectDetails() {
    // Hooks
    const router = useRouter();
    const colors = useThemeColor();
    const { uploadFiles } = useFile();
    const { postRequest, putRequest, patchRequest, deleteRequest } = useAxios();

    // Local State
    const [openModal, setOpenModal] = useState(false);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [uploadStep, setUploadStep] = useState<UploadStep>(null);

    // Route Params
    const param = useLocalSearchParams<{ project: string }>().project;

    // Context
    const {
        project,
        members,
        isDataDone,
        isEdited,
        getChangedFiles,
        loadProjectDetails,
        resetEdited
    } = useContext(projectDetailsContext);

    const {
        addNewProject,
        updateProject,
        removeProject, addBulkProject
    } = useContext(projectsContext);

    const {
        hasLogoChanged,
        hasAttachmentsChanged,
        newLogo,
        existingAttachments,
        newAttachments
    } = getChangedFiles();

    // Load project data if editing
    useEffect(() => {
        if (param) {
            setIsNew(false);
            loadProjectDetails({ ...JSON.parse(param) } as ProjectModel);
        }
    }, [param]);

    // Scroll handlers
    const handleFlatListScrollEnd = () => setScrollEnabled(true);
    const handleFlatListScrollBegin = () => setScrollEnabled(false);

    // File upload handler
    const handleFileUploads = useCallback(async () => {

        console.log("hasLogoChanged", hasLogoChanged)
        console.log("hasAttachmentsChanged", hasAttachmentsChanged);
        let result = {
            logo: project.logo || '',
            attachments: existingAttachments
        };

        // Handle logo upload if changed
        if (hasLogoChanged && newLogo) {
            setUploadStep({ index: 0, msg: 'Uploading logo...' });
            const uploadedLogo = await uploadFiles([newLogo]);
            result.logo = uploadedLogo[0].name;
            setUploadStep({ index: 0, msg: 'Logo uploaded successfully' });
        }

        // Handle attachments if changed
        if (hasAttachmentsChanged && newAttachments.length) {
            setUploadStep({ index: 0, msg: 'Uploading attachments...' });
            const uploadedAttachments = await uploadFiles(newAttachments);
            result.attachments = [
                ...result.attachments,
                ...uploadedAttachments.map((file: FileModel) => file.name)
            ];
            setUploadStep({ index: 0, msg: 'Attachments uploaded successfully' });
        }

        return result;
    }, [project, getChangedFiles, uploadFiles]);

    // Create project handler
    const handleCreate = useCallback(async () => {
        if (!isDataDone) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            let channel;
            setOpenModal(true);

            // Step 1: Upload Files
            const { logo, attachments } = await handleFileUploads();

            // Step 2: Create Project
            setUploadStep({ index: 1, msg: 'Creating project...' });
            const { name, description, deadline, startDate } = project;
            await postRequest({
                endPoint: '/projects',
                body: { description, deadline, startDate, attachments, team: members.map(member => member.id) }
            }).then(res => { addNewProject(res as ProjectModel); channel = res.channel; });


            // Step 3: Update Channel
            setUploadStep({ index: 2, msg: 'Updating channel...' });
            await putRequest({
                endPoint: `/channels/${channel}`,
                body: { photo: logo }
            });
            setUploadStep({ index: 2, msg: 'Channel updated successfully' });
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to create project. Please try again.');
            console.error('Create Error:', error);
        } finally {
            setOpenModal(false);
            setUploadStep(null);
        }
    }, [project, members, isDataDone, handleFileUploads]);

    const handleUpdate = useCallback(async () => {
        if (!project._id) return;

        try {
            setOpenModal(true);

            // Step 1: Handle File Updates
            const { logo, attachments } = await handleFileUploads();

            // Step 2: Update Project
            setUploadStep({ index: 1, msg: 'Updating project...' });
            const { name, description, deadline, startDate, _id } = project;

            await patchRequest({
                endPoint: `/projects/${_id}`,
                body: { description, deadline, startDate, attachments, team: members.map(member => member.id) }
            }).then(response => console.log("\n\n\nResponse", response));

            // Step 3: Update Channel if logo changed
            setUploadStep({ index: 2, msg: 'Channel updated successfully' });

        } catch (error) {
            Alert.alert('Error', 'Failed to update project. Please try again.');
            console.error('Update Error:', error);
        } finally {
            setOpenModal(false);
            setUploadStep(null);
            resetEdited();
            router.back();
        }
    }, [project, members, handleFileUploads]);

    // Delete project handler
    const handleDelete = useCallback(() => {
        if (!project._id) return;

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
                            await deleteRequest({
                                endPoint: `/projects/${project._id}`,
                            });
                            removeProject(project._id!);
                            router.back();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete project. Please try again.');
                            console.error('Delete Error:', error);
                        }
                    }
                }
            ]
        );
    }, [project._id]);

    // Render action button based on state
    const renderActionButton = useCallback(() => {
        if (isNew) {
            return (
                <Pressable onPress={handleCreate}>
                    <Text bold
                        title='Create'
                        type='subtitle'
                        color={colors.primary}
                    />
                </Pressable>
            );
        }

        return (
            <Pressable onPress={isEdited ? handleUpdate : handleDelete}>
                <Text bold
                    type='subtitle'
                    title={isEdited ? 'Update' : 'Delete'}
                    color={isEdited ? colors.body : colors.cancel}
                />
            </Pressable>
        );
    }, [isNew, isDataDone, isEdited, colors]);


    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <AppBar
                leading='back'
                title={
                    <Text
                        type='subtitle'
                        title={isNew ? 'New Project' : project?.name || 'Project Title'}
                    />
                }
                action={renderActionButton()}
            />

            <View style={{
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                flex: 1,
                paddingVertical: 8
            }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={scrollEnabled}
                >
                    <View style={{ gap: 16, paddingBottom: 16 }}>
                        <ProjectGeneralData />

                        <ProjectAttachments
                            onScrollBegin={handleFlatListScrollBegin}
                            onScrollEnd={handleFlatListScrollEnd}
                        />

                        <ProjectTeamMembers
                            onScrollBegin={handleFlatListScrollBegin}
                            onScrollEnd={handleFlatListScrollEnd}
                        />
                    </View>
                </ScrollView>

                <BottomSheet open={openModal} index={1}>
                    <ProjectUploadData
                        step={uploadStep}
                        mode={isNew ? 'create' : 'update'}
                    />
                </BottomSheet>
            </View>
        </View>
    );
}

export default memo(ProjectDetails);