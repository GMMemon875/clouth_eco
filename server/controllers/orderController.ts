import { Request, Response } from 'express';
import { createOrder, trackOrder, getOrderByNumber } from '../services/orderService';

export async function createOrderHandler(req: Request, res: Response) {
  try {
    const { shippingDetails, items } = req.body;

    if (!shippingDetails || !items) {
      return res.status(400).json({
        success: false,
        error: 'Missing shippingDetails or items in order payload.',
      });
    }

    const { order, orderNumber } = await createOrder({ shippingDetails, items });

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
    const order = await getOrderByNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found.',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve order details.',
    });
  }
}
