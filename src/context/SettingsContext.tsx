import React, { createContext, useContext, useEffect, useState } from 'react';
import { IStoreSettings } from '../types/store';
import { fetchStoreSettings } from '../api';

const defaultSettings: IStoreSettings = {
  key: 'store_config',
  brandName: 'Noor & Co. Pakistani Couture',
  whatsappNumber: '923001234567',
  contactEmail: 'support@noorclothing.pk',
  delivery: {
    enabled: true,
    standardCharge: 250,
    freeDeliveryThreshold: 3500,
    estimatedDays: '3-5 Working Days Nationwide',
  },
  codEnabled: true,
  announcementText: '✨ FREE Nationwide Delivery on orders above Rs. 3,500 | Cash on Delivery Available Across Pakistan 🇵🇰',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
  },
};

interface SettingsContextType {
  settings: IStoreSettings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<IStoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((err) => {
        console.warn('Settings load fallback:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
