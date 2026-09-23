import { IOrder, IProduct, IStoreSettings, OrderStatus } from '../types/store';
import { getAuthHeaders } from './authApi';

const BACKEND_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${BACKEND_BASE}/api/admin`;

export interface IAdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  lowStockCount: number;
  ordersByStatus: Record<string, number>;
  salesTrend: Array<{ date: string; revenue: number; orders: number }>;
  topSellingProducts: Array<{
    productId: string;
    name: string;
    units: number;
    revenue: number;
    image: string;
  }>;
  recentOrders: IOrder[];
}

export interface IAdminCustomer {
  id: string;
  fullName: string;
  name?: string;
  email?: string;
  phone: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  lastOrderNumber?: string;
  createdAt?: string;
  orders?: Array<{ orderNumber: string; date: string; total: number; status: string }>;
}

async function parseJsonResponse(res: Response): Promise<any> {
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (_e) {
    if (!res.ok) {
      const clean = text
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);
      throw new Error(clean || `Server error (${res.status})`);
    }
    throw new Error('Received unexpected non-JSON response from server.');
  }
  return json;
}

export async function fetchAdminStats(): Promise<IAdminStats> {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch admin stats');
  }
  return data.data;
}

export async function fetchAdminOrders(filters: {
  status?: string;
  search?: string;
  limit?: number;
} = {}): Promise<IOrder[]> {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', String(filters.limit));

  const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch admin orders');
  }
  return data.data;
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  courierNotes?: string
): Promise<IOrder> {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status, trackingNumber, courierNotes }),
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update order status');
  }
  return data.data;
}

export async function fetchAdminProducts(params: Record<string, any> = {}): Promise<{
  products: IProduct[];
  total: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
  });

  const res = await fetch(`${API_BASE}/products?${query.toString()}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch admin products');
  }
  return data.data;
}

export async function createAdminProduct(productData: Partial<IProduct>): Promise<IProduct> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(productData),
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to create product');
  }
  return data.data;
}

export async function updateAdminProduct(id: string, updates: Partial<IProduct>): Promise<IProduct> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update product');
  }
  return data.data;
}

export async function updateAdminVariantStock(
  productId: string,
  variantSku: string,
  stock: number
): Promise<{ success: boolean; newStock: number }> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(productId)}/stock`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ variantSku, stock }),
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update variant stock');
  }
  return data.data;
}

export async function fetchAdminCustomers(): Promise<IAdminCustomer[]> {
  const res = await fetch(`${API_BASE}/customers`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch customers');
  }
  return data.data;
}

export async function fetchAdminSettings(): Promise<IStoreSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch settings');
  }
  return data.data;
}

export async function updateAdminSettings(settings: Partial<IStoreSettings>): Promise<IStoreSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(settings),
  });
  const data = await parseJsonResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to save settings');
  }
  return data.data;
}
