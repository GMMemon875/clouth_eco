import { Request, Response } from 'express';
import {
  createOrder,
  trackOrder,
  getCustomerOrders,
  getOrderDetailsForUser,
} from '../services/orderService';

export async function createOrderHandler(req: Request, res: Response) {
  try {
    const { shippingDetails, items } = req.body;

    if (!shippingDetails || !items) {
      return res.status(400).json({
        success: false,
        error: 'Missing shippingDetails or items in order payload.',
      });
    }

    const userId = req.user ? req.user.id || (req.user as any)._id?.toString() : null;
    const userEmail = req.user ? req.user.email : (shippingDetails.email || null);

    const { order, orderNumber } = await createOrder({
      shippingDetails,
      items,
      userId,
      userEmail,
    });

    res.status(201).json({
      success: true,
      message: 'Cash on Delivery order placed successfully.',
      data: {
        orderNumber,
        order,
      },
    });
  } catch (error: any) {
    const isConflict = error.message && error.message.includes('is no longer available');
    res.status(isConflict ? 409 : 400).json({
      success: false,
      error: error.message || 'Failed to place order. Please try again.',
    });
  }
}

export async function getMyOrdersHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.',
      });
    }

    const userId = req.user.id || (req.user as any)._id?.toString() || '';
    const orders = await getCustomerOrders(userId, req.user.email, req.user.phone);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve your orders.',
    });
  }
}

export async function trackOrderHandler(req: Request, res: Response) {
  try {
    const { orderNumber, phone } = req.body;

    if (!orderNumber || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Both orderNumber and phone are required.',
      });
    }

    const trackingData = await trackOrder(orderNumber, phone);

    res.json({
      success: true,
      data: trackingData,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message || 'No order found matching the provided details.',
    });
  }
}

export async function getOrderDetailsHandler(req: Request, res: Response) {
  try {
    const { orderNumber } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to view order details. For guest orders, please use Track Order with Phone Number.',
      });
    }

    const order = await getOrderDetailsForUser(orderNumber, req.user);

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    const isForbidden = error.message && error.message.includes('Access denied');
    const isNotFound = error.message && error.message.includes('not found');
    res.status(isForbidden ? 403 : isNotFound ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve order details.',
    });
  }
}

