import { app, ensureBackendReady } from '../server/app';

export default async function handler(req: any, res: any) {
  await ensureBackendReady();
  return app(req, res);
}
