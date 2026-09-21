import { Router } from 'express';
import { getSettingsHandler } from '../controllers/settingsController';

const router = Router();

router.get('/', getSettingsHandler);

export default router;
