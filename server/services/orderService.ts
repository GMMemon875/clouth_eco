import { isMongoConnected } from '../config/db';
import { OrderModel } from '../models/Order';
import { CustomerModel } from '../models/Customer';
import { getProductById, decrementVariantStock } from './productService';
import { getStoreSettings } from './settingsService';
import { generateOrderNumber } from '../utils/orderNumber';
import { IOrder, IOrderItem, IShippingDetails, ICustomer } from '../types';

// In-Memory store for development resilience
const inMemoryOrders: IOrder[] = [];
const inMemoryCustomers: ICustomer[] = [];

export interface ICreateOrderItemInput {
  productId: string;
  variantSku: string;
  quantity: number;
}

export interface ICreateOrderInput {
  shippingDetails: IShippingDetails;
  items: ICreateOrderItemInput[];
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
