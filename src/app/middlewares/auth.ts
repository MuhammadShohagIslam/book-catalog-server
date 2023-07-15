import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

export const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization?.split(' ')?.[1];
      if (!token) {
        new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
      }

      // verified user
      const verifiedUser = jwtHelpers.verifyToken(
        token as string,
        config.jwt_secret as Secret
      );

      // store user to request as property
      req.user = verifiedUser;

      // checking authorization
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser?.role)) {
        new ApiError(httpStatus.FORBIDDEN, 'Forbidden user!');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
