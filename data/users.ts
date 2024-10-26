import UserModel from "@model/user";

export const usersData: UserModel[] = [
    {
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
