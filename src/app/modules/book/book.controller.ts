import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import responseReturn from '../../../shared/responseReturn';
import { bookFilterableFields } from './book.constant';
import { IBook } from './book.interface';
import { BookService } from './book.service';
import { JwtPayload } from 'jsonwebtoken';

const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...bookData } = req.body;
    const userData = req.user as JwtPayload;
    const result = await BookService.createBook(userData, bookData);

    if (!result) {
      throw new ApiError(400, 'Failed to Create Book!');
    }
    responseReturn<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book created successfully!',
      data: result,
    });
  }
);

const getAllBooks: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, bookFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await BookService.getAllBooks(paginationOptions, filters);

    responseReturn<IBook[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Books retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BookService.getSingleBook(id);

    responseReturn<IBook | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrieved successfully!',
      data: result,
    });
  }
);

const updateBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userData = req.user as JwtPayload;
    const { ...updatedData } = req.body;

    const result = await BookService.updateBook(id, userData, updatedData);

    responseReturn<IBook | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book updated successfully!',
      data: result,
    });
  }
);

const deleteBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userData = req.user as JwtPayload;
    const id = req.params.id;
    const result = await BookService.deleteBook(userData, id);
    responseReturn<IBook | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book deleted successfully!',
      data: result,
    });
  }
);

/* Review Controller Start */
const createBookReview = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user as JwtPayload;
  const { bookId, ...reviewData } = req.body;
  const result = await BookService.createBookReview(
    userData,
    bookId,
    reviewData
  );
  responseReturn<IBook | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book reviewed successfully!',
    data: result,
  });
});

// const updateBookReview = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const body = req.body;
//   const result = await BookService.updateBookReview(id, body);
//   responseReturn<IBook | null>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Book review updated successfully!',
//     data: result,
//   });
// });

const deleteBookReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookService.deleteBookReview(id);
  responseReturn<IBook | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book review deleted successfully!',
    data: result,
  });
});
/* Review Controller End */

export const BookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  createBookReview,
  // updateBookReview,
  deleteBookReview,
};
