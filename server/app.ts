import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { initializeCatalog } from './services/productService';
import { initializeAdminAccount } from './services/authService';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import settingsRoutes from './routes/settingsRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

let initialized = false;

export async function ensureBackendReady() {
  if (!initialized) {
    try {
      await connectDB();
      await initializeCatalog();
      await initializeAdminAccount();
      initialized = true;
    } catch (err) {
      console.error('[Backend] Initialization error:', err);
    }
  }
}

export function createExpressApp() {
  const app = express();

  // Allow CORS with credentials for local dev, Vercel deployments, and production domains
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        // Allow all origins (reflected) with credentials enabled
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Middleware to ensure DB and initial seeds are loaded
  app.use(async (_req, _res, next) => {
    await ensureBackendReady();
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Pakistani Women Clothing Store API',
      timestamp: new Date().toISOString(),
    });
  });

  // Also support root /health
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Pakistani Women Clothing Store API',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes (Mounted under /api prefix)
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/admin', adminRoutes);

  return app;
}

export const app = createExpressApp();
