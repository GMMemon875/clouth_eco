import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db';
import { initializeCatalog } from './server/services/productService';
import productRoutes from './server/routes/productRoutes';
import categoryRoutes from './server/routes/categoryRoutes';
import orderRoutes from './server/routes/orderRoutes';
import settingsRoutes from './server/routes/settingsRoutes';
import adminRoutes from './server/routes/adminRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Initialize DB and Seed Data
  await connectDB();
  await initializeCatalog();

  // API Routes (Mounted FIRST)
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/admin', adminRoutes);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Pakistani Clothing Storefront active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal bootstrap error:', err);
});
