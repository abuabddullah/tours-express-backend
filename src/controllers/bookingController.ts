import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../middleware/catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { RequestWithUser } from '../types';

export const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await db('bookings')
    .join('tours', 'bookings.tour_id', '=', 'tours.id')
    .join('users', 'bookings.user_id', '=', 'users.id')
    .select(
      'bookings.*',
      'tours.title as tour_title',
      'tours.price as tour_price',
      'users.name as user_name',
      'users.email as user_email',
    );

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

export const getBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const booking = await db('bookings')
    .join('tours', 'bookings.tour_id', '=', 'tours.id')
    .join('users', 'bookings.user_id', '=', 'users.id')
    .select(
      'bookings.*',
      'tours.title as tour_title',
      'tours.price as tour_price',
      'users.name as user_name',
      'users.email as user_email',
    )
    .where('bookings.id', id)
    .first();

  if (!booking) {
    return next(new ErrorHandler(`No booking found with ID: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

export const createBooking = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { tour_id, booking_date } = req.body;

    if (!req.user) {
      return next(new ErrorHandler('You must be logged in to create a booking', 401));
    }

    // Check if tour exists
    const tour = await db('tours').where('id', tour_id).first();
    if (!tour) {
      return next(new ErrorHandler(`No tour found with ID: ${tour_id}`, 404));
    }

    // Create booking
    const [newBooking] = await db('bookings')
      .insert({
        tour_id,
        user_id: req.user.id,
        booking_date,
        status: 'pending',
      })
      .returning('*');

    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking,
      },
    });
  },
);

export const updateBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check if booking exists
  const existingBooking = await db('bookings').where('id', id).first();
  if (!existingBooking) {
    return next(new ErrorHandler(`No booking found with ID: ${id}`, 404));
  }

  // Update booking
  const [updatedBooking] = await db('bookings')
    .where('id', id)
    .update({
      status,
      updated_at: new Date(),
    })
    .returning('*');

  res.status(200).json({
    status: 'success',
    data: {
      booking: updatedBooking,
    },
  });
});

export const deleteBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Check if booking exists
  const existingBooking = await db('bookings').where('id', id).first();
  if (!existingBooking) {
    return next(new ErrorHandler(`No booking found with ID: ${id}`, 404));
  }

  // Delete booking
  await db('bookings').where('id', id).del();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getMyBookings = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('You must be logged in to view your bookings', 401));
    }

    const bookings = await db('bookings')
      .join('tours', 'bookings.tour_id', '=', 'tours.id')
      .select(
        'bookings.*',
        'tours.title as tour_title',
        'tours.price as tour_price',
        'tours.image_url as tour_image',
      )
      .where('bookings.user_id', req.user.id);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings,
      },
    });
  },
);
