import React from 'react';
import { Truck, PhoneCall } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div
      id="announcement-bar"
      className="bg-stone-900 text-stone-200 text-xs py-2 px-4 font-medium transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
          <span className="tracking-wide">
            {settings.announcementText}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-stone-300">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#c5a880] transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#c5a880]" />
            <span>WhatsApp: +{settings.whatsappNumber}</span>
          </a>
          <span className="text-stone-600">|</span>
          <span>EST Delivery: {settings.delivery.estimatedDays}</span>
        </div>
      </div>
    </div>
  );
};
