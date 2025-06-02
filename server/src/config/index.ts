import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Configuration schema
const configSchema = z.object({
  port: z.string().transform(Number).default('3000'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  mongodb: z.object({
    uri: z.string().min(1),
  }),
  jwt: z.object({
    secret: z.string().min(1),
    expiresIn: z.string().transform((val) => {
      // Convert string duration to seconds
      const match = val.match(/^(\d+)([smhd])$/);
      if (!match) return '24h'; // Default to 24h if invalid format
      const [, num, unit] = match;
      const multiplier = { s: 1, m: 60, h: 3600, d: 86400 }[unit as 's' | 'm' | 'h' | 'd'];
      return parseInt(num) * multiplier;
    }).default('24h'),
  }),
  proxy: z.object({
    targetUrl: z.string().url(),
    timeout: z.string().transform(Number).default('5000'),
  }),
  rateLimit: z.object({
    windowMs: z.string().transform(Number).default('900000'),
    maxRequests: z.string().transform(Number).default('100'),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
    filePath: z.string().default('logs/server.log'),
  }),
});

// Parse and validate configuration
const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  proxy: {
    targetUrl: process.env.TARGET_URL,
    timeout: process.env.PROXY_TIMEOUT,
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS,
    maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: process.env.LOG_LEVEL,
    filePath: process.env.LOG_FILE_PATH,
  },
});

export { config }; 