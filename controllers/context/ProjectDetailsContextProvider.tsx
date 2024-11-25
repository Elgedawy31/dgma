import FileModel from "@model/file";
import ProjectModel from "@model/project";
import { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";

type ProjectDetailsProps = {
    // States
    isEdited: boolean
    isDataDone: boolean
    project: ProjectModel
    logoFile: FileModel | null
    attachmentsFiles: FileModel[]
    members: { id: string, avatar: string }[]

    // File Management
    getChangedFiles: () => {
        hasLogoChanged: boolean
        hasAttachmentsChanged: boolean
        newLogo: FileModel | null
        existingAttachments: string[]
        removedAttachments: string[]
        newAttachments: FileModel[]
    }

    // State Management
    resetEdited: () => void
    removeProjectMember: (data: string) => void
    removeAttachment: (data: FileModel) => void
    setProjectLogo: (data: FileModel | null) => void
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
    const [isEdited, setIsEdited] = useState(false);
    const [isDataDone, setIsDataDone] = useState(false);

    const [logoFile, setLogoFile] = useState<FileModel | null>(null);
    const [attachmentsFiles, setAttachmentsFiles] = useState<FileModel[]>([]);

    const [members, setMembers] = useState<{ id: string, avatar: string }[]>([]);

    const [originalState, setOriginalState] = useState<{
        project: ProjectModel,
        attachments: string[]
        members: { id: string, avatar: string }[],
    } | null>(null);

    const [project, setProject] = useState<ProjectModel>({
        logo: '',
        name: '',
        progress: 0,
        createdAt: '',
        updatedAt: '',
        description: '',
        status: 'Pending',
        team: [],
        attachments: [],
        deadline: new Date().toISOString(),
        startDate: new Date().toISOString(),
        createdBy: { _id: '', email: '', name: { first: '', last: '' } },
    });

    const loadProjectDetails = useCallback((data: ProjectModel): void => {
        setProject({ ...data });

        const projectMembers = data.team.map(member => ({
            id: typeof member === 'string' ? member : member._id,
            avatar: typeof member === 'string' ? '' : member.avatar || ''
        }));
        setMembers(projectMembers);

        if (data.logo) {
            setLogoFile({ uri: data.logo, name: data.logo } as FileModel);
        }

        const projectAttachments = data.attachments.map(att => ({
            uri: att,
            name: att
        } as FileModel));
        setAttachmentsFiles(projectAttachments);

        setOriginalState({
            project: { ...data },
            members: projectMembers,
            attachments: data.attachments
        });
    }, []);

    useEffect(() => {
        if (originalState) {
            const hasProjectChanges = JSON.stringify({
                name: originalState.project.name,
                description: originalState.project.description,
                deadline: originalState.project.deadline,
                startDate: originalState.project.startDate,
            }) !== JSON.stringify({
                name: project.name,
                description: project.description,
                deadline: project.deadline,
                startDate: project.startDate,
            });

            const hasMemberChanges = JSON.stringify(originalState.members.map(m => m.id).sort())
                !== JSON.stringify(members.map(m => m.id).sort());

            const hasLogoChanges = originalState.project.logo !== (logoFile?.uri || '');

            const hasAttachmentChanges = JSON.stringify(originalState.attachments.sort())
                !== JSON.stringify(attachmentsFiles.map(a => a.uri).sort());

            setIsEdited(hasProjectChanges || hasMemberChanges || hasLogoChanges || hasAttachmentChanges);
        }
    }, [project, members, logoFile, attachmentsFiles, originalState]);

    useEffect(() => {
        const { name, startDate } = project;
        console.log({ name, startDate, members });
        setIsDataDone(!!name && !!startDate &&  members.length > 0);
    }, [project, logoFile, members]);

    const getChangedFiles = useCallback(() => {
        if (!originalState) {
            return {
                hasLogoChanged: true,
                hasAttachmentsChanged: true,
                newLogo: logoFile,
                existingAttachments: [],
                removedAttachments: [],
                newAttachments: attachmentsFiles
            };
        }

        const hasLogoChanged = originalState.project.logo !== (logoFile?.uri || '');
        const newLogo = hasLogoChanged ? logoFile : null;

        const currentAttachments = attachmentsFiles.map(f => f.uri);
        const originalAttachments = originalState.attachments;

        const newAttachments = attachmentsFiles.filter(
            file => !originalAttachments.includes(file.uri)
        );

        const existingAttachments = originalAttachments.filter(
            uri => currentAttachments.includes(uri)
        );

        const removedAttachments = originalAttachments.filter(
            uri => !currentAttachments.includes(uri)
        );

        return {
            hasLogoChanged,
            hasAttachmentsChanged: newAttachments.length > 0 || removedAttachments.length > 0,
            newLogo,
            existingAttachments,
            removedAttachments,
            newAttachments
        };
    }, [logoFile, attachmentsFiles, originalState]);

    const setProjectLogo = useCallback((file: FileModel | null): void => {
        setLogoFile(file);
    }, []);

    const setProjectGeneralData = useCallback((data: ProjectGeneralData): void => {
        setProject(prev => ({ ...prev, ...data }));
    }, []);

    const setProjectAttachments = useCallback((data: FileModel[]): void => {
        setAttachmentsFiles([...data]);
    }, []);

    const removeAttachment = useCallback((data: FileModel): void => {
        let found = false;
        setAttachmentsFiles(prev => prev.filter(file => {
            if (file.uri !== data.uri) {
                found = true;
                return false;
            }
            return true;
        }));
        if (!found) {
            setProject(prev => ({ ...prev, attachments: prev.attachments.filter(uri => uri !== data.uri) }));
        }
    }, []);

    const addProjectMember = useCallback((data: { id: string, avatar: string }): void => {
        setMembers(prev =>
            prev.some(member => member.id === data.id) ? prev : [...prev, data]
        );
    }, []);

    const removeProjectMember = useCallback((id: string): void => {
        setMembers(prev => prev.filter(member => member.id !== id));
    }, []);

    const resetEdited = useCallback((): void => {
        if (originalState) {
            setProject(originalState.project);
            setMembers(originalState.members);
            setLogoFile(originalState.project.logo ?
                { uri: originalState.project.logo, name: originalState.project.logo } as FileModel :
                null
            );
            setAttachmentsFiles(originalState.attachments.map(uri => ({
                uri,
                name: uri
            }) as FileModel));
            setIsEdited(false);
        }
    }, [originalState]);

    const contextValue = useMemo(() => ({
        // States
        project, members, isEdited, logoFile, isDataDone, attachmentsFiles,

        resetEdited,
        setProjectLogo,
        getChangedFiles,
        addProjectMember,
        removeAttachment,
        loadProjectDetails,
        removeProjectMember,
        setProjectGeneralData,
        setProjectAttachments,
    }), [
        project, members, isEdited, logoFile, isDataDone, attachmentsFiles,
        resetEdited,
        setProjectLogo,
        getChangedFiles,
        addProjectMember,
        removeAttachment,
        loadProjectDetails,
        removeProjectMember,
        setProjectGeneralData,
        setProjectAttachments,
    ]);

    return (
        <projectDetailsContext.Provider value={contextValue}>
            {children}
        </projectDetailsContext.Provider>
    );
}

export default memo(ProjectDetailsContextProvider);