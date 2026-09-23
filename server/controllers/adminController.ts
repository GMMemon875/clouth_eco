import { Request, Response } from 'express';
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getAdminStats,
  getAdminCustomers,
} from '../services/orderService';
import {
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  updateVariantStockAdmin,
} from '../services/productService';
import { getStoreSettings, updateStoreSettings } from '../services/settingsService';

export async function getStatsHandler(_req: Request, res: Response) {
  try {
    const stats = await getAdminStats();
    const products = await getAllProductsAdmin();
    const lowStockCount = products.filter((p) => p.hasLowStock || p.isOutOfStock).length;
    const totalProducts = products.length;

    res.json({
      success: true,
      data: {
        ...stats,
        totalProducts,
        lowStockCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate store analytics',
    });
  }
}

export async function listOrdersHandler(req: Request, res: Response) {
  try {
    const { status, search, limit } = req.query;
    const orders = await getAllOrdersAdmin({
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list orders',
    });
  }
}

export async function updateOrderStatusHandler(req: Request, res: Response) {
  try {
    const { orderNumber } = req.params;
    const { status, trackingCode, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required.',
      });
    }

    const updated = await updateOrderStatusAdmin(orderNumber, status, trackingCode, note);

    res.json({
      success: true,
      message: `Order ${orderNumber} updated to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update order status.',
    });
  }
}

export async function listProductsHandler(_req: Request, res: Response) {
  try {
    const products = await getAllProductsAdmin();
    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list products',
    });
  }
}

export async function createProductHandler(req: Request, res: Response) {
  try {
    const product = await createProductAdmin(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create product',
    });
  }
}

export async function updateProductHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await updateProductAdmin(id, req.body);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update product',
    });
  }
}

export async function updateProductStockHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { variantSku, stock } = req.body;

    if (!variantSku || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: 'variantSku and stock are required',
      });
    }

    const result = await updateVariantStockAdmin(id, variantSku, Number(stock));
    res.json({
      success: true,
      message: `Stock updated for ${variantSku}`,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update stock',
    });
  }
}

export async function listCustomersHandler(_req: Request, res: Response) {
  try {
    const customers = await getAdminCustomers();
    res.json({
      success: true,
      data: customers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve customers',
    });
  }
}

export async function getSettingsHandler(_req: Request, res: Response) {
  try {
    const settings = await getStoreSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch settings',
    });
  }
}

export async function updateSettingsHandler(req: Request, res: Response) {
  try {
    const settings = await updateStoreSettings(req.body);
    res.json({
      success: true,
      message: 'Store settings saved successfully',
      data: settings,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update store settings',
    });
  }
}
