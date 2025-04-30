import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../middleware/catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { RequestWithUser } from '../types';

export const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const tours = await db('tours')
    .join('locations', 'tours.location_id', '=', 'locations.id')
    .select(
      'tours.*',
      'locations.name as location_name',
      'locations.description as location_description',
      'locations.image_url as location_image',
    );

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

export const getTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const tour = await db('tours')
    .join('locations', 'tours.location_id', '=', 'locations.id')
    .select(
      'tours.*',
      'locations.name as location_name',
      'locations.description as location_description',
      'locations.image_url as location_image',
    )
    .where('tours.id', id)
    .first();

  if (!tour) {
    return next(new ErrorHandler(`No tour found with ID: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

export const createTour = catchAsync(async (req: RequestWithUser, res: Response) => {
  console.log(req.body);
  const { title, description, price, duration, max_group_size, difficulty, location_id, image } =
    req.body;

  // Insert tour into database
  const [newTour] = await db('tours')
    .insert({
      title,
      description,
      price,
      duration,
      max_group_size,
      difficulty,
      image_url: image,
      location_id,
    })
    .returning('*');

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

export const updateTour = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if tour exists
    const existingTour = await db('tours').where('id', id).first();
    if (!existingTour) {
      return next(new ErrorHandler(`No tour found with ID: ${id}`, 404));
    }

    // Update tour
    const [updatedTour] = await db('tours')
      .where('id', id)
      .update({
        ...req.body,
        updated_at: new Date(),
      })
      .returning('*');

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  },
);

export const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Check if tour exists
  const existingTour = await db('tours').where('id', id).first();
  if (!existingTour) {
    return next(new ErrorHandler(`No tour found with ID: ${id}`, 404));
  }

  // Delete tour
  await db('tours').where('id', id).del();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
