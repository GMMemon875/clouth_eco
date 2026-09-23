import { Router } from 'express';
import {
  getStatsHandler,
  listOrdersHandler,
  updateOrderStatusHandler,
  listProductsHandler,
  createProductHandler,
  updateProductHandler,
  updateProductStockHandler,
  listCustomersHandler,
  getSettingsHandler,
  updateSettingsHandler,
} from '../controllers/adminController';

const router = Router();

// Analytics & KPI overview
router.get('/stats', getStatsHandler);

// Orders Desk
router.get('/orders', listOrdersHandler);
router.put('/orders/:orderNumber/status', updateOrderStatusHandler);

// Products & Inventory
router.get('/products', listProductsHandler);
router.post('/products', createProductHandler);
router.put('/products/:id', updateProductHandler);
router.patch('/products/:id/stock', updateProductStockHandler);

// Customers Directory
router.get('/customers', listCustomersHandler);

// Store Settings
router.get('/settings', getSettingsHandler);
router.put('/settings', updateSettingsHandler);

export default router;
