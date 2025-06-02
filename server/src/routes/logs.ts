import { Router } from 'express';
import { z } from 'zod';
import { Log } from '../models/log';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schema for query parameters
const logsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
  status: z.union([z.number(), z.literal('pending')]).optional(),
  limit: z.string().transform(Number).default('50'),
  page: z.string().transform(Number).default('1'),
});

// Get logs with filtering
router.get('/', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { startDate, endDate, method, status, limit, page } = logsQuerySchema.parse(req.query);

    // Build query
    const query: any = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    if (method) query.method = method;
    if (status) query.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get logs with pagination
    const [logs, total] = await Promise.all([
      Log.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      Log.countDocuments(query),
    ]);

    res.json({
      status: 'success',
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get log statistics
router.get('/stats', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: {
            method: '$method',
            status: '$status',
          },
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
      {
        $group: {
          _id: '$_id.method',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count',
              avgResponseTime: '$avgResponseTime',
            },
          },
          totalRequests: { $sum: '$count' },
        },
      },
    ]);

    res.json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Clear logs (admin only)
router.delete('/', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { startDate, endDate } = logsQuerySchema.pick({ startDate: true, endDate: true }).parse(req.query);

    const query: any = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const result = await Log.deleteMany(query);

    res.json({
      status: 'success',
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const logsRouter = router; 