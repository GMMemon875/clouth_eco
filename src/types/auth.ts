export type UserRole = 'user' | 'admin';

export interface IUserAddress {
  address: string;
  city: string;
  area?: string;
  landmark?: string;
}

export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address?: IUserAddress;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginResponse {
  success: boolean;
  message?: string;
  data: {
    user: IUser;
    token: string;
  };
}

export interface IRegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  address: string;
  city: string;
  area?: string;
  landmark?: string;
}
