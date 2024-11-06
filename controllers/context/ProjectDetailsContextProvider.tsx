import { projectsData } from "@data/projects";
import useAxios from "@hooks/useAxios";
import useSecureStorage from "@hooks/useSecureStorage";
import FileModel from "@model/file";
import ProjectModel from "@model/project";
import { ImagePickerAsset } from "expo-image-picker";
import { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";

type ProjectDetailsProps = {
    isDataDone: boolean,
    project: ProjectModel
    logoFile: FileModel | null
    attachmentsFiles: FileModel[]
    setProjectLogo: (file: ImagePickerAsset) => void
    loadProjectDetails: (data: ProjectModel) => void
    setProjectGeneralData: (data: ProjectGeneralData) => void
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

    const loadProjectDetails = useCallback((data: ProjectModel) => {
        setProject({ ...data });
    }, [])

    const setProjectLogo = useCallback((file: ImagePickerAsset) => {
        setLogoFile({ uri: file.uri, name: file.fileName || file.uri.slice(15, file.uri.length), mimeType: file.mimeType || '' });
    }, [])

    const setProjectGeneralData = useCallback((data: ProjectGeneralData) => {
        setProject({ ...project, ...data });
        setIsDataDone(true);
    }, [])



    useEffect(() => { console.log("projectDetailsContextProvider"); }, [])
    const obj = useMemo(() => ({
        project, isDataDone, logoFile, attachmentsFiles, setProjectLogo, setProjectGeneralData, loadProjectDetails,
    }), [project, isDataDone, logoFile, attachmentsFiles, setProjectLogo, setProjectGeneralData, loadProjectDetails,])
    return (
        <projectDetailsContext.Provider value={obj}>
            {children}
        </projectDetailsContext.Provider>
    )
}
export default memo(ProjectDetailsContextProvider);