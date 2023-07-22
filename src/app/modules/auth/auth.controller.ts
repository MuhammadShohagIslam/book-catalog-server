/* eslint-disable @typescript-eslint/no-explicit-any */
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

const addWishListBook = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user as JwtPayload;
  const { bookId } = req.body;
  const result = await AuthService.addWishListBook(userData, bookId);
  responseReturn<IUser | null | any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Wish List Book successfully!',
    data: result,
  });
});

const deleteBookFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userData = req.user as JwtPayload;
    const { bookId } = req.body;

    const result = await AuthService.deleteBookFromWishlist(
      userData,
      bookId
    );
    responseReturn<IUser | null | any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Wish List Book deleted successfully!',
      data: result,
    });
  }
);

const addReadSoonBookBook = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user as JwtPayload;
  const { bookId } = req.body;
  const result = await AuthService.addReadSoonBookBook(userData, bookId);
  responseReturn<IUser | null | any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Read Soon Book successfully!',
    data: result,
  });
});

const deleteBookFromReadSoonBook = catchAsync(
  async (req: Request, res: Response) => {
    const userData = req.user as JwtPayload;
    const { bookId } = req.body;
    const result = await AuthService.deleteBookFromReadSoonBook(
      userData,
      bookId
    );
    responseReturn<IUser | null | any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Add Read Soon Book deleted successfully!',
      data: result,
    });
  }
);

const addCompleteReadSoonBookBook = catchAsync(
  async (req: Request, res: Response) => {
    const userData = req.user as JwtPayload;
    const { bookId } = req.body;
    const result = await AuthService.addCompleteReadSoonBookBook(
      userData,
      bookId
    );
    responseReturn<IUser | null | any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Add Complete Read Soon Book successfully!',
      data: result,
    });
  }
);

const deleteBookFromCompleteReadSoonBookBook = catchAsync(
  async (req: Request, res: Response) => {
    const userData = req.user as JwtPayload;
    const { bookId } = req.body;

    const result = await AuthService.deleteBookFromCompleteReadSoonBookBook(userData, bookId);
    responseReturn<IUser | null | any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete complete Read Soon Book successfully!',
      data: result,
    });
  }
);

export const AuthUserController = {
  createUser,
  loginUser,
  getUser,
  addWishListBook,
  deleteBookFromWishlist,
  addReadSoonBookBook,
  deleteBookFromReadSoonBook,
  addCompleteReadSoonBookBook,
  deleteBookFromCompleteReadSoonBookBook,
};
