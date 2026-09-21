import { Request, Response } from 'express';
import { getCategories } from '../services/productService';

export async function listCategoriesHandler(_req: Request, res: Response) {
  try {
    const categories = await getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch categories',
    });
  }
}
