type UserModel = {
    _id?: string,
    email: string,
    specialty: string,
    avatar: string | null,
    name: { first: string, last: string, second?: string },
}

export default UserModel;
