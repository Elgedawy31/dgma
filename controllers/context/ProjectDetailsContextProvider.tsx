import { projectsData } from "@data/projects";
import useAxios from "@hooks/useAxios";
import useSecureStorage from "@hooks/useSecureStorage";
import FileModel from "@model/file";
import ProjectModel from "@model/project";
import { ImagePickerAsset } from "expo-image-picker";
import { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";

type ProjectDetailsProps = {
    members: { id: string, avatar: string }[]
    isDataDone: boolean,
    project: ProjectModel
    logoFile: FileModel | null
    attachmentsFiles: FileModel[]
    setProjectLogo: (data: FileModel) => void
    removeProjectMember: (data: string) => void
    loadProjectDetails: (data: ProjectModel) => void
    setProjectAttachments: (data: FileModel[]) => void
    setProjectGeneralData: (data: ProjectGeneralData) => void
    addProjectMember: (data: { id: string, avatar: string }) => void
}
type ProjectGeneralData = {
    name: string,
    deadline: string,
    startDate: string,
    description: string,
}
export const projectDetailsContext = createContext<ProjectDetailsProps>({} as ProjectDetailsProps);

function ProjectDetailsContextProvider({ children }: { children: React.ReactNode }) {
    const [isDataDone, setIsDataDone] = useState(false);
    const [logoFile, setLogoFile] = useState<FileModel | null>(null);
    const [attachmentsFiles, setAttachmentsFiles] = useState<FileModel[]>([]);
    const [members, setMembers] = useState<{ id: string, avatar: string }[]>([]);

    const [project, setProject] = useState<ProjectModel>({
        logo: '',
        name: '',
        progress: 0,
        createdAt: '',
        updatedAt: '',
        description: '',
        status: 'pending',
        team: [], attachments: [],
        deadline: new Date().toISOString(),
        startDate: new Date().toISOString(),
        createdBy: { _id: '', email: '', name: { first: '', last: '' } },
    });

    const loadProjectDetails = useCallback((data: ProjectModel)
        : void => setProject({ ...data })
        , [])

    const setProjectLogo = useCallback((file: FileModel)
        : void => setLogoFile({ ...file })
        , [])

    const setProjectGeneralData = useCallback((data: ProjectGeneralData)
        : void => setProject({ ...project, ...data })
        , [])

    const { name, startDate, deadline, description, team } = useMemo(() => project, [project]);

    useEffect(() => {
        name && startDate && deadline && description &&
            logoFile?.uri && team.length && setIsDataDone(true);
    }, [project])

    const setProjectAttachments = useCallback((data: FileModel[])
        : void => setAttachmentsFiles([...data])
        , [])

    const addProjectMember = useCallback((data: { id: string, avatar: string })
        : void => setMembers(prev => prev.some(member =>
            member.id === data.id) ? prev : [...prev, data]
        ), []);

    const removeProjectMember = useCallback((id: string)
        : void => setMembers(prev =>
            prev.filter(member => member.id !== id)
        ), []);

    const obj = useMemo(() => ({
        project, isDataDone, logoFile, members, attachmentsFiles,
        setProjectLogo, setProjectGeneralData, loadProjectDetails, setProjectAttachments, addProjectMember, removeProjectMember

    }), [project, isDataDone, logoFile, members, attachmentsFiles,
        setProjectLogo, setProjectGeneralData, loadProjectDetails, setProjectAttachments, addProjectMember, removeProjectMember])

    return (
        <projectDetailsContext.Provider value={obj}>
            {children}
        </projectDetailsContext.Provider>
    )
}
export default memo(ProjectDetailsContextProvider);