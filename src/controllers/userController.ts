import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { catchAsync } from '../middleware/catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { User, RequestWithUser } from '../types';

const signToken = (id: number, role: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as jwt.SignOptions['expiresIn']
  };
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', options);
};

const createSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user.id, user.role);

  // Remove password from output
  const { password: _, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userWithoutPassword,
    },
  });
};

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await db('users').where('email', email).first();
  if (existingUser) {
    return next(new ErrorHandler('User already exists with that email', 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const [newUser] = await db('users')
    .insert({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
    })
    .returning('*');

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  // Check if user exists and password is correct
  const user = await db('users').where('email', email).first();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ErrorHandler('Incorrect email or password', 401));
  }

  // If everything is ok, send token to client
  createSendToken(user, 200, res);
});

export const getMe = catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ErrorHandler('You are not logged in', 401));
  }

  const user = await db('users').where('id', req.user.id).first();

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Remove password from output
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  res.status(200).json({
    status: 'success',
    data: {
      user: userWithoutPassword,
    },
  });
});

export const updateMe = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('You are not logged in', 401));
    }

    const { name, email } = req.body;

    // Check if user is trying to update password
    if (req.body.password) {
      return next(
        new ErrorHandler('This route is not for password updates. Please use /updatePassword', 400),
      );
    }

    // Update user
    const [updatedUser] = await db('users')
      .where('id', req.user.id)
      .update({
        name,
        email,
        updated_at: new Date(),
      })
      .returning('*');

    if (!updatedUser) {
      return next(new ErrorHandler('User not found', 404));
    }

    // Remove password from output
    const userWithoutPassword = { ...updatedUser };
    delete userWithoutPassword.password;

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
      },
    });
  },
);

export const updatePassword = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('You are not logged in', 401));
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ErrorHandler('Please provide current and new password', 400));
    }

    // Get user from database
    const user = await db('users').where('id', req.user.id).first();

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    // Check if current password is correct
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return next(new ErrorHandler('Current password is incorrect', 401));
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const [updatedUser] = await db('users')
      .where('id', req.user.id)
      .update({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .returning('*');

    // Log user in, send JWT
    createSendToken(updatedUser, 200, res);
  },
);
