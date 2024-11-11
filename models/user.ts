type UserModel = {
  id: string;
  email: string;
  avatar: string | null;
  role: "admin" | "user";
  name: { first: string; last: string; second?: string };
};

export default UserModel;
