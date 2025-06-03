import { Express, Request } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { config } from '../config';
import Log from '../models/log';
import { AppError } from './errorHandler';

interface ProxyOptions {
  enabled: boolean;
  whitelist: string[];
}

let proxyOptions: ProxyOptions = {
  enabled: true,
  whitelist: ['/users'],
};

export const updateProxyOptions = (options: Partial<ProxyOptions>) => {
  proxyOptions = { ...proxyOptions, ...options };
};

export const getProxyOptions = () => ({ ...proxyOptions });

const proxyMiddleware: RequestHandler = createProxyMiddleware({
  target: config.proxy.targetUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '', // Remove /api/proxy prefix
  },
  onProxyReq: async (proxyReq, req: Request, res) => {
    // Set request timestamp (if needed)
    req.timestamp = Date.now();
    if (!proxyOptions.enabled) {
      throw new AppError(403, 'Proxy is currently disabled');
    }
    const path = req.path.replace('/api/proxy', '');
    if (!proxyOptions.whitelist.includes(path)) {
      throw new AppError(403, 'Endpoint not whitelisted');
    }
    // Intercept and log each proxied request (method, URL, timestamp) and store in MongoDB
    try {
      await Log.create({
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.get('user-agent'),
        statusCode: 'pending',
      });
    } catch (error) {
      console.error('Failed to log request:', error);
    }
  },
  onProxyRes: async (proxyRes, req: Request, res) => {
    // Update the log with the response status
    try {
      await Log.findOneAndUpdate(
        {
          url: req.originalUrl,
          timestamp: { $gte: new Date(Date.now() - 5000) }, // Find log from last 5 seconds
        },
        {
          statusCode: proxyRes.statusCode,
          responseTime: req.timestamp ? Date.now() - req.timestamp : undefined,
        }
      );
    } catch (error) {
      console.error('Failed to update request log:', error);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Proxy request failed',
    });
  },
});

export const setupProxy = (app: Express) => {
  app.use('/api/proxy', proxyMiddleware);
};

export const userProxy = createProxyMiddleware({
  target: 'https://jsonplaceholder.typicode.com',
  changeOrigin: true,
  pathRewrite: { '^/proxy/users': '/users' },
  onProxyReq: async (proxyReq, req, res) => {
    // Log the request
    await Log.create({
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date(),
    });
  },
  onProxyRes: (proxyRes, req, res) => {
    // Optionally log response status
    Log.updateOne(
      { method: req.method, url: req.originalUrl, timestamp: { $exists: true } },
      { $set: { statusCode: proxyRes.statusCode } },
      { sort: { timestamp: -1 } }
    ).exec();
  },
}); 