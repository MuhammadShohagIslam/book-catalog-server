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
  const isUserExit = await User.findOne({email: user?.email});
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
      userId: result._id,
      email: result.email,
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
  const isUserExit = await User.isUserExit(email);
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
      userId: isUserExit._id,
      email: isUserExit.email,
      role: isUserExit.role,
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
  const result = await User.findById({ _id: userId }, { password: 0 });

  return result;
};

export const AuthService = {
  createUser,
  loginUser,
  getUser,
};
