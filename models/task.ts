type User = {
    id: string,
    name: string,
    email: string,
    avatar: string
}

type SubTask = { title: string, completed: boolean }

type TaskStatus = 'Overdue' | 'In Progress' | 'In Review' | 'Completed' | 'Pending'

type TaskModel = {
    id: string,
    status: TaskStatus,
    title: string,
    deadline: string,
    startData: string,
    description: string,
    completed: boolean,
    subTasks: SubTask[],
    attachments: string[],
    assignedTo: User[] | string[],
    type: 'personal' | 'team' | 'p2p',
}


const taskFromJson = (data: any) => {
    return {
        id: data.id,
        type: data.type,
        status: data.state,
        title: data.title,
        subTasks: data.subTasks,
        deadline: data.deadline,
        startData: data.startData,
        completed: data.completed,
        assignedTo: data.assignedTo,
        description: data.description,
        attachments: data.attachments,

    } as TaskModel;
};

export default TaskModel;
export { taskFromJson, TaskStatus }