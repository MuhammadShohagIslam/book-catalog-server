import express from 'express';
import { BookController } from './book.controller';
import { BookValidation } from './book.validation';
import validateRequest from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.USER),
    validateRequest(BookValidation.createBookZodSchema),
    BookController.createBook
  )
  .get(BookController.getAllBooks);

router
  .route('/:id')
  .get(BookController.getSingleBook)
  .patch(
    auth(ENUM_USER_ROLE.USER),
    validateRequest(BookValidation.updateBookZodSchema),
    BookController.updateBook
  )
  .delete(auth(ENUM_USER_ROLE.USER), BookController.deleteBook);

// Review Routers
router.post(
  '/reviews',
  auth(ENUM_USER_ROLE.USER),
  BookController.createBookReview
);
router
  .route('/reviews/:id')
  .delete(auth(ENUM_USER_ROLE.USER), BookController.deleteBookReview);

export const BookRoutes = router;
