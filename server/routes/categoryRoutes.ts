import { Router } from 'express';
import { listCategoriesHandler } from '../controllers/categoryController';

const router = Router();

router.get('/', listCategoriesHandler);

export default router;
