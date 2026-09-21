import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, IOrderItem, IOrderStatusHistory, IShippingDetails } from '../types';

export interface IOrderDocument extends Omit<IOrder, 'id' | '_id'>, Document {}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    variantSku: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const ShippingDetailsSchema = new Schema<IShippingDetails>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    whatsapp: { type: String, default: '' },
    city: { type: String, required: true },
    area: { type: String, default: '' },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    shippingDetails: { type: ShippingDetailsSchema, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
    status: {
      type: String,
      enum: [
        'Order Placed',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
      ],
      default: 'Order Placed',
      index: true,
    },
    statusHistory: [OrderStatusHistorySchema],
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'instagram', 'facebook', 'tiktok', 'agent', 'ai_assistant'],
      default: 'website',
    },
    trackingCode: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
