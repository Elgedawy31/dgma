import UserModel from "@model/user";

type TaskModel = {
    id?: string,
    note?: string,
    desc?: string,
    title?: string,
    date?: Date,
    members?: UserModel[],
    priority?: 'low' | 'medium' | 'high' | 'urgent',
    state?: 'progess' | 'completed' | 'overdue' | 'review' | 'pending' | 'cancelled',
}

export default TaskModel;
