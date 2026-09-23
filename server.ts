import path from 'path';
import { createServer as createViteServer } from 'vite';
import { app, ensureBackendReady } from './server/app';

async function startServer() {
  const PORT = 3000;

  // Initialize DB and catalog
  await ensureBackendReady();

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(expressStaticMiddleware(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Pakistani Clothing Storefront active on http://0.0.0.0:${PORT}`);
  });
}

function expressStaticMiddleware(distPath: string) {
  const express = require('express');
  return express.static(distPath);
}

startServer().catch((err) => {
  console.error('[Server] Fatal bootstrap error:', err);
});
