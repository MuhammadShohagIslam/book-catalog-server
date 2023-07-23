/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { ILoginUserResponse } from '../../../interfaces/common';

const createUser = async (user: IUser): Promise<ILoginUserResponse | null> => {
  // check user already exit, if exit return error
  const isUserExit = await User.findOne({ email: user?.email });
  if (isUserExit) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exit!');
  }

  const result = await User.create(user);

  // if user not create return error
  if (!result) {
    throw new ApiError(400, 'Failed to create user!');
  }

  const accessToken = jwtHelpers.createToken(
    {
      name: result.name,
      email: result.email,
      userId: result._id,
      role: result.role,
    },
    config.jwt_secret as Secret,
    config.jwt_expire_in as string
  );
  return {
    accessToken,
  };
};

const loginUser = async (user: IUser): Promise<ILoginUserResponse> => {
  const { password, email } = user;

  // check user already exit, if exit return error
  const isUserExit = await User.findOne({ email: email }).select('+password');

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exit!');
  }
  //compare the password
  const isPasswordMatch = await User.isPasswordMatched(
    isUserExit.password,
    password
  );

  if (!isPasswordMatch && password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is not match!');
  }

  const accessToken = jwtHelpers.createToken(
    {
      name: isUserExit.name,
      email: isUserExit.email,
      role: isUserExit.role,
      userId: isUserExit._id,
    },
    config.jwt_secret as Secret,
    config.jwt_expire_in as string
  );

  return {
    accessToken,
  };
};

const getUser = async (user: JwtPayload): Promise<IUser | null> => {
  const { userId } = user;
  const result = await User.findById({ _id: userId }, { password: 0 })
    .populate('wishList.bookId')
    .populate('readSoonBook.bookId')
    .populate('completedReadBook.bookId');

  return result;
};

const addWishListBook = async (user: JwtPayload, id: string) => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }

  const isWishListExit = await User.findOne({ 'wishList.bookId': id });

  if (isWishListExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not wish list!');
  }
  const result = await User.findOneAndUpdate(
    { _id: user?.userId },
    {
      $push: {
        wishList: {
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

const deleteBookFromWishlist = async (user: JwtPayload, wishListId: string) => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }

  const result = await User.findOneAndUpdate(
    { _id: user?.userId },
    {
      $pull: {
        wishList: {
          _id: wishListId,
        },
      },
    },
    {
      new: true,
    }
  );
  return result;
};
const addReadSoonBookBook = async (user: JwtPayload, bookId: string) => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }

  const isWishListExit = await User.findOne({ 'readSoonBook.bookId': bookId });

  if (isWishListExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not read soon list!');
  }

  const result = await User.findOneAndUpdate(
    { _id: user?.userId },
    {
      $push: {
        readSoonBook: {
          bookId: bookId,
        },
      },
    },
    {
      new: true,
    }
  );
  return result;
};

const deleteBookFromReadSoonBook = async (
  user: JwtPayload,
  readSoonId: string
) => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }
  const result = await User.findOneAndUpdate(
    { 'readSoonBook._id': readSoonId },
    {
      $pull: {
        readSoonBook: {
          _id: readSoonId,
        },
      },
    },
    {
      new: true,
    }
  );
  return result;
};
const addCompleteReadSoonBookBook = async (
  user: JwtPayload,
  bookId: string
) => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }

  const isWishListExit = await User.findOne({
    'completedReadBook.bookId': bookId,
  });

  if (isWishListExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not complete book list!');
  }

  const result = await User.findOneAndUpdate(
    { _id: user?.userId },
    {
      $push: {
        completedReadBook: {
          bookId: bookId,
        },
      },
    },
    {
      new: true,
    }
  );
  return result;
};

const deleteBookFromCompleteReadSoonBookBook = async (
  user: JwtPayload,
  bookId: string
) => {
  const isUserExit = await User.findById({ _id: user?.userId });

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
  }

  const result = await User.findOneAndUpdate(
    { 'completedReadBook._id': bookId },
    {
      $pull: {
        completedReadBook: {
          _id: bookId,
        },
      },
    },
    {
      new: true,
    }
  );
  return result;
};

export const AuthService = {
  createUser,
  loginUser,
  getUser,
  addWishListBook,
  deleteBookFromWishlist,
  addReadSoonBookBook,
  deleteBookFromReadSoonBook,
  deleteBookFromCompleteReadSoonBookBook,
  addCompleteReadSoonBookBook,
};
