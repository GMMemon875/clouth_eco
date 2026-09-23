import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Phone,
  Mail,
  Instagram,
  Facebook,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <footer id="main-footer" className="bg-stone-900 text-stone-300 pt-16 pb-24 md:pb-12 border-t border-stone-800">
      {/* Trust bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-800 text-[#c5a880] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Nationwide Delivery</h3>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Fast shipping across 200+ cities in Pakistan
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-800 text-[#c5a880] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Cash on Delivery</h3>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Pay safely with cash when your parcel arrives
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-800 text-[#c5a880] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">7-Day Easy Exchange</h3>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Hassle-free size or fabric replacement guarantee
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-800 text-[#c5a880] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">WhatsApp Support</h3>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Real assistance from 10 AM to 10 PM daily
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                NOOR & CO.
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#c5a880] font-semibold uppercase block">
                Pakistani Couture
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Celebrating the heritage of Pakistani craftsmanship, pure Swiss lawn weaves, and timeless embroidery.
              Designed for the modern woman who values luxury, grace, and effortless everyday comfort.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-[#8b3a42] transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-[#8b3a42] transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-600 transition"
                aria-label="WhatsApp Contact"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Collections</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('/shop?category=3-piece-suits')} className="hover:text-white transition">
                  3-Piece Luxury Suits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=2-piece-suits')} className="hover:text-white transition">
                  2-Piece Everyday Suits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=luxury-lawn')} className="hover:text-white transition">
                  Luxury Swiss Lawn
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=ready-to-wear')} className="hover:text-white transition">
                  Ready to Wear Pret
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=unstitched')} className="hover:text-white transition">
                  Unstitched Fabrics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?sale=true')} className="hover:text-[#c5a880] transition">
                  Seasonal Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('/track-order')} className="hover:text-white transition">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-white transition">
                  FAQs & Sizing Help
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/return-policy')} className="hover:text-white transition">
                  Exchange & Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition">
                  About Our Craft
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Order Inquiries</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Have questions about suit measurements or custom orders? Reach our design concierge:
            </p>
            <div className="space-y-2 text-xs text-stone-300">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>+{settings.whatsappNumber}</span>
              </a>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 bg-stone-800 text-[#c5a880] text-[11px] font-medium rounded-md border border-stone-700">
                Cash on Delivery Available Nationwide
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved. Phase 1 Production Storefront.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-stone-300 transition">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('/terms')} className="hover:text-stone-300 transition">
            Terms of Service
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('/dashboard')} className="text-amber-400 hover:text-amber-300 font-semibold transition">
            Store Manager Dashboard
          </button>
        </div>
      </div>
    </footer>
  );
};
