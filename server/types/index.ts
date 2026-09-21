export interface IVariant {
  sku: string;
  color: string;
  colorCode: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Unstitched' | 'Standard';
  stock: number;
  additionalPrice?: number;
}

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface IMeasurements {
  chest?: string;
  length?: string;
  sleeve?: string;
  trouser?: string;
}

export interface IProduct {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string; // Category ID or slug
  tags: string[];
  basePrice: number;
  compareAtPrice?: number | null;
  fabric: string;
  shirtDetails?: string;
  trouserDetails?: string;
  dupattaDetails?: string;
  measurements?: IMeasurements;
  images: IProductImage[];
  videoUrl?: string | null;
  variants: IVariant[];
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  sale: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICategory {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | null;
  displayOrder?: number;
  isActive: boolean;
}

export interface ICustomer {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  whatsapp?: string;
  city: string;
  area?: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate?: Date;
  lastOrderDate?: Date;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  sku: string;
  variantSku: string;
  color: string;
  size: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type OrderSource =
  | 'website'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'agent'
  | 'ai_assistant';

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: Date | string;
  note?: string;
}

export interface IShippingDetails {
  fullName: string;
  phone: string;
  whatsapp?: string;
  city: string;
  area?: string;
  address: string;
  landmark?: string;
  notes?: string;
}

export interface IOrder {
  id?: string;
  _id?: string;
  orderNumber: string;
  customer?: string;
  shippingDetails: IShippingDetails;
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  source: OrderSource;
  trackingCode?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IStoreSettings {
  key: string;
  brandName: string;
  whatsappNumber: string;
  contactEmail: string;
  delivery: {
    enabled: boolean;
    standardCharge: number;
    freeDeliveryThreshold: number;
    estimatedDays: string;
  };
  codEnabled: boolean;
  announcementText: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}
