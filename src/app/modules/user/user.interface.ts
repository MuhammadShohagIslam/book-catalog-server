/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserRoleType = 'user'

export type IUser = {
  _id: string;
  name: string;
  email:string;
  password: string;
  role: UserRoleType;
};

export type UserModel = {
  isUserExit(
    email: string
  ): Promise<Pick<IUser, 'email' | 'name' | 'role' | '_id' | "password"> | null>;
  isPasswordMatched(
    savedPassword: string,
    givenPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type ILoginResponse = {
  accessToken: string;
};

export type UserFilterOptionType = {
  searchTerm?: string;
};
