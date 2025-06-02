import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/user';
import { AppError } from './errorHandler';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Not authorized to access this route');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password') as IUser | null;
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Not authorized to access this route'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Not authorized to perform this action'));
    }

    next();
  };
}; 