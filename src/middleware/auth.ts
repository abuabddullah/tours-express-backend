import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from './catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { RequestWithUser, TokenData } from '../types';

export const protect = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    // 1) Get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorHandler('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenData;

    // 3) Check if user still exists
    const currentUser = await db('users').where('id', decoded.id).first();

    if (!currentUser) {
      return next(new ErrorHandler('The user belonging to this token no longer exists.', 401));
    }

    // 4) Grant access to protected route
    req.user = decoded;
    next();
  },
);

export const restrictTo = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorHandler('You do not have permission to perform this action', 403));
    }
    next();
  };
};
