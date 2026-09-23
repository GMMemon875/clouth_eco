import { Router } from 'express';
import {
  createOrderHandler,
  getMyOrdersHandler,
  trackOrderHandler,
  getOrderDetailsHandler,
} from '../controllers/orderController';
import { authenticateToken, requireAuth } from '../middleware/auth';

const router = Router();

// Create order (authenticated customer or guest)
router.post('/', authenticateToken, createOrderHandler);

// Customer's own orders (requires authentication)
router.get('/my-orders', authenticateToken, requireAuth, getMyOrdersHandler);

// Public track order with Order Number + Phone Number
router.post('/track', trackOrderHandler);

// Protected single order details with ownership verification
router.get('/:orderNumber', authenticateToken, getOrderDetailsHandler);

export default router;

