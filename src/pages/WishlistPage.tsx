import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';

interface WishlistPageProps {
  onNavigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Your Wishlist is Empty"
          description="Save your favorite embroidered lawns and pret collections to revisit anytime."
          actionText="Discover Collections"
          onAction={() => onNavigate('/shop')}
          icon={<Heart className="w-8 h-8 text-stone-400" />}
        />
      </div>
    );
  }

  return (
    <div id="wishlist-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <button
          onClick={() => onNavigate('/shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Saved Favorites ({wishlist.length})
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => {
          const productId = product.id || (product as any)._id || product.sku;
          const primaryImage =
            product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;
          const defaultVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];

          return (
            <div
              key={product.sku}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-xs hover:shadow-md transition"
            >
              <div
                className="aspect-[3/4] bg-stone-100 relative cursor-pointer"
                onClick={() => onNavigate(`/product/${product.slug}`)}
              >
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(productId);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/80 rounded-full text-stone-500 hover:text-red-600 transition"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block">{product.sku}</span>
                  <h3
                    onClick={() => onNavigate(`/product/${product.slug}`)}
                    className="font-medium text-xs sm:text-sm text-stone-900 line-clamp-2 cursor-pointer hover:text-[#8b3a42] transition"
                  >
                    {product.name}
                  </h3>
                  <div className="text-xs font-bold text-[#8b3a42] mt-1.5">
                    {formatPKR(product.basePrice)}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (defaultVariant) {
                        addToCart(product, defaultVariant, 1);
                      } else {
                        onNavigate(`/product/${product.slug}`);
                      }
                    }}
                    className="flex-1 py-2 px-3 bg-stone-900 hover:bg-[#8b3a42] text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
