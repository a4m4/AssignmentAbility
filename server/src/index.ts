import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { setupProxy } from './middleware/proxy';
import { authRouter } from './routes/auth';
import { logsRouter } from './routes/logs';
import { proxyRouter } from './routes/proxy';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/logs', logsRouter);
app.use('/api/proxy', proxyRouter);

// Setup proxy middleware
setupProxy(app);

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(config.mongodb.uri)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
}); 