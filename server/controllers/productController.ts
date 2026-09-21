import { Request, Response } from 'express';
import { getProducts, getProductBySlug, getRelatedProducts } from '../services/productService';

export async function listProductsHandler(req: Request, res: Response) {
  try {
    const {
      search,
      category,
      fabric,
      size,
      minPrice,
      maxPrice,
      inStock,
      newArrival,
      bestSeller,
      sale,
      featured,
      sort,
      page,
      limit,
    } = req.query;

    const result = await getProducts({
      search: search ? String(search) : undefined,
      category: category ? String(category) : undefined,
      fabric: fabric ? String(fabric) : undefined,
      size: size ? String(size) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock === 'true',
      newArrival: newArrival === 'true',
      bestSeller: bestSeller === 'true',
      sale: sale === 'true',
      featured: featured === 'true',
      sort: sort as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch products',
    });
  }
}

export async function getProductBySlugHandler(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch product details',
    });
  }
}

export async function getRelatedProductsHandler(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const products = await getRelatedProducts(slug, limit);

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch related products',
    });
  }
}
