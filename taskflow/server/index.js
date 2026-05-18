import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import employeeRoutes from './routes/employees.js';
import performanceRoutes from './routes/performance.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

// -----------------------------
// Environment Validation
// -----------------------------
if (!process.env.MONGO_URI) {
  throw new Error('❌ MONGO_URI is missing in environment variables');
}

if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is missing in environment variables');
}

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// Trust Proxy (IMPORTANT for Render/Vercel)
// -----------------------------
app.set('trust proxy', 1);

// -----------------------------
// Security Middleware
// -----------------------------
app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://employee-management-system-fkrh.vercel.app',
    ],
    credentials: true,
  })
);

// -----------------------------
// Rate Limiting
// -----------------------------
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 200,
    message: {
      success: false,
      error: 'Too many requests. Please try again later.',
    },
  })
);

// Stricter limiter for auth routes
app.use(
  '/api/v1/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
      success: false,
      error: 'Too many login attempts. Please try again later.',
    },
  })
);

// -----------------------------
// Body Parsers
// -----------------------------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// Logging
// -----------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -----------------------------
// API Routes
// -----------------------------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/performance', performanceRoutes);

// -----------------------------
// Health Check Route
// -----------------------------
app.get('/api/v1/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------
// 404 Handler
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// -----------------------------
// Global Error Handler
// -----------------------------
app.use(errorHandler);

// -----------------------------
// Database Connection
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Health Check → /api/v1/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
