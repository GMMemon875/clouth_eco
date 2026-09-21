import { Router } from 'express';
import {
  createOrderHandler,
  trackOrderHandler,
  getOrderDetailsHandler,
} from '../controllers/orderController';

const router = Router();

router.post('/', createOrderHandler);
router.post('/track', trackOrderHandler);
router.get('/:orderNumber', getOrderDetailsHandler);

export default router;
