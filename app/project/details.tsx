import Text from '@blocks/Text'
import AppBar from '@blocks/AppBar'
import ProjectModel from '@model/project'
import BottomSheet from '@blocks/BottomSheet'
import useFilePicker from '@hooks/useFileUpload'
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
const uploadProcess = [
    { id: "logo", label: 'Upload Logo ', success: 'Logo is Uploaded Successfully' },
    { id: "attachments", label: 'Uploading Attachments', success: 'Attachments is Uploaded Successfully' },
    { id: "project", label: 'Creating Project', success: 'Project is Created Successfully' }]
function ProjectDetails() {
    //#region State and Initial Data
    const colors = useThemeColor();
    const { uploadFiles } = useFilePicker();
    const [openModal, setOpenModal] = useState(false);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [uploadStep, setUploadStep] = useState/*<0 | 1 | 2>*/(0);
    const { project, logoFile, attachmentsFiles, isDataDone, loadProjectDetails } = useContext(projectDetailsContext)
    const [scrollEnabled, setScrollEnabled] = useState(true);
    //#endregion

    //#region Get Params Data
    const localParams = useLocalSearchParams<{ project: string }>();
    const param: ProjectModel | undefined =
        localParams?.project ? JSON.parse(localParams.project) : undefined;
    //#endregion

    useEffect(() => {
        if (param?._id) {
            setIsNew(false);
            loadProjectDetails(param);
        }
    }, []);

    useEffect(() => {
        console.log("Model State", openModal);
    }, [openModal])


    const handleFlatListScrollBegin = () => setScrollEnabled(false);
    const handleFlatListScrollEnd = () => setScrollEnabled(true);

    const onSubmit = useCallback(async () => {
        console.log("Data", project);
        if (isNew) {/**Submit Create Action */
            try {
                setOpenModal(true);
                const logoURL = await uploadFiles(logoFile!);
                console.log("Logo URL", logoURL);
                setUploadStep(1);

                setTimeout(() => {
                    console.log("Uploading Files", attachmentsFiles);
                    // uploadFiles(attachmentsFiles)
                    setUploadStep(2);
                }, 10000)
                setTimeout(() => {
                    setOpenModal(false);
                }, 10000)

            } catch (error) {
                console.log("Error", error);

            }
            setTimeout(() => { console.log('Step 1 is Running now'); setUploadStep(1) }, 5000)
            setTimeout(() => { console.log('Step 2 is Running now'); setUploadStep(2) }, 7000)
        }
        // else {
        //     if (updated) {/**Submit Edit Action */
        //         alert("Update Project")
        //     } else {/**Submit Delete Action */
        //         alert("Delete Project")
        //     }
        // }
    }, [project]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <AppBar
                leading='back'
                title={<Text type='subtitle' title={isNew ? 'Create New' : project?.name || 'Project Title'} />}
                action={!isDataDone ? <View /> : <Pressable onPress={onSubmit} >
                    <Text type='subtitle' bold
                        title={isNew ? 'Create' : /*updated ? 'Edit' :*/ 'Delete'}
                        color={isNew ? colors.primary : /*updated ? colors.text :*/ '#F22A2A'} />
                </Pressable>}
            />
            <View style={{ paddingHorizontal: 16, justifyContent: 'space-between', flex: 1, paddingVertical: 8, }}>
                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled               >
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