import React from 'react';
import { Heart, ShoppingBag, Phone, Check } from 'lucide-react';
import { IProduct } from '../../types/store';
import { formatPKR, calculateDiscountPercent } from '../../utils/formatters';
import { buildWhatsAppInquiryUrl } from '../../utils/whatsapp';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

interface ProductCardProps {
  product: IProduct;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const productId = product.id || (product as any)._id || product.sku;
  const wishlisted = isInWishlist(productId);

  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;
  const secondaryImage = product.images[1]?.url || primaryImage;

  // Compute total variant stock
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  // Discount
  const discountPercent = calculateDiscountPercent(product.basePrice, product.compareAtPrice);

  // Default first variant for quick actions
  const defaultVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (defaultVariant) {
      const url = buildWhatsAppInquiryUrl(product, defaultVariant, 1, settings.whatsappNumber);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (defaultVariant && !isOutOfStock) {
      addToCart(product, defaultVariant, 1);
    } else {
      onNavigate(`/product/${product.slug}`);
    }
  };

  return (
    <div
      id={`product-card-${product.sku}`}
      onClick={() => onNavigate(`/product/${product.slug}`)}
      className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col hover:shadow-xl hover:border-stone-300 transition-all duration-300 cursor-pointer"
    >
      {/* Image Container with Badges & Wishlist */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Secondary image hover fade if available */}
        {secondaryImage && secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} detail`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badges on top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.newArrival && (
            <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-sm">
              NEW
            </span>
          )}
          {product.bestSeller && (
            <span className="px-2 py-0.5 bg-[#c5a880] text-stone-900 text-[10px] font-bold tracking-wider uppercase rounded shadow-sm">
              BEST SELLER
            </span>
          )}
          {product.sale && discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-[#8b3a42] text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-sm">
              LOW STOCK
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-stone-600 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-sm">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.sku}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-white/80 text-stone-700 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick action overlay on desktop */}
        <div className="absolute inset-x-2 bottom-2 z-10 hidden sm:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            id={`quick-whatsapp-${product.sku}`}
            type="button"
            onClick={handleQuickWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-md transition"
            title="Order on WhatsApp"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="truncate">WhatsApp</span>
          </button>
          <button
            id={`quick-add-${product.sku}`}
            type="button"
            onClick={handleQuickAddToCart}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-stone-900 hover:bg-[#8b3a42] text-white text-xs font-semibold rounded-lg shadow-md transition disabled:opacity-50"
            title="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="truncate">{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] text-stone-500 font-mono">
            <span>{product.sku}</span>
            <span className="capitalize text-stone-600 font-sans">{product.fabric}</span>
          </div>

          <h3 className="font-medium text-xs sm:text-sm text-stone-900 mt-1 line-clamp-2 leading-snug group-hover:text-[#8b3a42] transition-colors">
            {product.name}
          </h3>

          {/* Color & Size Swatches */}
          <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
            {Array.from(new Set(product.variants.map((v) => v.colorCode || '#000'))).map((code, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                style={{ backgroundColor: code }}
              />
            ))}
            <span className="text-[10px] text-stone-400 ml-1">
              ({product.variants.map((v) => v.size).filter((val, i, arr) => arr.indexOf(val) === i).join(', ')})
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-[#8b3a42]">
              {formatPKR(product.basePrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPKR(product.compareAtPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            COD
          </span>
        </div>

        {/* Mobile Action Buttons (Persistent for mobile touch ergonomics) */}
        <div className="mt-3 pt-2 grid grid-cols-2 gap-1.5 sm:hidden">
          <button
            type="button"
            onClick={handleQuickWhatsApp}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold rounded-lg"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleQuickAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-stone-900 text-white text-[11px] font-semibold rounded-lg disabled:opacity-50"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{isOutOfStock ? 'Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
