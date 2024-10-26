import { projectsData } from "@data/projects";
import useAxios from "@hooks/useAxios";
import useSecureStorage from "@hooks/useSecureStorage";
import ProjectModel from "@model/project";
import { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";

type ProjectContextType = {
    loading: boolean,
    error: string | null,
    projects: ProjectModel[],
    loadProjects: () => void
}

export const projectsContext = createContext({} as ProjectContextType);

function ProjectsContextProvider({ children }: { children: React.ReactNode }) {
    const { get, post } = useAxios();
    const { readStorage } = useSecureStorage();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const loadProjects = async () => {
        const token = await readStorage('token');
        if (token) {
            // setLoading(true);
            // await get({ endPoint: '/projects' })
            //     .then(res => setProjects(res))
            //     .finally(() => setLoading(false))
            //     .catch(err => console.log(`Error: ${err}`));
            setProjects([...projectsData]);
        }
    }
    useEffect(() => { loadProjects(); }, [])

    const obj = useMemo(() => ({
        projects, loadProjects, loading, error
    }), [projects, loadProjects]);
    return (
        <projectsContext.Provider value={obj}>
            {children}
        </projectsContext.Provider>
    )
}
export default memo(ProjectsContextProvider);