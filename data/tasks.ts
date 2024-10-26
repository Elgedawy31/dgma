import TaskModel from "@model/task";
import { usersData } from "@data/users";

export const tasksData: TaskModel[] = [
    {
        id: '1', title: 'Web Project', state: 'completed',
        desc: 'SOWT Analysis - Business Analysis', note: 'completed',
        date: { sDate: 'Aug10', eDate: 'Aug12' }, members: usersData,
    },
    {
        id: '2', title: 'Mobile Project', state: 'progess',
        desc: 'Wire-frames user interface', note: 'Three days left',
        date: { sDate: 'Aug15', eDate: 'Aug20' }, members: usersData,
    },
    {
        id: '3', title: 'Design Project', state: 'overdue',
        desc: 'Market research - User research', note: 'overdue',
        date: { sDate: 'Aug20', eDate: 'Aug25' }, members: usersData,
    },
    {
        id: '4', title: 'SWOT Analysis', state: 'completed',
        desc: 'Market research - User research', note: 'completed',
        date: { sDate: 'Aug20', eDate: 'Aug25' }, members: usersData,
    },
    {
        id: '5', title: 'Online Project', state: 'cancelled',
        desc: 'Market research - User research', note: 'cancelled',
        date: { sDate: 'Aug20', eDate: 'Aug25' }, members: usersData,
    },
];