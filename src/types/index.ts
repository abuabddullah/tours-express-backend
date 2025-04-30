import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: number;
  tour_id: number;
  user_id: number;
  booking_date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface MetaTag {
  id: number;
  title: string;
  description: string;
  keywords: string;
  page_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface Tour {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  max_group_size: number;
  difficulty: string;
  rating_average: number;
  rating_quantity: number;
  image_url: string;
  location_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ApiError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
}

export interface TokenData {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export interface RequestWithUser extends Request {
  user?: TokenData;
  file?: Express.Multer.File;
}
