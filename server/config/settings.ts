import { IStoreSettings } from '../types';

export const defaultStoreSettings: IStoreSettings = {
  key: 'store_config',
  brandName: 'Noor & Co. Pakistani Couture',
  whatsappNumber: process.env.VITE_WHATSAPP_NUMBER || '923001234567',
  contactEmail: 'support@noorclothing.pk',
  delivery: {
    enabled: true,
    standardCharge: 250, // Standard PKR 250 across Pakistan
    freeDeliveryThreshold: 3500, // Orders PKR 3500+ qualify for Free Nationwide Delivery
    estimatedDays: '3-5 Working Days Nationwide',
  },
  codEnabled: true,
  announcementText: '✨ FREE Nationwide Delivery on orders above Rs. 3,500 | Cash on Delivery Available Across Pakistan 🇵🇰',
  socialLinks: {
    instagram: 'https://instagram.com/noorclothing.pk',
    facebook: 'https://facebook.com/noorclothing.pk',
    tiktok: 'https://tiktok.com/@noorclothing.pk',
  },
};
