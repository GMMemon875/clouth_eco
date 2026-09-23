import { isMongoConnected } from '../config/db';
import { OrderModel } from '../models/Order';
import { CustomerModel } from '../models/Customer';
import { getProductById, decrementVariantStock } from './productService';
import { getStoreSettings } from './settingsService';
import { generateOrderNumber } from '../utils/orderNumber';
import { sampleSeedOrders } from '../utils/seedOrders';
import { IOrder, IOrderItem, IShippingDetails, ICustomer, OrderStatus } from '../types';

// In-Memory store initialized with realistic Pakistani clothing orders for rich store dashboard
const inMemoryOrders: IOrder[] = JSON.parse(JSON.stringify(sampleSeedOrders));
const inMemoryCustomers: ICustomer[] = [];

export interface ICreateOrderItemInput {
  productId: string;
  variantSku: string;
  quantity: number;
}

export interface ICreateOrderInput {
  shippingDetails: IShippingDetails;
  items: ICreateOrderItemInput[];
  userId?: string | null;
  userEmail?: string | null;
}

export async function createOrder(input: ICreateOrderInput): Promise<{ order: IOrder; orderNumber: string }> {
  const { shippingDetails, items } = input;

  if (!items || items.length === 0) {
    throw new Error('Your cart is empty. Please select products to purchase.');
  }

  // Normalize phone number (digits only for lookup)
  const normalizedPhone = shippingDetails.phone.replace(/[^\d+]/g, '').trim();
  if (normalizedPhone.length < 10) {
    throw new Error('Please provide a valid Pakistani mobile phone number (e.g., 03001234567).');
  }

  if (!shippingDetails.fullName?.trim() || !shippingDetails.city?.trim() || !shippingDetails.address?.trim()) {
    throw new Error('Please fill in all required shipping address fields (Full Name, City, Address).');
  }

  // 1. Fetch fresh products from DB, validate existence & verify stock
  const validatedItems: IOrderItem[] = [];
  let calculatedSubtotal = 0;

  for (const item of items) {
    if (!item.productId || !item.variantSku || !item.quantity || item.quantity <= 0) {
      throw new Error('Invalid product or quantity in order request.');
    }

    const product = await getProductById(item.productId);
    if (!product || product.status !== 'active') {
      throw new Error(`Product "${item.productId}" is no longer available.`);
    }

    const variant = product.variants.find((v) => v.sku === item.variantSku);
    if (!variant) {
      throw new Error(`Variant "${item.variantSku}" not found on product "${product.name}".`);
    }

    if (variant.stock < item.quantity) {
      throw new Error(
        `Sorry, "${product.name}" (${variant.color}, Size ${variant.size}) is no longer available in the requested quantity of ${item.quantity}. (Remaining: ${variant.stock})`
      );
    }

    // Backend controls price authority
    const unitPrice = product.basePrice + (variant.additionalPrice || 0);
    const lineTotal = unitPrice * item.quantity;
    calculatedSubtotal += lineTotal;

    const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || '';

    validatedItems.push({
      productId: product.id || (product as any)._id || product.sku,
      productName: product.name,
      sku: product.sku,
      variantSku: variant.sku,
      color: variant.color,
      size: variant.size,
      unitPrice,
      quantity: item.quantity,
      subtotal: lineTotal,
      image: primaryImage,
    });
  }

  // 2. Fetch fresh delivery settings from backend authority
  const settings = await getStoreSettings();
  const deliveryCharge =
    calculatedSubtotal >= settings.delivery.freeDeliveryThreshold
      ? 0
      : settings.delivery.standardCharge;

  const totalAmount = calculatedSubtotal + deliveryCharge;

  // 3. Atomically decrement stock
  for (const item of validatedItems) {
    const success = await decrementVariantStock(item.productId, item.variantSku, item.quantity);
    if (!success) {
      throw new Error(
        `Failed to reserve stock for "${item.productName}" (${item.color}, Size ${item.size}). It may have just been purchased by another customer.`
      );
    }
  }

  // 4. Generate unique human-readable order number
  const orderNumber = generateOrderNumber();

  // 5. Customer Record Upsert (Guest customer management)
  let customerId: string | undefined = undefined;

  if (isMongoConnected()) {
    try {
      let customerDoc = await CustomerModel.findOne({ phone: normalizedPhone });
      if (customerDoc) {
        customerDoc.name = shippingDetails.fullName.trim();
        customerDoc.city = shippingDetails.city.trim();
        customerDoc.area = shippingDetails.area?.trim() || '';
        customerDoc.address = shippingDetails.address.trim();
        customerDoc.totalOrders += 1;
        customerDoc.totalSpent += totalAmount;
        customerDoc.lastOrderDate = new Date();
        await customerDoc.save();
        customerId = customerDoc._id.toString();
      } else {
        const newCustomer = await CustomerModel.create({
          name: shippingDetails.fullName.trim(),
          phone: normalizedPhone,
          whatsapp: shippingDetails.whatsapp?.trim() || '',
          city: shippingDetails.city.trim(),
          area: shippingDetails.area?.trim() || '',
          address: shippingDetails.address.trim(),
          totalOrders: 1,
          totalSpent: totalAmount,
          firstOrderDate: new Date(),
          lastOrderDate: new Date(),
        });
        customerId = newCustomer._id.toString();
      }
    } catch (err) {
      console.warn('[CustomerService] Error upserting customer in MongoDB:', err);
    }
  } else {
    // In-Memory Customer Upsert
    const existingCust = inMemoryCustomers.find((c) => c.phone === normalizedPhone);
    if (existingCust) {
      existingCust.name = shippingDetails.fullName.trim();
      existingCust.city = shippingDetails.city.trim();
      existingCust.address = shippingDetails.address.trim();
      existingCust.totalOrders += 1;
      existingCust.totalSpent += totalAmount;
      existingCust.lastOrderDate = new Date();
      customerId = existingCust.id;
    } else {
      const newCust: ICustomer = {
        id: `cust-${Date.now()}`,
        name: shippingDetails.fullName.trim(),
        phone: normalizedPhone,
        whatsapp: shippingDetails.whatsapp?.trim() || '',
        city: shippingDetails.city.trim(),
        area: shippingDetails.area?.trim() || '',
        address: shippingDetails.address.trim(),
        totalOrders: 1,
        totalSpent: totalAmount,
        firstOrderDate: new Date(),
        lastOrderDate: new Date(),
      };
      inMemoryCustomers.push(newCust);
      customerId = newCust.id;
    }
  }

  // 6. Build Order Document
  const newOrder: IOrder = {
    orderNumber,
    customer: customerId,
    userId: input.userId || null,
    userEmail: input.userEmail ? input.userEmail.toLowerCase().trim() : null,
    shippingDetails: {
      fullName: shippingDetails.fullName.trim(),
      phone: normalizedPhone,
      whatsapp: shippingDetails.whatsapp?.trim() || '',
      city: shippingDetails.city.trim(),
      area: shippingDetails.area?.trim() || '',
      address: shippingDetails.address.trim(),
      landmark: shippingDetails.landmark?.trim() || '',
      notes: shippingDetails.notes?.trim() || '',
    },
    items: validatedItems,
    subtotal: calculatedSubtotal,
    deliveryCharge,
    totalAmount,
    paymentMethod: 'COD',
    status: 'Order Placed',
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: new Date(),
        note: 'Customer placed Cash on Delivery order via website storefront.',
      },
    ],
    source: 'website',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (isMongoConnected()) {
    try {
      const created = await OrderModel.create(newOrder);
      return { order: created.toObject() as IOrder, orderNumber };
    } catch (err) {
      console.error('[OrderService] Mongo order creation failed:', err);
      // Fallback to memory record
    }
  }

  inMemoryOrders.push(newOrder);
  return { order: newOrder, orderNumber };
}

// Secure order tracking lookup requiring BOTH Order Number AND Phone
export async function trackOrder(orderNumber: string, phone: string): Promise<any> {
  const cleanOrderNumber = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.replace(/[^\d+]/g, '').trim();

  if (!cleanOrderNumber || !cleanPhone) {
    throw new Error('Both Order Number and registered Phone Number are required to track an order.');
  }

  let order: IOrder | null = null;

  if (isMongoConnected()) {
    try {
      const doc = await OrderModel.findOne({
        orderNumber: cleanOrderNumber,
        'shippingDetails.phone': cleanPhone,
      }).lean();

      if (doc) {
        order = doc as unknown as IOrder;
      }
    } catch (err) {
      console.warn('[TrackOrder] Mongo query error:', err);
    }
  }

  if (!order) {
    const found = inMemoryOrders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanOrderNumber &&
        o.shippingDetails.phone.replace(/[^\d+]/g, '') === cleanPhone
    );
    if (found) {
      order = found;
    }
  }

  if (!order) {
    // Return safe generic error without disclosing whether order number exists
    throw new Error('No matching order found. Please verify your Order Number and Phone Number.');
  }

  // MASKED RETURN: Return only what is needed for tracking, protect customer privacy
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    statusHistory: order.statusHistory,
    city: order.shippingDetails.city,
    itemCount: order.items.reduce((sum, it) => sum + it.quantity, 0),
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    trackingCode: order.trackingCode || null,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      productName: i.productName,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      image: i.image,
    })),
  };
}

// Lookup by orderNumber for post-order confirmation display
export async function getOrderByNumber(orderNumber: string): Promise<IOrder | null> {
  const cleanOrderNumber = orderNumber.trim().toUpperCase();

  if (isMongoConnected()) {
    try {
      const doc = await OrderModel.findOne({ orderNumber: cleanOrderNumber }).lean();
      if (doc) return doc as unknown as IOrder;
    } catch (e) {
      // ignore
    }
  }

  const found = inMemoryOrders.find((o) => o.orderNumber.toUpperCase() === cleanOrderNumber);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

// ----------------------------------------------------
// Admin Operations
// ----------------------------------------------------

export async function getAllOrdersAdmin(filters?: {
  status?: string;
  search?: string;
  limit?: number;
}): Promise<IOrder[]> {
  let orders: IOrder[] = [];

  if (isMongoConnected()) {
    try {
      const query: any = {};
      if (filters?.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      if (filters?.search) {
        const reg = new RegExp(filters.search.trim(), 'i');
        query.$or = [
          { orderNumber: reg },
          { 'shippingDetails.fullName': reg },
          { 'shippingDetails.phone': reg },
          { 'shippingDetails.city': reg },
          { trackingCode: reg },
        ];
      }
      const docs = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
      orders = docs as unknown as IOrder[];
    } catch (err) {
      console.warn('[AdminOrders] Mongo fetch error, using in-memory orders:', err);
    }
  }

  if (orders.length === 0) {
    orders = JSON.parse(JSON.stringify(inMemoryOrders));

    if (filters?.status && filters.status !== 'all') {
      orders = orders.filter((o) => o.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.shippingDetails.fullName.toLowerCase().includes(q) ||
          o.shippingDetails.phone.includes(q) ||
          o.shippingDetails.city.toLowerCase().includes(q) ||
          (o.trackingCode && o.trackingCode.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  if (filters?.limit && filters.limit > 0) {
    orders = orders.slice(0, filters.limit);
  }

  return orders;
}

export async function updateOrderStatusAdmin(
  orderNumber: string,
  newStatus: OrderStatus,
  trackingCode?: string,
  note?: string
): Promise<IOrder> {
  const cleanOrderNumber = orderNumber.trim().toUpperCase();

  const historyEntry = {
    status: newStatus,
    timestamp: new Date(),
    note: note || `Order status updated to "${newStatus}" by Store Admin.`,
  };

  if (isMongoConnected()) {
    try {
      const updateData: any = {
        status: newStatus,
        $push: { statusHistory: historyEntry },
      };
      if (trackingCode !== undefined) {
        updateData.trackingCode = trackingCode ? trackingCode.trim() : null;
      }

      const doc = await OrderModel.findOneAndUpdate(
        { orderNumber: cleanOrderNumber },
        updateData,
        { new: true }
      ).lean();

      if (doc) {
        return doc as unknown as IOrder;
      }
    } catch (err) {
      console.warn('[AdminOrders] Mongo update error, falling back to memory:', err);
    }
  }

  const memoryIndex = inMemoryOrders.findIndex((o) => o.orderNumber.toUpperCase() === cleanOrderNumber);
  if (memoryIndex === -1) {
    throw new Error(`Order ${orderNumber} not found.`);
  }

  const existing = inMemoryOrders[memoryIndex];
  existing.status = newStatus;
  existing.updatedAt = new Date();
  if (trackingCode !== undefined) {
    existing.trackingCode = trackingCode ? trackingCode.trim() : null;
  }
  existing.statusHistory.push(historyEntry);

  return existing;
}

export async function getAdminStats() {
  const allOrders = await getAllOrdersAdmin();

  let totalRevenue = 0;
  let nonCancelledCount = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;

  const ordersByStatus: Record<string, number> = {
    'Order Placed': 0,
    Confirmed: 0,
    Processing: 0,
    Packed: 0,
    Shipped: 0,
    'Out for Delivery': 0,
    Delivered: 0,
    Cancelled: 0,
    Returned: 0,
  };

  // Product sales map
  const productSalesMap: Record<string, { name: string; units: number; revenue: number; image: string }> = {};

  allOrders.forEach((o) => {
    if (ordersByStatus[o.status] !== undefined) {
      ordersByStatus[o.status]++;
    } else {
      ordersByStatus[o.status] = 1;
    }

    if (o.status !== 'Cancelled' && o.status !== 'Returned') {
      totalRevenue += o.totalAmount;
      nonCancelledCount++;
    }

    if (['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery'].includes(o.status)) {
      pendingOrders++;
    } else if (o.status === 'Delivered') {
      deliveredOrders++;
    } else if (o.status === 'Cancelled') {
      cancelledOrders++;
    }

    // Tally items
    if (o.status !== 'Cancelled') {
      o.items.forEach((it) => {
        if (!productSalesMap[it.productId]) {
          productSalesMap[it.productId] = {
            name: it.productName,
            units: 0,
            revenue: 0,
            image: it.image,
          };
        }
        productSalesMap[it.productId].units += it.quantity;
        productSalesMap[it.productId].revenue += it.subtotal;
      });
    }
  });

  const averageOrderValue = nonCancelledCount > 0 ? Math.round(totalRevenue / nonCancelledCount) : 0;

  // Generate last 7 days sales timeline
  const daysTrend: Array<{ date: string; revenue: number; orders: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    const dayOrders = allOrders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= dayStart && t < dayEnd && o.status !== 'Cancelled';
    });

    const dayRev = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    daysTrend.push({
      date: dateStr,
      revenue: dayRev,
      orders: dayOrders.length,
    });
  }

  // Top products
  const topSellingProducts = Object.entries(productSalesMap)
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders: allOrders.length,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    averageOrderValue,
    ordersByStatus,
    salesTrend: daysTrend,
    topSellingProducts,
    recentOrders: allOrders.slice(0, 8),
  };
}

export async function getAdminCustomers(): Promise<any[]> {
  const allOrders = await getAllOrdersAdmin();
  const customerMap: Record<string, {
    id: string;
    fullName: string;
    phone: string;
    city: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: Date | string;
    lastOrderNumber: string;
    orders: Array<{ orderNumber: string; date: Date | string; total: number; status: string }>;
  }> = {};

  allOrders.forEach((o) => {
    const phone = o.shippingDetails.phone.replace(/[^\d+]/g, '').trim();
    if (!phone) return;

    if (!customerMap[phone]) {
      customerMap[phone] = {
        id: `cust-${phone}`,
        fullName: o.shippingDetails.fullName,
        phone: o.shippingDetails.phone,
        city: o.shippingDetails.city,
        address: o.shippingDetails.address,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: o.createdAt,
        lastOrderNumber: o.orderNumber,
        orders: [],
      };
    }

    customerMap[phone].totalOrders += 1;
    if (o.status !== 'Cancelled') {
      customerMap[phone].totalSpent += o.totalAmount;
    }
    customerMap[phone].orders.push({
      orderNumber: o.orderNumber,
      date: o.createdAt,
      total: o.totalAmount,
      status: o.status,
    });
  });

  return Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
}

/**
 * Fetch orders belonging exclusively to a specific authenticated customer
 */
export async function getCustomerOrders(
  userId: string,
  userEmail: string,
  userPhone: string
): Promise<IOrder[]> {
  const cleanPhone = userPhone.replace(/[^\d+]/g, '').trim();
  const normalizedEmail = userEmail.toLowerCase().trim();

  if (isMongoConnected()) {
    try {
      const queryOr: any[] = [];
      if (userId) queryOr.push({ userId });
      if (normalizedEmail) queryOr.push({ userEmail: normalizedEmail });
      if (cleanPhone) queryOr.push({ 'shippingDetails.phone': { $regex: cleanPhone } });

      const orders = await OrderModel.find(queryOr.length > 0 ? { $or: queryOr } : { userId }).sort({
        createdAt: -1,
      });

      return orders.map((o) => (o.toObject ? (o.toObject() as IOrder) : o));
    } catch (err) {
      console.error('[OrderService] Error fetching customer orders from Mongo:', err);
    }
  }

  // In-Memory store lookup
  return inMemoryOrders
    .filter((o) => {
      const orderPhone = o.shippingDetails?.phone?.replace(/[^\d+]/g, '').trim();
      const matchUserId = Boolean(o.userId && o.userId === userId);
      const matchEmail = Boolean(o.userEmail && o.userEmail.toLowerCase() === normalizedEmail);
      const matchPhone = Boolean(orderPhone && cleanPhone && orderPhone.includes(cleanPhone));
      return matchUserId || matchEmail || matchPhone;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Fetch single order with ownership validation (Admin or owner customer only)
 */
export async function getOrderDetailsForUser(
  orderNumber: string,
  user: { id?: string; _id?: string; email: string; phone: string; role: string }
): Promise<IOrder> {
  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    throw new Error('Order not found.');
  }

  if (user.role === 'admin') {
    return order;
  }

  const userId = user.id || user._id?.toString();
  const cleanUserPhone = user.phone.replace(/[^\d+]/g, '').trim();
  const cleanOrderPhone = order.shippingDetails?.phone?.replace(/[^\d+]/g, '').trim();

  const isOwner =
    (order.userId && order.userId.toString() === userId) ||
    (order.userEmail && order.userEmail.toLowerCase() === user.email.toLowerCase()) ||
    (cleanUserPhone && cleanOrderPhone && cleanUserPhone === cleanOrderPhone);

  if (!isOwner) {
    throw new Error('Access denied. You do not have permission to view this order.');
  }

  return order;
}


