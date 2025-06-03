import { z } from 'zod';
import { constants } from './constants';

// Configuration schema
const configSchema = z.object({
  port: z.number().default(3000),
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
    timeout: z.number().default(5000),
  }),
  rateLimit: z.object({
    windowMs: z.number().default(900000),
    maxRequests: z.number().default(100),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
    filePath: z.string().default('logs/server.log'),
  }),
});

// Parse and validate configuration using constants
const config = configSchema.parse({
  port: constants.port,
  nodeEnv: constants.nodeEnv,
  mongodb: constants.mongodb,
  jwt: constants.jwt,
  proxy: constants.proxy,
  rateLimit: constants.rateLimit,
  logging: constants.logging,
});

export { config }; 