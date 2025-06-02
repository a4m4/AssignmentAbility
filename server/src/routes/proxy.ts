import { Router } from 'express';
import { z } from 'zod';
import { protect, restrictTo } from '../middleware/auth';
import { getProxyOptions, updateProxyOptions } from '../middleware/proxy';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schema for proxy options
const proxyOptionsSchema = z.object({
  enabled: z.boolean().optional(),
  whitelist: z.array(z.string()).optional(),
});

// Get current proxy settings
router.get('/settings', protect, restrictTo('admin'), (req, res) => {
  const settings = getProxyOptions();
  res.json({
    status: 'success',
    data: {
      settings,
    },
  });
});

// Update proxy settings
router.patch('/settings', protect, restrictTo('admin'), (req, res, next) => {
  try {
    const updates = proxyOptionsSchema.parse(req.body);
    updateProxyOptions(updates);

    const settings = getProxyOptions();
    res.json({
      status: 'success',
      data: {
        settings,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get proxy status
router.get('/status', protect, (req, res) => {
  const { enabled } = getProxyOptions();
  res.json({
    status: 'success',
    data: {
      enabled,
    },
  });
});

// Toggle proxy
router.post('/toggle', protect, restrictTo('admin'), (req, res, next) => {
  try {
    const { enabled } = z.object({ enabled: z.boolean() }).parse(req.body);
    updateProxyOptions({ enabled });

    res.json({
      status: 'success',
      data: {
        enabled,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Add endpoint to whitelist
router.post('/whitelist', protect, restrictTo('admin'), (req, res, next) => {
  try {
    const { endpoint } = z.object({ endpoint: z.string() }).parse(req.body);
    const { whitelist } = getProxyOptions();

    if (whitelist.includes(endpoint)) {
      throw new AppError(400, 'Endpoint already whitelisted');
    }

    updateProxyOptions({
      whitelist: [...whitelist, endpoint],
    });

    res.json({
      status: 'success',
      data: {
        whitelist: [...whitelist, endpoint],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Remove endpoint from whitelist
router.delete('/whitelist/:endpoint', protect, restrictTo('admin'), (req, res, next) => {
  try {
    const { endpoint } = req.params;
    const { whitelist } = getProxyOptions();

    if (!whitelist.includes(endpoint)) {
      throw new AppError(400, 'Endpoint not in whitelist');
    }

    updateProxyOptions({
      whitelist: whitelist.filter((e) => e !== endpoint),
    });

    res.json({
      status: 'success',
      data: {
        whitelist: whitelist.filter((e) => e !== endpoint),
      },
    });
  } catch (error) {
    next(error);
  }
});

export const proxyRouter = router; 