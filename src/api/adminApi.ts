import { IOrder, IProduct, IStoreSettings, OrderStatus } from '../types/store';

const API_BASE = '/api/admin';

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
  phone: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  lastOrderNumber: string;
  orders: Array<{ orderNumber: string; date: string; total: number; status: string }>;
}

export async function fetchAdminStats(): Promise<IAdminStats> {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();
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

  const res = await fetch(`${API_BASE}/orders?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch admin orders');
  }
  return data.data;
}

export async function updateAdminOrderStatus(
  orderNumber: string,
  status: OrderStatus,
  trackingCode?: string,
  note?: string
): Promise<IOrder> {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderNumber)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, trackingCode, note }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update order status');
  }
  return data.data;
}

export async function fetchAdminProducts(): Promise<Array<IProduct & {
  totalStock: number;
  hasLowStock: boolean;
  isOutOfStock: boolean;
}>> {
  const res = await fetch(`${API_BASE}/products`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch products');
  }
  return data.data;
}

export async function createAdminProduct(productData: Partial<IProduct>): Promise<IProduct> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to create product');
  }
  return data.data;
}

export async function updateAdminProduct(id: string, updates: Partial<IProduct>): Promise<IProduct> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantSku, stock }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update variant stock');
  }
  return data.data;
}

export async function fetchAdminCustomers(): Promise<IAdminCustomer[]> {
  const res = await fetch(`${API_BASE}/customers`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch customers');
  }
  return data.data;
}

export async function fetchAdminSettings(): Promise<IStoreSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch settings');
  }
  return data.data;
}

export async function updateAdminSettings(settings: Partial<IStoreSettings>): Promise<IStoreSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to save settings');
  }
  return data.data;
}
