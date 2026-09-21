import mongoose, { Schema, Document } from 'mongoose';
import { IStoreSettings } from '../types';

export interface IStoreSettingsDocument extends IStoreSettings, Document {}

const StoreSettingsSchema = new Schema<IStoreSettingsDocument>(
  {
    key: { type: String, required: true, unique: true, default: 'store_config' },
    brandName: { type: String, default: 'Noor & Co. Pakistani Couture' },
    whatsappNumber: { type: String, required: true, default: '923001234567' },
    contactEmail: { type: String, default: 'support@noorclothing.pk' },
    delivery: {
      enabled: { type: Boolean, default: true },
      standardCharge: { type: Number, default: 250 },
      freeDeliveryThreshold: { type: Number, default: 3500 },
      estimatedDays: { type: String, default: '3-5 Working Days Nationwide' },
    },
    codEnabled: { type: Boolean, default: true },
    announcementText: {
      type: String,
      default: '✨ FREE Nationwide Delivery on orders above Rs. 3,500 | Cash on Delivery Available Across Pakistan 🇵🇰',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/noorclothing.pk' },
      facebook: { type: String, default: 'https://facebook.com/noorclothing.pk' },
      tiktok: { type: String, default: 'https://tiktok.com/@noorclothing.pk' },
    },
  },
  {
    timestamps: true,
  }
);

export const StoreSettingsModel =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettingsDocument>('StoreSettings', StoreSettingsSchema);
