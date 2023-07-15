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

export const AuthRoutes = router;
