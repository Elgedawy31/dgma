import Text from '@blocks/Text'
import AppBar from '@blocks/AppBar'
import ProjectModel from '@model/project'
import BottomSheet from '@blocks/BottomSheet'
import useFile from '@hooks/useFile'
import { useLocalSearchParams } from 'expo-router'
import { useThemeColor } from '@hooks/useThemeColor'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import { projectDetailsContext } from '@ProjectDetailsContext'
import ProjectUploadData from '@project-details/ProjectUploadData'
import ProjectGeneralData from '@project-details/ProjectGeneralData'
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import ProjectAttachments from '@project-details/ProjectAttachments'
import ProjectTeamMembers from '@project-details/ProjectTeamMembers'
import { set } from 'react-hook-form'
import Dot from '@ui/dot'
import useAxios from '@hooks/useAxios'
import { projectsData } from '@data/projects'
const uploadProcess = [
    { id: "logo", label: 'Upload Logo ', success: 'Logo is Uploaded Successfully' },
    { id: "attachments", label: 'Uploading Attachments', success: 'Attachments is Uploaded Successfully' },
    { id: "project", label: 'Creating Project', success: 'Project is Created Successfully' }]
function ProjectDetails() {
    //#region State and Initial Data
    const { post } = useAxios();
    const colors = useThemeColor();
    const { uploadFiles } = useFile();
    const [openModal, setOpenModal] = useState(false);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [uploadStep, setUploadStep] = useState<0 | 1 | 2>(0);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    // const param = JSON.parse(useLocalSearchParams<{ project: string }>().project);
    const { project, logoFile, members, attachmentsFiles, isDataDone, } = useContext(projectDetailsContext)
    //#endregion

    // useEffect(() => {
    //     if (param._id) {
    //         console.log("Project Details in Main Page", param);
    //         setIsNew(false);
    //         loadProjectDetails(param);
    //     }
    // }, [])


    useEffect(() => {
        console.log("Model State", openModal);
    }, [openModal])


    const handleFlatListScrollBegin = () => setScrollEnabled(false);
    const handleFlatListScrollEnd = () => setScrollEnabled(true);

    const onSubmit = useCallback(async () => {
        if (isNew) {/**Submit Create Action */
            try {

                setOpenModal(true);

                // Step 1: Upload Logo
                const logoURL = await uploadFiles([logoFile!]);
                setUploadStep(1);

                // Step 2: Upload Attachments
                // const files = await uploadFiles(attachmentsFiles)
                const files = attachmentsFiles.map(file => file.name)
                setUploadStep(2);
                const { name, description, deadline, startDate } = project;
                // Step 3: Create Project
                const final = {
                    "name": name,
                    "logo": logoURL[0].name,
                    "deadline": deadline,
                    "startDate": startDate,
                    "description": description,
                    "team": members.map(member => member.id),
                    "attachments": files
                }

                await post({
                    endPoint: '/projects', body: {
                        "name": name,
                        "logo": logoURL[0].name,
                        "deadline": deadline,
                        "startDate": startDate,
                        "description": description,
                        "team": members.map(member => member.id),
                        "attachments": files
                    }

                }).then(res => {

                })
                    .catch(err => console.log("Error", err))
                    .finally(() => setOpenModal(false));
            } catch (error) { console.log("Error", error); }
            finally { setOpenModal(false); }
        }

    }, [project, attachmentsFiles, members]);


    const onGenerate = useCallback(async () => {
        try {
            setOpenModal(true);
            projectsData.forEach(async ({ name, description, deadline, startDate, attachments, progress, team, logo, status }) => {
                await post({
                    endPoint: '/projects', body: {
                        "name": name,
                        "logo": logo,
                        "team": team,
                        "status": status,
                        "progress": progress,
                        "deadline": deadline,
                        "startDate": startDate,
                        "description": description,
                        "attachments": attachments,
                    }

                }).then(res => { console.log("\n\n** Response:", res, "\n\n============================================================\n\n\n"); })
                    .catch(err => console.log("Error", err))
            })
        } catch (error) { console.log("Error", error); }
        finally { setOpenModal(false); }
    }, [project, attachmentsFiles, members]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <AppBar
                leading='back'
                title={<Text type='subtitle' title={isNew ? 'New Project' : project?.name || 'Project Title'} />}
                action={
                    <View>
                        {true && <Pressable onPress={onGenerate} >
                            <Text type='subtitle' bold
                                title='Generate'
                                color={isNew ? colors.primary : /*updated ? colors.text :*/ colors.cancel} />
                        </Pressable>}
                        {!isNew && <Pressable onPress={onSubmit} >
                            <Text type='subtitle' bold
                                title={isNew ? 'Create' : /*updated ? 'Edit' :*/ 'Delete'}
                                color={isNew ? colors.primary : /*updated ? colors.text :*/ colors.cancel} />
                        </Pressable>
                        }
                        {
                            !isDataDone && <View />
                        }
                    </View>
                }
            />
            <View style={{ paddingHorizontal: 16, justifyContent: 'space-between', flex: 1, paddingVertical: 8, }}>
                <ScrollView showsVerticalScrollIndicator={false}>
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
                <BottomSheet open={openModal} index={0}>
                    {/* <ProjectUploadData step={uploadStep} /> */}
                    <View style={{ width: '100%', flex: .25, justifyContent: 'center', alignItems: 'flex-start', gap: 16, paddingHorizontal: 20 }}>
                        <Text title={`Current Step is: ${setUploadStep}`} />
                        {uploadProcess.map(({ id, label, }, index) => (
                            <View key={id} style={{ flexDirection: 'row', gap: 16, justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Dot selected={true} />
                                <Text bold type='subtitle' title={label} />
                                {uploadStep === index && <ActivityIndicator color={colors.primary} />}
                            </View>
                        ))}
                    </View>
                </BottomSheet>
            </View>
        </View>
    )
}

export default memo(ProjectDetails)