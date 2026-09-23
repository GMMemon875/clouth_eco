export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Unstitched' | 'Standard';

export interface IVariant {
  sku: string;
  color: string;
  colorCode: string;
  size: ProductSize;
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
  category: string;
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
  createdAt?: string;
  updatedAt?: string;
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

export interface ICartItem {
  id: string; // unique item key: `${productId}_${variantSku}`
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  variantSku: string;
  color: string;
  colorCode?: string;
  size: string;
  unitPrice: number;
  quantity: number;
  image: string;
  maxStock: number;
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

export interface IStoreSettings {
  key: string;
  brandName: string;
  storeName?: string;
  tagline?: string;
  supportEmail?: string;
  whatsappNumber: string;
  contactEmail: string;
  delivery: {
    enabled: boolean;
    standardCharge: number;
    freeDeliveryThreshold: number;
    estimatedDays: string;
    baseFee?: number;
    freeShippingThreshold?: number;
  };
  codEnabled: boolean;
  announcementText: string;
  announcement?: {
    enabled: boolean;
    text: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
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
  orderNumber: string;
  customer?: string;
  shippingDetails: IShippingDetails;
  items: Array<{
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
  }>;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  trackingCode?: string | null;
  statusHistory?: Array<{
    status: string;
    timestamp: string | Date;
    note?: string;
  }>;
  source?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IOrderTrackingResult {
  orderNumber: string;
  status: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  city: string;
  itemCount: number;
  totalAmount: number;
  paymentMethod: string;
  trackingCode?: string | null;
  createdAt: string;
  items: Array<{
    productName: string;
    color: string;
    size: string;
    quantity: number;
    image: string;
  }>;
}
