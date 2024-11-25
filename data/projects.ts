import ProjectModel, { ProjectMemberModel } from "@model/project";

const deadline = "2024-12-31T00:01:00.000+00:00";
const startDate = "2024-11-01T00:01:00.000+00:00";
const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum maximus ultrices. Curabitur et neque felis.';

const attachments: string[] = [
    "1731028575131_66d482b0d3f02abd9286f170_5_figma_thumbnail_kit.jpg",
    "1731026975069_dummy.pdf",
    "1731026975069_sample.pdf",
    "1731026975068_dummydummy.pdf",
    "1731026975069_dummypdf_2.pdf"
]

const team: string[] = [
    '6731333aa0c2d19c5a63a4f6', //John User
    '6731336160eae970e7274e01',//Mary User
    '6731331842c798a8438d88b4',//Jimmy User
    '67313380a92e9bc1801d1819',//Patrick User
    '673133994008aec6fe604324',//Cory User
    '673370719910eac38ce5d7c3',//Omar User
]

export const projectsData: ProjectModel[] = [
    {
        name: 'Dummy DevGlobal Project', status: 'In Progress', progress: 10,
        startDate, deadline, attachments: [], description, team: [team[0]],
        logo: '1731028575131_66d482b0d3f02abd9286f170_5_figma_thumbnail_kit.jpg',
    },
    {
        name: 'DevGlobal LLC Web App', status: 'Pending', progress: 0,
        startDate, deadline, description,
        logo: '1731024594378_bestblogdesigntemplate.png',
        team: [team[0], team[1]], attachments: [attachments[0], attachments[1],],
    },
    {
        name: 'DevGlobal LLC Mobile App', status: 'Completed', progress: 100,
        startDate, deadline, description,
        logo: '1731026355406_012.png',
        team: [team[0], team[1]],
        attachments: [attachments[0], attachments[1]]
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
        name: 'Mobile Project', status: 'Pending', progress: 0,
        startDate, deadline, team, attachments, description,
        logo: '1731026355406_012.png',
    },
    {
        name: 'Design Project', status: 'In Review', progress: 78,
        startDate, deadline, team, attachments, description,
        logo: '1731026479790_zoeyshen_dashboard3_2x.png',
    },
];

