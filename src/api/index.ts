import {
  IProduct,
  ICategory,
  IStoreSettings,
  IShippingDetails,
  IOrder,
  IOrderTrackingResult,
} from '../types/store';
import { getAuthHeaders } from './authApi';

const API_BASE = '/api';

export async function fetchProducts(params: Record<string, any> = {}): Promise<{
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, String(val));
    }
  });

  const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch products');
  }
  return data.data;
}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {
  const res = await fetch(`${API_BASE}/products/${slug}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Product not found');
  }
  return data.data;
}

export async function fetchRelatedProducts(slug: string): Promise<IProduct[]> {
  const res = await fetch(`${API_BASE}/products/related/${slug}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    return [];
  }
  return data.data || [];
}

export async function fetchCategories(): Promise<ICategory[]> {
  const res = await fetch(`${API_BASE}/categories`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch categories');
  }
  return data.data;
}

export async function fetchStoreSettings(): Promise<IStoreSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch settings');
  }
  return data.data;
}

export async function submitCodOrder(payload: {
  shippingDetails: IShippingDetails;
  items: Array<{
    productId: string;
    variantSku: string;
    quantity: number;
  }>;
}): Promise<{ orderNumber: string; order: IOrder }> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Could not place order');
  }
  return data.data;
}

export async function trackOrderApi(orderNumber: string, phone: string): Promise<IOrderTrackingResult> {
  const res = await fetch(`${API_BASE}/orders/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, phone }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Unable to find order tracking');
  }
  return data.data;
}

export async function fetchOrderByNumber(orderNumber: string): Promise<IOrder> {
  const res = await fetch(`${API_BASE}/orders/${orderNumber}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Order lookup failed');
  }
  return data.data;
}
