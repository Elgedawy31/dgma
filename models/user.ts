type UserModel = {
  id: string;
  email: string;
  avatar: string | null;
  role: "admin" | "user";
  name: { first: string; last: string; second?: string };
};
type ChatModal = {
  _id: string;
  photo: string | null;
  type: "channel" | "group";
  role: "admin" | "user";
  name: string ;
};

export  {UserModel , ChatModal};
