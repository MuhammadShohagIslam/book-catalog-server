import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';
import { AuthService } from './auth.service';
import { ILoginUserResponse } from '../../../interfaces/common';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../user/user.interface';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await AuthService.createUser(userData);

    responseReturn<ILoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  }
);

const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await AuthService.loginUser(userData);

    responseReturn<ILoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged successfully!',
      data: result,
    });
  }
);

const getUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.user as JwtPayload;

    const result = await AuthService.getUser(userData);

    responseReturn<IUser | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User get successfully!',
      data: result,
    });
  }
);

export const AuthUserController = {
  createUser,
  loginUser,
  getUser
};
