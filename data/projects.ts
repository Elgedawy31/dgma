import ProjectModel, { ProjectAttachmentModel, ProjectMemberModel } from "@model/project";

const createdAt = '2021-08-10';
const updatedAt = '2021-08-12';
const deadline = "2024-09-13T16:47:13.534Z";
const startDate = "2024-09-13T16:47:13.534Z";
const createdBy = { _id: '1', email: '', name: { first: 'John', last: 'Doe' } };
const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum maximus ultrices. Curabitur et neque felis. Donec aliquam sapien sed leo egestas porttitor. Morbi faucibus nec ante a dapibus.';

const attachments: ProjectAttachmentModel[] = [
    { _id: '1', name: 'Project Requirements', size: 10, type: 'pdf' },
    { _id: '2', name: 'Project Report', size: 8, type: 'pdf' },
    { _id: '3', name: 'Project Design', size: 12, type: 'image' },
    { _id: '4', name: 'Project Video', size: 20, type: 'image' },
    { _id: '5', name: 'Project Audio', size: 15, type: 'pdf' },
    { _id: '6', name: 'Project Video', size: 2, type: 'image' },
]

const team: ProjectMemberModel[] = [{
    _id: "1", name: { first: "John", last: "Doe" },
    email: "JohnDoe@gmail.com", specialty: 'Frontend Developer',
    avatar: "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
},
{
    _id: "2", name: { first: "Mary", last: "McKinney" },
    email: "MaryMcKinney@gmail", specialty: 'UI UX Designer',
    avatar: "https://images.squarespace-cdn.com/content/v1/5cb74196f8135a3abbc8f25f/1673914262865-TF2D05LE7I6MXEDOK4BV/IMG_6816.jpg"
},
{
    _id: "3", name: { first: "Patrick", last: "House" },
    email: "PatrickHouse@gmail", specialty: 'Backend Developer',
    avatar: "https://mir-s3-cdn-cf.behance.net/user/276/8051fa194165537.614d528de211b.jpg"
},
{
    _id: "4", name: { first: "Cory", last: "House" },
    email: "CoryHouse@gmail", specialty: 'Graphic Designer',
    avatar: "https://writestylesonline.com/wp-content/uploads/2017/04/Brunching-In-Style-1024x1024.jpg"
},

]

 export const projectsData: ProjectModel[] = [
    {
        _id: '1', name: 'DevGlobal LLC Web App', status: 'pending', progress: 23,
        startDate, deadline, createdAt, updatedAt, createdBy, team: [], attachments: [], description,
        logo: 'https://images.creativetemplate.net/wp-content/uploads/2018/03/Best-Blog-Design-Template.png',
    },
    {
        _id: '2', name: 'DevGlobal LLC Mobile App', status: 'cancelled', progress: 62,
        startDate, deadline, createdAt, updatedAt, createdBy, description,
        logo: 'https://cdn.dribbble.com/users/1435588/screenshots/4825006/012.png',
        team: [team[0], team[1]],
        attachments: [attachments[0], attachments[1],]

    },
    {
        _id: '3', name: 'DevGlobal LLC Desktop App', status: 'progress', progress: 92,
        startDate, deadline, createdAt, updatedAt, createdBy, team, attachments, description,
        logo: 'https://cdn.dribbble.com/users/827126/screenshots/6485455/zoeyshen_dashboard3_2x.png',

    },
    {
        _id: '4', name: 'Web Project', status: 'completed', progress: 27,
        startDate, deadline, team, attachments, createdAt, updatedAt, createdBy, description,
        logo: 'https://images.creativetemplate.net/wp-content/uploads/2018/03/Best-Blog-Design-Template.png',
    },
    {
        _id: '5', name: 'Mobile Project', status: 'completed', description, progress: 45,
        startDate, deadline, team, attachments, createdAt, updatedAt, createdBy,
        logo: 'https://cdn.dribbble.com/users/1435588/screenshots/4825006/012.png',
    },
    {
        _id: '6', name: 'Design Project', status: 'review', progress: 78,
        startDate, deadline, team, attachments, createdAt, updatedAt, createdBy, description,
        logo: 'https://cdn.dribbble.com/users/827126/screenshots/6485455/zoeyshen_dashboard3_2x.png',
    },
    {
        _id: '7', name: 'Web Project', status: 'review', progress: 34,
        startDate, deadline, team, attachments, createdAt, updatedAt, createdBy, description,
        logo: 'https://images.creativetemplate.net/wp-content/uploads/2018/03/Best-Blog-Design-Template.png',
    },
    {
        _id: '8', name: 'Mobile Project', status: 'progress', description, progress: 56,
        startDate, deadline, team, attachments, createdAt, updatedAt, createdBy,
        logo: 'https://cdn.dribbble.com/users/1435588/screenshots/4825006/012.png',
    },
    {
        _id: '9', name: 'Design Project', status: 'overdue', progress: 89,
        startDate, deadline, team, attachments, createdAt, updatedAt, createdBy, description,
        logo: 'https://cdn.dribbble.com/users/827126/screenshots/6485455/zoeyshen_dashboard3_2x.png',
    },
    {
        _id: '10', name: 'Web Project', status: 'progress', progress: 45,
        startDate, deadline, team, attachments, createdAt, updatedAt, createdBy, description,
        logo: 'https://images.creativetemplate.net/wp-content/uploads/2018/03/Best-Blog-Design-Template.png',
    },
];

