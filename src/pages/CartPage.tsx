import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Phone,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatPKR } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryCharge,
    totalAmount,
    freeShippingQualified,
    amountNeededForFreeDelivery,
    totalCartItems,
  } = useCart();
  const { settings } = useSettings();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Your shopping bag is empty"
          description="Looks like you haven't added any designer lawn or pret suits yet."
          actionText="Explore Collections"
          onAction={() => onNavigate('/shop')}
        />
      </div>
    );
  }

  const handleWhatsAppBagInquiry = () => {
    const waNumber = settings.whatsappNumber.replace(/[^\d]/g, '');
    const itemList = cart
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.productName} (Code: ${i.variantSku}, ${i.color}, Size: ${i.size}) x ${i.quantity} = ${formatPKR(i.unitPrice * i.quantity)}`
      )
      .join('\n');

    const message = `Assalam-o-Alaikum,

I would like to order the following items from my shopping bag:

${itemList}

Subtotal: ${formatPKR(subtotal)}
Delivery: ${deliveryCharge === 0 ? 'FREE' : formatPKR(deliveryCharge)}
Total: ${formatPKR(totalAmount)}

Payment: Cash on Delivery (COD)
Please confirm availability and booking.`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="cart-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Shopping Bag ({totalCartItems} items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-red-600 transition flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Shopping Bag</span>
        </button>
      </div>

      {/* Free Shipping Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
        {freeShippingQualified ? (
          <div className="flex items-center gap-2 font-semibold text-emerald-800">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>🎉 You have qualified for <strong>FREE Nationwide Delivery</strong> across Pakistan!</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>Add {formatPKR(amountNeededForFreeDelivery)} more to unlock FREE Delivery!</span>
              </span>
              <span>{formatPKR(subtotal)} / {formatPKR(settings.delivery.freeDeliveryThreshold)}</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#8b3a42] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((subtotal / 3500) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            {cart.map((item) => (
              <div
                key={item.id}
                id={`cart-row-${item.variantSku}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-stone-50/50 transition"
              >
                {/* Product details */}
                <div className="flex gap-4 items-center min-w-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-stone-100 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <button
                      onClick={() => onNavigate(`/product/${item.productSlug}`)}
                      className="font-medium text-sm sm:text-base text-stone-900 hover:text-[#8b3a42] transition text-left line-clamp-1"
                    >
                      {item.productName}
                    </button>
                    <div className="text-xs text-stone-500 space-x-2">
                      <span>Color: <strong className="text-stone-700">{item.color}</strong></span>
                      <span>•</span>
                      <span>Size: <strong className="text-stone-700">{item.size}</strong></span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      SKU: {item.variantSku}
                    </div>
                    <div className="text-xs font-semibold text-stone-800 pt-0.5 sm:hidden">
                      {formatPKR(item.unitPrice)} each
                    </div>
                  </div>
                </div>

                {/* Modifiers & Totals */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-l-xl transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-r-xl transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line item subtotal */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm sm:text-base font-bold text-[#8b3a42]">
                      {formatPKR(item.unitPrice * item.quantity)}
                    </span>
                    <span className="hidden sm:block text-[11px] text-stone-400">
                      {formatPKR(item.unitPrice)} ea
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalCartItems} items)</span>
                <span className="font-bold text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Nationwide Courier Delivery</span>
                  <Truck className="w-3 h-3 text-stone-400" />
                </span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-700 uppercase">FREE</span>
                ) : (
                  <span className="font-bold text-stone-900">{formatPKR(deliveryCharge)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-xl text-[#8b3a42]">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span><strong>Cash on Delivery (COD)</strong> payment verified upon delivery.</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => onNavigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8b3a42] hover:bg-[#6b232a] text-white font-bold text-sm rounded-xl transition shadow-md"
              >
                <span>Proceed to COD Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBagInquiry}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Order this Bag on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
