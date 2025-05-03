# Complete Guide: Converting Express/MongoDB/Mongoose to Express/Knex/PostgreSQL/TypeScript

This step-by-step guide will walk you through converting an Express application with MongoDB/Mongoose to use Knex, PostgreSQL, and TypeScript. This guide is designed for beginners and assumes limited knowledge of these technologies.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Setting Up Neon PostgreSQL Database](#setting-up-neon-postgresql-database)
4. [Installing Dependencies](#installing-dependencies)
5. [TypeScript Configuration](#typescript-configuration)
6. [Setting Up ESLint and Prettier](#setting-up-eslint-and-prettier)
7. [Database Configuration with Knex](#database-configuration-with-knex)
8. [Creating Migrations for Your Models](#creating-migrations-for-your-models)
9. [Converting Models and Controllers](#converting-models-and-controllers)
10. [Setting Up Routes](#setting-up-routes)
11. [Authentication Implementation](#authentication-implementation)
12. [File Upload Handling](#file-upload-handling)
13. [Error Handling](#error-handling)
14. [Testing the API](#testing-the-api)
15. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git (optional, but recommended)
- Postman or similar API testing tool

## Project Setup

1. Create a new project directory and initialize a new Node.js project:

```bash
mkdir tourism-api-knex
cd tourism-api-knex
npm init -y
```

2. Create the basic project structure:

```bash
mkdir -p src/config src/controllers src/database/migrations src/middleware src/routes src/types src/utils uploads
touch .env .gitignore
```

## Setting Up Neon PostgreSQL Database

1. Go to [Neon](https://neon.tech/) and sign up for an account.

2. Create a new project with the following information:
   - Project Name: tourism-api
   - PostgreSQL Version: Latest

3. After creating the project, you'll get a connection string. It should look like:
   ```
   postgresql://testDB_owner:npg_qP2lFHTW4kaV@ep-lively-brook-a4g1nxmk-pooler.us-east-1.aws.neon.tech/testDB?sslmode=require
   ```

4. Add this connection string to your `.env` file in a more structured way:

```
DB_HOST=ep-lively-brook-a4g1nxmk-pooler.us-east-1.aws.neon.tech
DB_USER=testDB_owner
DB_PASSWORD=npg_qP2lFHTW4kaV
DB_NAME=testDB
DB_PORT=5432
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
```

## Installing Dependencies

Install all required dependencies for the project:

```bash
# Main dependencies
npm install express knex pg dotenv cors morgan jsonwebtoken bcryptjs multer express-validator

# Development dependencies
npm install -D typescript ts-node ts-node-dev @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/bcryptjs @types/multer eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

## TypeScript Configuration

1. Create a `tsconfig.json` file at the root of your project:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

2. Add TypeScript scripts to your `package.json`:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "migrate:make": "knex --knexfile src/config/knexfile.ts migrate:make",
  "migrate:latest": "knex --knexfile src/config/knexfile.ts migrate:latest",
  "migrate:rollback": "knex --knexfile src/config/knexfile.ts migrate:rollback"
}
```

## Setting Up ESLint and Prettier

1. Create an `.eslintrc.json` file:

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

2. Create a `.prettierrc` file:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

3. Add linting and formatting scripts to your `package.json`:

```json
"scripts": {
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix",
  "format": "prettier --write \"src/**/*.ts\""
}
```

## Database Configuration with Knex

1. Create a Knex configuration file at `src/config/knexfile.ts`:

```typescript
import dotenv from 'dotenv';
import { Knex } from 'knex';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface KnexConfig {
  [key: string]: Knex.Config;
}

const config: KnexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds'),
      extension: 'ts',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds'),
    },
  },
};

export default config;
```

2. Create a database connection file at `src/config/db.ts`:

```typescript
import knex from 'knex';
import config from './knexfile';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

const db = knex(knexConfig);

export default db;
```

## Creating Migrations for Your Models

Instead of Mongoose schemas, we'll use Knex migrations to define our database schema:

1. Define types for your models in `src/types/index.ts`:

```typescript
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

// Add similar interfaces for other models (Tour, Booking, etc.)
```

2. Create migrations for each model using Knex:

```bash
npm run migrate:make -- create_users_table
npm run migrate:make -- create_locations_table
npm run migrate:make -- create_tours_table
npm run migrate:make -- create_bookings_table
npm run migrate:make -- create_blogs_table
npm run migrate:make -- create_meta_tags_table
```

3. Edit each migration file to define the table structure. For example, `src/database/migrations/[timestamp]_create_users_table.ts`:

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.enum('role', ['admin', 'user']).defaultTo('user');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
```

4. Run the migrations to create the tables in your Neon PostgreSQL database:

```bash
npm run migrate:latest
```

## Converting Models and Controllers

Without Mongoose, we don't need model files. Instead, we'll use Knex queries directly in our controllers:

1. Create controllers for each resource, e.g., `src/controllers/userController.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../middleware/catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { User, RequestWithUser } from '../types';

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await db('users').where('email', email).first();
  if (existingUser) {
    return next(new ErrorHandler('User already exists with that email', 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user using Knex
  const [newUser] = await db('users')
    .insert({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    })
    .returning('*');

  // Create and send JWT
  const token = jwt.sign(
    { id: newUser.id, role: newUser.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Remove password from output
  delete newUser.password;

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

// Add other controller methods (login, getMe, etc.)
```

## Setting Up Routes

Create route files for each resource, e.g., `src/routes/userRoutes.ts`:

```typescript
import express from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me', protect, userController.getMe);
router.patch('/updateMe', protect, userController.updateMe);
router.patch('/updatePassword', protect, userController.updatePassword);

export default router;
```

## Authentication Implementation

Create authentication middleware in `src/middleware/auth.ts`:

```typescript
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from './catchAsync';
import ErrorHandler from '../utils/errorHandler';
import db from '../config/db';
import { RequestWithUser, TokenData } from '../types';

export const protect = catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
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
});

export const restrictTo = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorHandler('You do not have permission to perform this action', 403));
    }
    next();
  };
};
```

## File Upload Handling

Create a middleware for handling file uploads in `src/middleware/upload.ts`:

```typescript
import multer from 'multer';
import path from 'path';
import ErrorHandler from '../utils/errorHandler';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

// Check file type
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
};

// Initialize upload
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: fileFilter,
}).single('image');

// Middleware for handling file uploads
export const uploadMiddleware = (req: Express.Request, res: Express.Response, next: Function) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ErrorHandler('File too large. Max size is 1MB', 400));
      }
      return next(new ErrorHandler(err.message, 400));
    } else if (err) {
      return next(new ErrorHandler(err.message, 400));
    }
    next();
  });
};
```

## Error Handling

Create error handling utilities and middleware in `src/utils/errorHandler.ts` and `src/middleware/error.ts`:

```typescript
// src/utils/errorHandler.ts
import { ApiError } from '../types';

class ErrorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;

// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { error: err, stack: err.stack }),
  });
};
```

## App and Server Configuration

1. Create the main Express app in `src/app.ts`:

```typescript
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
import metaTagRoutes from './routes/metaTagRoutes';

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/meta-tags', metaTagRoutes);

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
```

2. Create a server entry in `src/index.ts`:

```typescript
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import app from './app';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const port = process.env.PORT || 4000;

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
```

## Testing the API

1. Start your development server:

```bash
npm run dev
```

2. Open Postman or similar API testing tool to test your API endpoints:

- **Register a new user**:
  - POST `/api/v1/users/signup`
  - Body: 
    ```json
    {
      "name": "Test User",
      "email": "test@example.com",
      "password": "password123"
    }
    ```

- **Login**:
  - POST `/api/v1/users/login`
  - Body:
    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```

- **Create a location (with admin token)**:
  - POST `/api/v1/locations`
  - Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
  - Body: 
    ```json
    {
      "name": "Paris",
      "description": "The city of love"
    }
    ```

- Test other endpoints following a similar pattern.

## Troubleshooting

### Database Connection Issues

If you encounter connection issues with Neon PostgreSQL:

1. Check that your connection string is correct in the `.env` file.
2. Verify that you've included the SSL settings in your Knex configuration.
3. Make sure your IP address is allowed to connect to your Neon database.
4. Try connecting with a tool like pgAdmin to verify the database is accessible.

### Migration Issues

If migrations fail:

1. Check that your migrations are properly formatted with correct TypeScript syntax.
2. Ensure you're using the right syntax for your PostgreSQL version.
3. Try running `npm run migrate:rollback` and then `npm run migrate:latest` again.

### Auth Issues

If authentication doesn't work:

1. Check that your JWT secret is properly set in your `.env` file.
2. Verify that the token is being set correctly in your request headers as `Bearer YOUR_TOKEN`.
3. Check for expiration time of the tokens (default is 30 days in this setup).

## Conclusion

Converting from MongoDB/Mongoose to PostgreSQL/Knex is a significant change in how your application interacts with the database. The key differences include:

1. **Schema Definition**: Mongoose schemas are replaced by Knex migrations.
2. **Data Queries**: Mongoose model methods are replaced by Knex query builder methods.
3. **Relationships**: MongoDB's embedded documents are replaced by PostgreSQL's relational tables with foreign keys.
4. **TypeScript Integration**: Adding TypeScript provides type safety and better developer experience.

This guide has walked you through each step of the conversion process, from setting up your project to testing the final API. By following this guide, you should now have a functional Express API using Knex, PostgreSQL, and TypeScript.