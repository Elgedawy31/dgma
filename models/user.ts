import { UserBase } from './types';

// UserModel extends UserBase with additional fields
type UserModel = UserBase & {
    email: string;
    role: "admin" | "user";
    // Add any other user-specific fields here
};

export default UserModel;
