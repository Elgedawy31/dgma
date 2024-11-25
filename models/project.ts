import FileModel from "@model/file";

type ProjectModel = {
    _id?: string,
    logo: string,
    name: string,
    progress: number,
    deadline: string,
    startDate: string,
    createdAt?: string;
    updatedAt?: string;
    description: string,
    attachments: string[];
    team: string[];
    status: "Pending" | "In Progress" | "In Review" | "Completed";
    createdBy?: { _id: string, email: string, name: { first: string, last: string } };
}

export default ProjectModel;

type ProjectMemberModel = {
    _id: string,
    email: string,
    avatar: string,
    name: { first: string, last: string }
}


type ProjectCreatedByModel = {
    _id: string,
    email: string,
    name: { first: string, last: string }
}

export { ProjectMemberModel, ProjectCreatedByModel }