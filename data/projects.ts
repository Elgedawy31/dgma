import ProjectModel, { ProjectMemberModel } from "@model/project";

const deadline = "2024-12-31T00:01:00.000+00:00";
const startDate = "2024-11-01T00:01:00.000+00:00";
const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum maximus ultrices. Curabitur et neque felis.';

const attachments: string[] = [
    "1731026975069_dummy.pdf",
    "1731026975069_sample.pdf",
    "1731026975068_dummydummy.pdf",
    "1731026975069_dummypdf_2.pdf"
]

const team: string[] = [
    '66e2afe3a76d0d78d527f6eb',
    '672ccb98967c579a82d4f7e1',
    '672ccd2a967c579a82d4f7e8',
    '672ccd60967c579a82d4f7e9',
    '672ccd7f967c579a82d4f7ea',
]

export const projectsData: ProjectModel[] = [
    {
        name: 'DevGlobal LLC Web App', status: 'Pending', progress: 23,
        startDate, deadline, team: [], attachments: [], description,
        logo: '1731024594378_bestblogdesigntemplate.png',
    },
    {
        name: 'DevGlobal LLC Mobile App', status: 'Pending', progress: 62,
        startDate, deadline, description,
        logo: '1731026355406_012.png',
        team: [team[0], team[1]],
        attachments: [attachments[0], attachments[1],]

    },
    {
        name: 'DevGlobal LLC Desktop App', status: 'In Progress', progress: 92,
        startDate, deadline, team, attachments, description,
        logo: '1731026479790_zoeyshen_dashboard3_2x.png',

    },
    {
        name: 'Web Project', status: 'Completed', progress: 100,
        startDate, deadline, team, attachments, description,
        logo: '1731024594378_bestblogdesigntemplate.png',
    },
    {
        name: 'Mobile Project', status: 'Completed', description, progress: 100,
        startDate, deadline, team, attachments,
        logo: '1731026355406_012.png',
    },
    {
        name: 'Design Project', status: 'In Review', progress: 78,
        startDate, deadline, team, attachments, description,
        logo: '1731026479790_zoeyshen_dashboard3_2x.png',
    },
    {
        name: 'Web Project', status: 'In Review', progress: 34,
        startDate, deadline, team, attachments, description,
        logo: '1731024594378_bestblogdesigntemplate.png',
    },
    {
        name: 'Mobile Project', status: 'In Progress', description, progress: 56,
        startDate, deadline, team, attachments,
        logo: '1731026355406_012.png',
    },
    {
        name: 'Design Project', status: 'Pending', progress: 89,
        startDate, deadline, team, attachments, description,
        logo: '1731026479790_zoeyshen_dashboard3_2x.png',
    },
    {
        name: 'Web Project', status: 'In Progress', progress: 45,
        startDate, deadline, team, attachments, description,
        logo: '1731024594378_bestblogdesigntemplate.png',
    },
];

