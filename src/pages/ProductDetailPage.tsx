import React, { useEffect, useState, useMemo } from 'react';
import {
  ChevronRight,
  Heart,
  ShoppingBag,
  Phone,
  Ruler,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { IProduct, IVariant } from '../types/store';
import { fetchProductBySlug, fetchRelatedProducts } from '../api';
import { ProductGallery } from '../components/product/ProductGallery';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { formatPKR, calculateDiscountPercent } from '../utils/formatters';
import {
  buildWhatsAppInquiryUrl,
  buildProductQuestionWhatsAppUrl,
} from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Variant & Quantity selection state
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'measurements' | 'delivery' | 'care'>('details');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError(null);

    fetchProductBySlug(slug)
      .then((prod) => {
        setProduct(prod);
        // Default to first variant in stock or first variant
        const firstInStock = prod.variants.find((v) => v.stock > 0) || prod.variants[0];
        setSelectedVariant(firstInStock || null);
        setQuantity(1);

        // Fetch related products
        return fetchRelatedProducts(slug);
      })
      .then((rel) => {
        setRelated(rel);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load product details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const productId = product ? product.id || (product as any)._id || product.sku : '';
  const isWishlisted = isInWishlist(productId);

  // Available unique colors and sizes
  const uniqueColors = useMemo(() => {
    if (!product) return [];
    const map = new Map<string, { color: string; colorCode: string }>();
    product.variants.forEach((v) => {
      if (!map.has(v.color)) {
        map.set(v.color, { color: v.color, colorCode: v.colorCode || '#000' });
      }
    });
    return Array.from(map.values());
  }, [product]);

  const currentAvailableSizes = useMemo(() => {
    if (!product || !selectedVariant) return [];
    return product.variants
      .filter((v) => v.color === selectedVariant.color)
      .map((v) => ({
        size: v.size,
        stock: v.stock,
        variant: v,
      }));
  }, [product, selectedVariant]);

  // Handle color click
  const handleColorChange = (colorName: string) => {
    if (!product) return;
    // Find variant with this color and current size if possible, else first in stock
    const matching =
      product.variants.find((v) => v.color === colorName && v.size === selectedVariant?.size) ||
      product.variants.find((v) => v.color === colorName && v.stock > 0) ||
      product.variants.find((v) => v.color === colorName);

    if (matching) {
      setSelectedVariant(matching);
      setQuantity(1);
    }
  };

  // Handle size click
  const handleSizeChange = (variant: IVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleWhatsAppOrder = () => {
    if (!product || !selectedVariant) return;
    const url = buildWhatsAppInquiryUrl(
      product,
      selectedVariant,
      quantity,
      settings.whatsappNumber
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAskQuestion = () => {
    if (!product) return;
    const url = buildProductQuestionWhatsAppUrl(product, settings.whatsappNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Noor & Co.`,
          url: window.location.href,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState
          title="Outfit Not Found"
          message={error || 'The requested clothing item could not be retrieved.'}
          onRetry={() => onNavigate('/shop')}
        />
      </div>
    );
  }

  const currentPrice = product.basePrice + (selectedVariant?.additionalPrice || 0);
  const discountPercent = calculateDiscountPercent(currentPrice, product.compareAtPrice);
  const currentStock = selectedVariant ? selectedVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  return (
    <div id="product-detail-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 pb-24 md:pb-16">
      {/* Breadcrumb Navigation */}
      <nav id="product-breadcrumbs" aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap">
        <button onClick={() => onNavigate('/')} className="hover:text-stone-900 transition">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <button onClick={() => onNavigate('/shop')} className="hover:text-stone-900 transition">
          Collections
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <button
          onClick={() => onNavigate(`/shop?category=${product.category}`)}
          className="hover:text-stone-900 transition capitalize"
        >
          {product.category.replace(/-/g, ' ')}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout: Gallery Left + Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#8b3a42] tracking-wider uppercase">
                SKU: {selectedVariant?.sku || product.sku}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition"
                  aria-label="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-lg transition ${
                    isWishlisted
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-stone-500 hover:text-rose-600 hover:bg-stone-100'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="font-medium bg-stone-100 px-2.5 py-1 rounded-md text-stone-800">
                Fabric: {product.fabric}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Cash on Delivery</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#8b3a42]">
                  {formatPKR(currentPrice)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <span className="text-sm sm:text-base text-stone-400 line-through">
                    {formatPKR(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                Price includes all taxes. Delivery calculated at checkout.
              </span>
            </div>

            {discountPercent > 0 && (
              <span className="px-3 py-1 bg-[#8b3a42] text-white text-xs font-bold rounded-lg shadow-xs">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {/* Stock Status Notification Banner */}
          <div>
            {isOutOfStock ? (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Selected variant is currently sold out. Inquire on WhatsApp for next restock.</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hurry! Only <strong>{currentStock}</strong> left in stock for this variant.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>In Stock ({currentStock} ready to ship)</span>
              </div>
            )}
          </div>

          {/* Color Selector */}
          {uniqueColors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider">
                  Color: <strong className="text-[#8b3a42] capitalize">{selectedVariant?.color}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {uniqueColors.map((c) => {
                  const isSelected = selectedVariant?.color === c.color;
                  return (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => handleColorChange(c.color)}
                      className={`group flex items-center gap-2 p-1.5 pr-3 rounded-full border transition ${
                        isSelected
                          ? 'border-[#8b3a42] bg-stone-100 ring-2 ring-[#8b3a42]/20'
                          : 'border-stone-300 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-stone-300 shadow-xs shrink-0"
                        style={{ backgroundColor: c.colorCode }}
                      />
                      <span className="text-xs font-medium text-stone-800">{c.color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector + Size Guide Link */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900 uppercase tracking-wider">
                Size: <strong className="text-[#8b3a42]">{selectedVariant?.size}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-1 text-[#8b3a42] hover:text-[#6b232a] font-semibold underline underline-offset-2 transition"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>View Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {currentAvailableSizes.map(({ size, stock, variant }) => {
                const isSelected = selectedVariant?.sku === variant.sku;
                const outOfStock = stock <= 0;
                return (
                  <button
                    key={variant.sku}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => handleSizeChange(variant)}
                    className={`relative py-3 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : outOfStock
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed line-through'
                        : 'bg-white text-stone-800 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span>{size}</span>
                    <span className="text-[10px] font-normal opacity-80 mt-0.5">
                      {outOfStock ? 'Sold Out' : `${stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-xs">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded-l-xl transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-bold text-stone-900 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= currentStock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded-r-xl transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-stone-500">
                Total: <strong className="text-stone-900">{formatPKR(currentPrice * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* 1. ORDER ON WHATSAPP (Flow A requirement) */}
            <button
              id="product-whatsapp-order-btn"
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition shadow-md disabled:opacity-50"
            >
              <Phone className="w-4 h-4" />
              <span>Order on WhatsApp (Instant Confirmation)</span>
            </button>

            {/* 2. ADD TO BAG (Cart Flow) */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="product-add-to-cart-btn"
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-[#8b3a42] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>

              <button
                id="product-buy-now-btn"
                type="button"
                onClick={() => {
                  if (product && selectedVariant) {
                    addToCart(product, selectedVariant, quantity);
                    onNavigate('/checkout');
                  }
                }}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md disabled:opacity-50"
              >
                <span>Buy with COD</span>
              </button>
            </div>

            {/* 3. Inquire on WhatsApp */}
            <button
              type="button"
              onClick={handleAskQuestion}
              className="w-full text-center py-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 transition"
            >
              Have a question about this suit? Ask our stylist on WhatsApp
            </button>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-200 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <Truck className="w-4 h-4 text-[#8b3a42] mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-stone-800">Nationwide</span>
              <span className="text-[10px] text-stone-500">3-5 Days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-stone-800">Cash on Delivery</span>
              <span className="text-[10px] text-stone-500">Safe & Verified</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <RotateCcw className="w-4 h-4 text-amber-700 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-stone-800">7-Day Exchange</span>
              <span className="text-[10px] text-stone-500">Hassle-Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tabbed Specifications Section */}
      <div className="pt-8 border-t border-stone-200">
        <div className="flex border-b border-stone-200 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#8b3a42] text-[#8b3a42]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Fabric & Description
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 whitespace-nowrap ${
              activeTab === 'measurements'
                ? 'border-[#8b3a42] text-[#8b3a42]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Ensemble Pieces
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-[#8b3a42] text-[#8b3a42]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Delivery & COD Policy
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 whitespace-nowrap ${
              activeTab === 'care'
                ? 'border-[#8b3a42] text-[#8b3a42]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Wash & Fabric Care
          </button>
        </div>

        <div className="py-6 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
          {activeTab === 'details' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p>{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="block text-stone-900 font-bold mb-1">Primary Fabric</strong>
                  <span>{product.fabric}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="block text-stone-900 font-bold mb-1">Collection</strong>
                  <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'measurements' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {product.shirtDetails && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 font-bold block mb-0.5">Shirt / Kameez:</strong>
                  <span>{product.shirtDetails}</span>
                </div>
              )}
              {product.trouserDetails && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 font-bold block mb-0.5">Trouser / Shalwar:</strong>
                  <span>{product.trouserDetails}</span>
                </div>
              )}
              {product.dupattaDetails && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 font-bold block mb-0.5">Dupatta / Shawl:</strong>
                  <span>{product.dupattaDetails}</span>
                </div>
              )}
              {product.measurements && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 font-bold block">Tailoring Specifications:</strong>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    {product.measurements.chest && <div>Chest: {product.measurements.chest}</div>}
                    {product.measurements.length && <div>Length: {product.measurements.length}</div>}
                    {product.measurements.sleeve && <div>Sleeve: {product.measurements.sleeve}</div>}
                    {product.measurements.trouser && <div>Trouser: {product.measurements.trouser}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p>
                We deliver nationwide across Pakistan via trusted courier partners (TCS, Leopards, Call Courier).
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Estimated Delivery Time: <strong>{settings.delivery.estimatedDays}</strong></li>
                <li>Delivery Charges: <strong>{formatPKR(settings.delivery.standardCharge)}</strong> flat nationwide</li>
                <li>Free Nationwide Delivery on orders exceeding <strong>{formatPKR(settings.delivery.freeDeliveryThreshold)}</strong></li>
                <li>Payment: Verified Cash on Delivery (COD) upon receiving your package</li>
              </ul>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Dry clean recommended for heavy embroidered pieces and pure chiffon dupattas.</li>
                <li>Hand wash gently in cold water with mild detergent for unstitched lawn fabrics.</li>
                <li>Do not bleach or use stain-removing chemicals.</li>
                <li>Iron at moderate temperature inside out.</li>
                <li>Dry in shade to preserve reactive yarn luster and color fastness.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Stage */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              You May Also Admire
            </h3>
            <button
              onClick={() => onNavigate('/shop')}
              className="text-xs font-bold text-[#8b3a42] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.slice(0, 4).map((rel) => (
              <ProductCard key={rel.sku} product={rel} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productFabric={product.fabric}
      />

      {/* Mobile Sticky Bottom Floating Action Bar */}
      <div
        id="mobile-sticky-product-bar"
        className="md:hidden fixed bottom-14 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-2.5 z-30 shadow-2xl flex items-center justify-between gap-2"
      >
        <div>
          <span className="text-xs font-bold text-[#8b3a42] block">
            {formatPKR(currentPrice)}
          </span>
          <span className="text-[10px] text-stone-500 line-clamp-1">
            {selectedVariant?.color} • {selectedVariant?.size}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppOrder}
            disabled={isOutOfStock}
            className="flex items-center gap-1 py-2 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center gap-1 py-2 px-3 bg-stone-900 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
