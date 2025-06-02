import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';
import { config } from '../config';

const logger = createLogger({
  level: config.logging.level,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
    new transports.File({
      filename: config.logging.filePath,
    }),
  ],
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}; 