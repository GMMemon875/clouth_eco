import { isMongoConnected } from '../config/db';
import { StoreSettingsModel } from '../models/StoreSettings';
import { defaultStoreSettings } from '../config/settings';
import { IStoreSettings } from '../types';

let currentSettings: IStoreSettings = { ...defaultStoreSettings };

export async function getStoreSettings(): Promise<IStoreSettings> {
  if (isMongoConnected()) {
    try {
      const doc = await StoreSettingsModel.findOne({ key: 'store_config' }).lean();
      if (doc) {
        return doc as unknown as IStoreSettings;
      } else {
        // Initialize default in MongoDB
        await StoreSettingsModel.create(defaultStoreSettings);
        return defaultStoreSettings;
      }
    } catch (err) {
      console.warn('[SettingsService] Mongo lookup failed, returning default settings', err);
    }
  }

  // Use environment overrides if present
  if (process.env.VITE_WHATSAPP_NUMBER) {
    currentSettings.whatsappNumber = process.env.VITE_WHATSAPP_NUMBER;
  }

  return currentSettings;
}
