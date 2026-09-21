import { isMongoConnected } from '../config/db';
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';
import { demoProducts, demoCategories } from '../utils/seedData';
import { IProduct, ICategory } from '../types';

// In-Memory fallback store if MongoDB Atlas is not yet configured with credentials
let inMemoryProducts: IProduct[] = JSON.parse(JSON.stringify(demoProducts));
let inMemoryCategories: ICategory[] = JSON.parse(JSON.stringify(demoCategories));

export async function initializeCatalog() {
  if (isMongoConnected()) {
    try {
      const catCount = await CategoryModel.countDocuments();
      if (catCount === 0) {
        console.log('[Seed] Seeding categories to MongoDB Atlas...');
        await CategoryModel.insertMany(demoCategories);
      }
      const prodCount = await ProductModel.countDocuments();
      if (prodCount === 0) {
        console.log('[Seed] Seeding 20 Pakistani clothing items to MongoDB Atlas...');
        await ProductModel.insertMany(demoProducts);
      }
    } catch (err) {
      console.warn('[Seed] Error checking or seeding MongoDB, using active memory state:', err);
    }
  }
}

export interface IProductQueryFilters {
  search?: string;
  category?: string;
  fabric?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  sale?: boolean;
  featured?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'bestseller';
  page?: number;
  limit?: number;
}

export async function getProducts(filters: IProductQueryFilters) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 12));

  let items: IProduct[] = [];

  if (isMongoConnected()) {
    try {
      const query: any = { status: 'active' };

      if (filters.search) {
        const regex = new RegExp(filters.search.trim(), 'i');
        query.$or = [{ name: regex }, { sku: regex }, { description: regex }, { tags: regex }];
      }

      if (filters.category && filters.category !== 'all') {
        query.category = filters.category;
      }

      if (filters.fabric && filters.fabric !== 'all') {
        query.fabric = new RegExp(filters.fabric, 'i');
      }

      if (filters.size && filters.size !== 'all') {
        query['variants.size'] = filters.size;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.basePrice = {};
        if (filters.minPrice !== undefined) query.basePrice.$gte = Number(filters.minPrice);
        if (filters.maxPrice !== undefined) query.basePrice.$lte = Number(filters.maxPrice);
      }

      if (filters.newArrival) query.newArrival = true;
      if (filters.bestSeller) query.bestSeller = true;
      if (filters.sale) query.sale = true;
      if (filters.featured) query.featured = true;

      let sortOption: any = { createdAt: -1 };
      if (filters.sort === 'price-asc') sortOption = { basePrice: 1 };
      else if (filters.sort === 'price-desc') sortOption = { basePrice: -1 };
      else if (filters.sort === 'bestseller') sortOption = { bestSeller: -1, createdAt: -1 };

      const total = await ProductModel.countDocuments(query);
      const docs = await ProductModel.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      items = docs.map((d: any) => ({
        ...d,
        id: d._id?.toString() || d.id || d.sku,
      }));

      return {
        products: items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (e) {
      console.warn('[ProductService] Mongo query failed, falling back to memory state', e);
    }
  }

  // Fallback to active in-memory repository
  items = inMemoryProducts.filter((p) => p.status === 'active');

  if (filters.search) {
    const s = filters.search.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  if (filters.category && filters.category !== 'all') {
    items = items.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters.fabric && filters.fabric !== 'all') {
    items = items.filter((p) => p.fabric.toLowerCase().includes(filters.fabric!.toLowerCase()));
  }

  if (filters.size && filters.size !== 'all') {
    items = items.filter((p) => p.variants.some((v) => v.size.toLowerCase() === filters.size!.toLowerCase()));
  }

  if (filters.minPrice !== undefined) {
    items = items.filter((p) => p.basePrice >= Number(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    items = items.filter((p) => p.basePrice <= Number(filters.maxPrice));
  }

  if (filters.inStock) {
    items = items.filter((p) => p.variants.some((v) => v.stock > 0));
  }

  if (filters.newArrival) items = items.filter((p) => p.newArrival);
  if (filters.bestSeller) items = items.filter((p) => p.bestSeller);
  if (filters.sale) items = items.filter((p) => p.sale);
  if (filters.featured) items = items.filter((p) => p.featured);

  // Sorting
  if (filters.sort === 'price-asc') {
    items.sort((a, b) => a.basePrice - b.basePrice);
  } else if (filters.sort === 'price-desc') {
    items.sort((a, b) => b.basePrice - a.basePrice);
  } else if (filters.sort === 'bestseller') {
    items.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
  }

  const total = items.length;
  const paginated = items.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  if (isMongoConnected()) {
    try {
      const doc = await ProductModel.findOne({ slug, status: 'active' }).lean();
      if (doc) {
        return {
          ...(doc as any),
          id: (doc as any)._id?.toString() || (doc as any).id,
        };
      }
    } catch (err) {
      console.warn('[ProductService] Mongo findOne error:', err);
    }
  }

  const found = inMemoryProducts.find((p) => p.slug === slug && p.status === 'active');
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function getProductById(idOrSku: string): Promise<IProduct | null> {
  if (isMongoConnected()) {
    try {
      const doc = await ProductModel.findOne({
        $or: [{ _id: idOrSku }, { sku: idOrSku }, { id: idOrSku }],
      }).lean();
      if (doc) {
        return {
          ...(doc as any),
          id: (doc as any)._id?.toString() || (doc as any).id,
        };
      }
    } catch (e) {
      // Ignored if invalid ObjectId
    }
  }

  const found = inMemoryProducts.find(
    (p) => p.id === idOrSku || p.sku === idOrSku || (p as any)._id === idOrSku
  );
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function getRelatedProducts(slug: string, limit: number = 4): Promise<IProduct[]> {
  const current = await getProductBySlug(slug);
  if (!current) return [];

  if (isMongoConnected()) {
    try {
      const docs = await ProductModel.find({
        slug: { $ne: slug },
        status: 'active',
        $or: [{ category: current.category }, { fabric: current.fabric }],
      })
        .limit(limit)
        .lean();

      if (docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
        }));
      }
    } catch (err) {
      console.warn('[ProductService] Mongo getRelated error:', err);
    }
  }

  return inMemoryProducts
    .filter((p) => p.slug !== slug && p.status === 'active' && (p.category === current.category || p.fabric === current.fabric))
    .slice(0, limit);
}

export async function getCategories(): Promise<ICategory[]> {
  if (isMongoConnected()) {
    try {
      const docs = await CategoryModel.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
      if (docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
        }));
      }
    } catch (err) {
      console.warn('[ProductService] Mongo categories error:', err);
    }
  }

  return inMemoryCategories.filter((c) => c.isActive).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

// Atomic stock reduction helper for order processing
export async function decrementVariantStock(productId: string, variantSku: string, quantity: number): Promise<boolean> {
  if (isMongoConnected()) {
    try {
      const result = await ProductModel.updateOne(
        {
          $or: [{ _id: productId }, { sku: productId }, { id: productId }],
          'variants.sku': variantSku,
          'variants.stock': { $gte: quantity },
        },
        {
          $inc: { 'variants.$.stock': -quantity },
        }
      );
      return result.modifiedCount > 0;
    } catch (err) {
      console.error('[Stock] Mongo atomic stock decrement failed:', err);
      return false;
    }
  }

  // In-Memory atomic decrement
  const product = inMemoryProducts.find((p) => p.id === productId || p.sku === productId || (p as any)._id === productId);
  if (!product) return false;

  const variant = product.variants.find((v) => v.sku === variantSku);
  if (!variant || variant.stock < quantity) return false;

  variant.stock -= quantity;
  return true;
}
