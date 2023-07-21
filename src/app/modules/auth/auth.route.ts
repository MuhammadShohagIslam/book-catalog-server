import express from 'express';
import { AuthUserController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthUserValidation } from './auth.validation';
import { auth } from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthUserValidation.createUserZodSchema),
  AuthUserController.createUser
);

router.post(
  '/login',
  validateRequest(AuthUserValidation.loginZodSchema),
  AuthUserController.loginUser
);

router.get('/get-user', auth(ENUM_USER_ROLE.USER), AuthUserController.getUser);

router.post(
  '/wishlist',
  auth(ENUM_USER_ROLE.USER),
  AuthUserController.addWishListBook
);
router
  .route('/wishlist/:id')
  .delete(auth(ENUM_USER_ROLE.USER), AuthUserController.deleteBookFromWishlist);

router.post(
  '/reading-soon',
  auth(ENUM_USER_ROLE.USER),
  AuthUserController.addReadSoonBookBook
);
router
  .route('/reading-soon/:id')
  .delete(
    auth(ENUM_USER_ROLE.USER),
    AuthUserController.deleteBookFromReadSoonBook
  );

router.post(
  '/read-completed',
  auth(ENUM_USER_ROLE.USER),
  AuthUserController.addCompleteReadSoonBookBook
);
router
  .route('/read-completed/:id')
  .delete(
    auth(ENUM_USER_ROLE.USER),
    AuthUserController.deleteBookFromCompleteReadSoonBookBook
  );

export const AuthRoutes = router;
