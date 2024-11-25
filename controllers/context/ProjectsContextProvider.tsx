import useAxios from "@hooks/useAxios";
import ProjectModel from "@model/project";
import { userContext } from "@UserContext";
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ProjectContextType = {
    error: string;
    loading: boolean;
    projects: ProjectModel[];
    loadProjects: () => void;
    removeProject: (id: string) => void;
    updateProject: (data: ProjectModel) => void;
    addNewProject: (data: ProjectModel) => void;
    addBulkProject: (data: ProjectModel[]) => void;
}

export const projectsContext = createContext({} as ProjectContextType);

function ProjectsContextProvider({ children }: { children: React.ReactNode }) {
    const { getRequest } = useAxios();
    const { userToken } = useContext(userContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const loadProjects = useCallback(async () => {
        setLoading(true);
        await getRequest({ endPoint: '/projects' })
            .then(res => setProjects(res))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [])

    const addNewProject = useCallback((data: ProjectModel)
        : void => { setProjects(prev => [...prev, data]); }, []);

    const addBulkProject = useCallback((data: ProjectModel[])
        : void => { setProjects(prev => [...prev, ...data]); }, []);


    const removeProject = useCallback((id: string) => setProjects(projects.filter((project) => project._id !== id)), [projects]);

    const updateProject = useCallback((data: ProjectModel): void => {
        setProjects(projects.map((project) => project._id === data._id ? data : project));
    }, [projects]);

    const obj = useMemo(() => ({
        loading, error, projects, loadProjects, addNewProject, addBulkProject, removeProject, updateProject
    }), [loading, error, projects, loadProjects, addNewProject, addBulkProject, removeProject, updateProject]);

    return (
        <projectsContext.Provider value={obj}>
            {children}
        </projectsContext.Provider>
    )
}
export default memo(ProjectsContextProvider);