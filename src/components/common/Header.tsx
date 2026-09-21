import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Compass,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSearchSubmit?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onSearchSubmit }) => {
  const { totalCartItems, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchTerm.trim());
      } else {
        onNavigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      }
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Collections', path: '/shop' },
    { label: '3-Piece', path: '/shop?category=3-piece-suits' },
    { label: '2-Piece', path: '/shop?category=2-piece-suits' },
    { label: 'Luxury Lawn', path: '/shop?category=luxury-lawn' },
    { label: 'Ready-to-Wear', path: '/shop?category=ready-to-wear' },
    { label: 'Unstitched', path: '/shop?category=unstitched' },
    { label: 'Track Order', path: '/track-order' },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
            <button
              id="brand-logo"
              onClick={() => onNavigate('/')}
              className="text-left group transition-transform focus:outline-none"
            >
              <span className="block font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-[#8b3a42] transition-colors">
                NOOR & CO.
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-[#c5a880] font-semibold uppercase -mt-1 font-sans">
                Pakistani Couture
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.label}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onNavigate(link.path)}
                  className={`text-sm font-medium tracking-wide transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#8b3a42] font-semibold'
                      : 'text-stone-700 hover:text-[#8b3a42]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8b3a42] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search Button */}
            <button
              id="search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-700 hover:text-[#8b3a42] hover:bg-stone-100 rounded-full transition"
              aria-label="Search clothing items"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp Quick Link */}
            <a
              id="header-whatsapp-link"
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                'Assalam-o-Alaikum, I am inquiring from your website storefront.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
              title="Chat with fashion consultant on WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => onNavigate('/wishlist')}
              className="p-2 text-stone-700 hover:text-[#8b3a42] hover:bg-stone-100 rounded-full transition relative"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span
                  id="wishlist-badge"
                  className="absolute 0 top-0.5 right-0.5 bg-[#8b3a42] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow"
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-stone-700 hover:text-[#8b3a42] hover:bg-stone-100 rounded-full transition relative"
              aria-label={`Shopping bag, ${totalCartItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span
                  id="cart-badge"
                  className="absolute 0 top-0.5 right-0.5 bg-[#8b3a42] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow"
                >
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div id="header-search-bar" className="py-3 border-t border-stone-200 animate-in fade-in duration-200">
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by suit name, SKU (e.g. LS-101), fabric, lawn, embroidered..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900 placeholder:text-stone-400"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#8b3a42] text-white text-sm font-semibold rounded-xl hover:bg-[#6b232a] transition shadow-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden fixed inset-x-0 top-[113px] bg-white border-b border-stone-200 shadow-xl max-h-[80vh] overflow-y-auto z-50">
          <div className="px-4 py-6 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#c5a880] px-3">
              Shop Collections
            </div>
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    onNavigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                    currentPath === link.path
                      ? 'bg-stone-100 text-[#8b3a42] font-semibold'
                      : 'text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <Compass className="w-4 h-4 text-stone-400" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum, I would like to order on WhatsApp.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow"
              >
                <Phone className="w-4 h-4" />
                <span>Order Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
