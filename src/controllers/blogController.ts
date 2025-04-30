import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../middleware/catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { RequestWithUser } from '../types';

export const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const blogs = await db('blogs')
    .join('users', 'blogs.created_by', '=', 'users.id')
    .select('blogs.*', 'users.name as author_name');

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

export const getBlog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const blog = await db('blogs')
    .join('users', 'blogs.created_by', '=', 'users.id')
    .select('blogs.*', 'users.name as author_name')
    .where('blogs.id', id)
    .first();

  if (!blog) {
    return next(new ErrorHandler(`No blog found with ID: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

export const createBlog = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { title, description, image_url } = req.body;

    if (!req.user) {
      return next(new ErrorHandler('You must be logged in to create a blog', 401));
    }



    // Insert blog into database
    const [newBlog] = await db('blogs')
      .insert({
        title,
        description,
        image_url: image_url,
        created_by: req.user.id,
      })
      .returning('*');

    res.status(201).json({
      status: 'success',
      data: {
        blog: newBlog,
      },
    });
  },
);

export const updateBlog = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!req.user) {
      return next(new ErrorHandler('You must be logged in to update a blog', 401));
    }

    // Check if blog exists
    const existingBlog = await db('blogs').where('id', id).first();
    if (!existingBlog) {
      return next(new ErrorHandler(`No blog found with ID: ${id}`, 404));
    }

    // Check if user is the author or an admin
    if (existingBlog.created_by !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler('You are not authorized to update this blog', 403));
    }

    

    // Update blog
    const [updatedBlog] = await db('blogs')
      .where('id', id)
      .update({
        ...req.body,
        updated_at: new Date(),
      })
      .returning('*');

    res.status(200).json({
      status: 'success',
      data: {
        blog: updatedBlog,
      },
    });
  },
);

export const deleteBlog = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!req.user) {
      return next(new ErrorHandler('You must be logged in to delete a blog', 401));
    }

    // Check if blog exists
    const existingBlog = await db('blogs').where('id', id).first();
    if (!existingBlog) {
      return next(new ErrorHandler(`No blog found with ID: ${id}`, 404));
    }

    // Check if user is the author or an admin
    if (existingBlog.created_by !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler('You are not authorized to delete this blog', 403));
    }

    // Delete blog
    await db('blogs').where('id', id).del();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);
