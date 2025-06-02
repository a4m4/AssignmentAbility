import { Router } from 'express';
import { z } from 'zod';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/user';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { protect } from '../middleware/auth';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      role: 'user', // Default role
    });

    // Generate token
    const signOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn,
    };

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwt.secret as jwt.Secret,
      signOptions
    );

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate token
    const signOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn,
    };

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwt.secret as jwt.Secret,
      signOptions
    );

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export const authRouter = router; 