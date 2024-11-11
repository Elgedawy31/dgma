import { projectsData } from "@data/projects";
import useAxios from "@hooks/useAxios";
import useSecureStorage from "@hooks/useSecureStorage";
import ProjectModel from "@model/project";
import { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";

type ProjectContextType = {
    projects: ProjectModel[];
    loadProjects: () => void;
    addNewProject: (data: ProjectModel) => void;
}

export const projectsContext = createContext({} as ProjectContextType);

function ProjectsContextProvider({ children }: { children: React.ReactNode }) {
    const { get, post } = useAxios();
    const { readStorage } = useSecureStorage();
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const loadProjects = useCallback(async () => {
        const token = await readStorage('token');
        if (token) {
            await get({ endPoint: '/projects' })
                .then(res => res && setProjects(res))
                .catch(err => console.log(`Error: ${err}`));
            // setProjects([...projectsData]);
        }
    }, [])

    const addNewProject = useCallback((data: ProjectModel) => {
        setProjects([...projects, data]);
    }, [])

    useEffect(() => { loadProjects(); }, [])

    const obj = useMemo(() => ({
        projects, loadProjects, addNewProject
    }), [projects, loadProjects, addNewProject]);
    return (
        <projectsContext.Provider value={obj}>
            {children}
        </projectsContext.Provider>
    )
}
export default memo(ProjectsContextProvider);