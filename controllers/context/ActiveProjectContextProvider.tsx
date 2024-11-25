import ProjectModel from "@model/project";
import { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";

type ProjectDetailsProps = {
    project: ProjectModel
    setProject: (data: ProjectModel) => void
}



export const activeProjectContext = createContext<ProjectDetailsProps>({} as ProjectDetailsProps);

function ActiveProjectContextProvider({ children }: { children: React.ReactNode }) {
    const [project, setProject] = useState<ProjectModel>({} as ProjectModel);

    const setProjectDetails = useCallback((data: ProjectModel) => {
        setProject(data);
    }, []);

    const contextValue = useMemo(() => ({ project, setProject: setProjectDetails, }), [project, setProjectDetails,]);

    return (
        <activeProjectContext.Provider value={contextValue}>
            {children}
        </activeProjectContext.Provider>
    );
}

export default memo(ActiveProjectContextProvider);