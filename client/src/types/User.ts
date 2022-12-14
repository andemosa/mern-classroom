export interface IUser {
  email: string;
  name: string;
  password: string;
}

export interface IProfile {
  _id: string;
  email: string;
  name: string;
  educator: boolean;
  createdAt: string;
  updatedAt: string;
}
