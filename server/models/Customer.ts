import mongoose, { Schema, Document } from 'mongoose';
import { ICustomer } from '../types';

export interface ICustomerDocument extends Omit<ICustomer, 'id' | '_id'>, Document {}

const CustomerSchema = new Schema<ICustomerDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    whatsapp: { type: String, default: '' },
    city: { type: String, required: true, trim: true },
    area: { type: String, default: '' },
    address: { type: String, required: true },
    totalOrders: { type: Number, default: 1 },
    totalSpent: { type: Number, default: 0 },
    firstOrderDate: { type: Date, default: Date.now },
    lastOrderDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const CustomerModel = mongoose.models.Customer || mongoose.model<ICustomerDocument>('Customer', CustomerSchema);
