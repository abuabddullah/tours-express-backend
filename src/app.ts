import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/error';

// Routes
import userRoutes from './routes/userRoutes';
import tourRoutes from './routes/tourRoutes';
import bookingRoutes from './routes/bookingRoutes';
import locationRoutes from './routes/locationRoutes';
import blogRoutes from './routes/blogRoutes';

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/blogs', blogRoutes);

// Home route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Tourism API with Knex and PostgreSQL',
  });
});

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
  err.statusCode = 404;
  err.status = 'fail';
  next(err);
});

// Global error handling middleware
app.use(errorHandler);

export default app;
