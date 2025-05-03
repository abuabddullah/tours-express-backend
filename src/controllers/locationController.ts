import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../middleware/catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { RequestWithUser } from '../types';

export const getAllLocations = catchAsync(async (req: Request, res: Response) => {
  const locations = await db('locations').select('*');

  res.status(200).json({
    status: 'success',
    results: locations.length,
    data: {
      locations,
    },
  });
});

export const getLocation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const location = await db('locations').where('id', id).first();

  if (!location) {
    return next(new ErrorHandler(`No location found with ID: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      location,
    },
  });
});

export const createLocation = catchAsync(async (req: RequestWithUser, res: Response) => {
  console.log(req.body);
  const { name, description, image_url } = req.body;

  // Insert location into database
  const [newLocation] = await db('locations')
    .insert({
      name,
      description,
      image_url: image_url,
    })
    .returning('*');

  res.status(201).json({
    status: 'success',
    data: {
      location: newLocation,
    },
  });
});

export const updateLocation = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if location exists
    const existingLocation = await db('locations').where('id', id).first();
    if (!existingLocation) {
      return next(new ErrorHandler(`No location found with ID: ${id}`, 404));
    }

    // Update location
    const [updatedLocation] = await db('locations')
      .where('id', id)
      .update({
        ...req.body,
        updated_at: new Date(),
      })
      .returning('*');

    res.status(200).json({
      status: 'success',
      data: {
        location: updatedLocation,
      },
    });
  },
);

export const deleteLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;


    // Check if location is referenced by tours
    const relatedTours = await db('tours').where('location_id', id).first();
    if (relatedTours) {

      return next(
        new ErrorHandler('Cannot delete location because it is referenced by tours', 400),
      );
    }

    // Check if location exists
    const existingLocation = await db('locations').where('id', id).first();
    if (!existingLocation) {
      return next(new ErrorHandler(`No location found with ID: ${id}`, 404));
    }

    // Delete location
    const response = await db('locations').where('id', id).del();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);
