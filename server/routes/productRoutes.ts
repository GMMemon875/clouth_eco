import { Router } from 'express';
import {
  listProductsHandler,
  getProductBySlugHandler,
  getRelatedProductsHandler,
} from '../controllers/productController';

const router = Router();

router.get('/', listProductsHandler);
router.get('/related/:slug', getRelatedProductsHandler);
router.get('/:slug', getProductBySlugHandler);

export default router;
