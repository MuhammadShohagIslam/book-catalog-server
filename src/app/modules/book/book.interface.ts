import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IBook = {
  title: string;
  image:string;
  genre: string;
  author: Types.ObjectId | IUser;
  publicationDate?: Date;
  reviews: {
    name: string;
    email: string;
    review: string;
    bookId: string;
  };
};

export type IReview = {
  name: string;
  email: string;
  review: string;
  bookId: string;
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type BookFilterOptionType = {
  searchTerm?: string | undefined;
};
