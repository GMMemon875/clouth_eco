import React from 'react';
import { Home, Compass, Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath, onNavigate }) => {
  const { totalCartItems, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();

  const waNumber = settings.whatsappNumber.replace(/[^\d]/g, '');

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl px-2 py-1.5"
    >
      <div className="grid grid-cols-5 items-center justify-items-center">
        {/* 1. Home */}
        <button
          id="mobile-nav-home"
          onClick={() => onNavigate('/')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
            currentPath === '/' ? 'text-[#8b3a42] font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 2. Shop */}
        <button
          id="mobile-nav-shop"
          onClick={() => onNavigate('/shop')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
            currentPath.startsWith('/shop')
              ? 'text-[#8b3a42] font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          aria-label="Shop Catalog"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Catalog</span>
        </button>

        {/* 3. Wishlist */}
        <button
          id="mobile-nav-wishlist"
          onClick={() => onNavigate('/wishlist')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-xs font-medium relative transition-colors ${
            currentPath === '/wishlist'
              ? 'text-[#8b3a42] font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          aria-label={`Wishlist, ${wishlistCount} items`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px]">Wishlist</span>
          {wishlistCount > 0 && (
            <span
              id="mobile-wishlist-badge"
              className="absolute top-1 right-2 bg-[#8b3a42] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              {wishlistCount}
            </span>
          )}
        </button>

        {/* 4. Cart */}
        <button
          id="mobile-nav-cart"
          onClick={() => setIsCartDrawerOpen(true)}
          className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-stone-600 hover:text-stone-900 relative transition-colors"
          aria-label={`Cart, ${totalCartItems} items`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Bag</span>
          {totalCartItems > 0 && (
            <span
              id="mobile-cart-badge"
              className="absolute top-1 right-2 bg-[#8b3a42] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              {totalCartItems}
            </span>
          )}
        </button>

        {/* 5. WhatsApp Quick Action */}
        <a
          id="mobile-nav-whatsapp"
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
            'Assalam-o-Alaikum, I am browsing your website and have an inquiry.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-semibold">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
};
