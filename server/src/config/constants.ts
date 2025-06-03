export const constants = {
  port: 5001,
  nodeEnv: 'development' as const,
  mongodb: {
    uri: 'mongodb+srv://Ali:123@cluster0.q4hlxwc.mongodb.net/',
  },
  jwt: {
    secret: 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: '7d',
  },
  proxy: {
    targetUrl: 'http://localhost:3000',
    timeout: 5000,
  },
  rateLimit: {
    windowMs: 900000, // 15 minutes
    maxRequests: 100,
  },
  logging: {
    level: 'info' as const,
    filePath: 'logs/server.log',
  },
} as const; 