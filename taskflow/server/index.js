import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes        from './routes/auth.js';
import taskRoutes        from './routes/tasks.js';
import employeeRoutes    from './routes/employees.js';
import performanceRoutes from './routes/performance.js';
import { errorHandler }  from './middleware/errorHandler.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://employee-management-system-fkrh.vercel.app'
  ],
  credentials: true
}));

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use('/api/v1/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 15 }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1/auth',        authRoutes);
app.use('/api/v1/tasks',       taskRoutes);
app.use('/api/v1/employees',   employeeRoutes);
app.use('/api/v1/performance', performanceRoutes);

app.get('/api/v1/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Server → http://localhost:${PORT}`));
  })
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });
