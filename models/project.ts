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
    team: ProjectMemberModel[];
    attachments: ProjectAttachmentModel[];
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

type ProjectAttachmentModel = {
    _id?: string,
    name: string,
    size: number,
    type: 'pdf' | 'image' //| 'video' | 'audio' | 'docx' | 'pptx' | 'xlsx' | 'file',
}

type ProjectCreatedByModel = {
    _id: string,
    email: string,
    name: { first: string, last: string }
}

export { ProjectMemberModel, ProjectAttachmentModel, ProjectCreatedByModel }