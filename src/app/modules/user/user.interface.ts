/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';

export type UserRoleType = 'user';

export type IUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
  wishList: {
    bookId: Types.ObjectId | IBook;
  };
  completedReadBook: {
    bookId: Types.ObjectId | IBook;
  };
  readSoonBook: {
    bookId: Types.ObjectId | IBook;
  };
};

export type UserModel = {
  isUserExit(
    email: string
  ): Promise<Pick<
    IUser,
    'email' | 'name' | 'role' | '_id' | 'password'
  > | null>;
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
