import { app, ensureBackendReady } from '../server/app';

export default async function handler(req: any, res: any) {
  try {
    await ensureBackendReady();

    return await new Promise<void>((resolve, reject) => {
      res.on('finish', () => resolve());
      res.on('close', () => resolve());
      res.on('error', (err: any) => reject(err));

      app(req, res, (err: any) => {
        if (err) {
          console.error('[Vercel Serverless App Error]:', err);
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({
              success: false,
              error: err.message || 'Internal server error',
            });
          }
        }
        resolve();
      });
    });
  } catch (err: any) {
    console.error('[Vercel Handler Error]:', err);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({
        success: false,
        error: err.message || 'Server error occurred during request processing.',
      });
    }
  }
}
