/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { PaginationOptionsType } from '../../../interfaces/pagination';
import User from '../user/user.model';
import { bookSearchableFields } from './book.constant';
import { BookFilterOptionType, IBook, IReview } from './book.interface';
import Book from './book.model';
import { JwtPayload } from 'jsonwebtoken';

const createBook = async (
  userPayload: JwtPayload,
  payload: IBook
): Promise<IBook> => {
  const isUser = await User.findOne({ email: userPayload.email });
  if (!isUser) {
    throw new ApiError(httpStatus.CONFLICT, 'You are not user!');
  }

  const result = await Book.create(payload);
  return result;
};

const getAllBooks = async (
  paginationOption: PaginationOptionsType,
  filters: BookFilterOptionType
): Promise<IGenericResponse<IBook[] | null>> => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculationPagination(paginationOption);
  const { searchTerm, ...filtersData } = filters;
  const sortCondition: { [key: string]: SortOrder } = {};

  const addCondition = [];

  // for searchable filters

  if (searchTerm) {
    addCondition.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    addCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereCondition = addCondition.length > 0 ? { $and: addCondition } : {};

  const result = await Book.find(whereCondition)
    .populate('author')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const count = await Book.countDocuments();

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleBook = async (data: string): Promise<IBook | null> => {
  const result = await Book.findById({ _id: data }).populate('author');
  return result;
};

const updateBook = async (
  id: string,
  user: JwtPayload,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }

  const isExitBook = await Book.findOne({ _id: id }).populate('author');

  if (!isExitBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }
  const result = await Book.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteBook = async (
  user: JwtPayload,
  id: string
): Promise<IBook | null> => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }
  const result = await Book.findOneAndDelete({
    $and: [{ _id: id }, { 'author.authorId': user?.userId }],
  });
  return result;
};

/* Comment Service Start */
const createBookReview = async (
  user: JwtPayload,
  id: string,
  data: IReview
) => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }

  const result = await Book.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        reviews: {
          name: data.name,
          email: data.email,
          review: data.review,
          bookId: id,
        },
      },
    },
    {
      new: true,
    }
  );
  return result;
};
// const updateBookReview = async (id: string, data: IReview) => {

//   const comment = await Book.findOneAndUpdate(
//     { 'reviews._id': id },
//     {
//       $set: {
//         'comments.$.status': data?.status,
//       },
//     },
//     {
//       new: true,
//     }
//   )
//   return comment
// }

const deleteBookReview = async (id: string) => {
  const result = await Book.findOneAndUpdate(
    { 'reviews._id': id },
    {
      $pull: {
        reviews: {
          _id: id,
        },
      },
    },
    {
      new: true,
    }
  );
  return result;
};
/* Review Service End */

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  createBookReview,
  deleteBookReview,
};
