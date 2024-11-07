import FileModel from "@model/file";

type ProjectModel = {
    _id?: string,
    logo: string,
    name: string,
    progress: number,
    deadline: string,
    startDate: string,
    createdAt: string;
    updatedAt: string;
    description: string,
    attachments: FileModel[];
    team: ProjectMemberModel[];
    status: 'overdue' | 'pending' | 'progress' | 'review' | 'completed' | 'cancelled';
    createdBy: { _id: string, email: string, name: { first: string, last: string } };
}

export default ProjectModel;

type ProjectMemberModel = {
    _id: string,
    email: string,
    avatar: string,
    specialty: string,
    name: { first: string, last: string }
}



type ProjectCreatedByModel = {
    _id: string,
    email: string,
    name: { first: string, last: string }
}

export { ProjectMemberModel, ProjectCreatedByModel }