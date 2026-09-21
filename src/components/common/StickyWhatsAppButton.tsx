import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const StickyWhatsAppButton: React.FC = () => {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  const waNumber = settings.whatsappNumber.replace(/[^\d]/g, '');
  const chatUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalam-o-Alaikum, I am browsing your website and would like to order or ask a question.'
  )}`;

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-2 group"
    >
      {/* Tooltip callout */}
      {showTooltip && (
        <div
          id="whatsapp-callout-bubble"
          className="hidden sm:flex items-center gap-2 bg-stone-900 text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-xl border border-stone-800 animate-in fade-in slide-in-from-right-2"
        >
          <span>Need help? Order on WhatsApp!</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-stone-400 hover:text-stone-100 p-0.5 rounded"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        id="floating-whatsapp-btn"
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white ring-4 ring-emerald-500/20"
        aria-label="Chat with fashion consultant on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
