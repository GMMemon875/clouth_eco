import React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPKR } from '../../utils/formatters';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryCharge,
    totalAmount,
    freeShippingQualified,
    amountNeededForFreeDelivery,
    totalCartItems,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8b3a42]" />
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Shopping Bag ({totalCartItems})
              </h2>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50/70 px-4 py-3 border-b border-amber-200 text-xs text-amber-900">
            {freeShippingQualified ? (
              <div className="flex items-center gap-2 font-medium text-emerald-800">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>🎉 Congratulations! You have qualified for <strong>FREE Nationwide Delivery</strong>!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Add {formatPKR(amountNeededForFreeDelivery)} more for Free Shipping!</span>
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#8b3a42] h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((subtotal / 3500) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-800">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our unstitched luxury lawn, ready-to-wear pret, and 3-piece designer collections.
                  </p>
                </div>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#8b3a42] text-white text-xs font-semibold rounded-xl hover:bg-[#6b232a] transition shadow"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.variantSku}`}
                  className="flex gap-3.5 p-3 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded-lg bg-stone-100 shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <button
                          onClick={() => {
                            setIsCartDrawerOpen(false);
                            onNavigate(`/product/${item.productSlug}`);
                          }}
                          className="text-left font-medium text-xs text-stone-900 hover:text-[#8b3a42] line-clamp-1 transition"
                        >
                          {item.productName}
                        </button>
                        <button
                          id={`remove-cart-item-${item.variantSku}`}
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-600 p-1 transition"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 space-x-2">
                        <span>Color: <strong className="text-stone-700">{item.color}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-stone-700">{item.size}</strong></span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        SKU: {item.variantSku}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          id={`qty-decrease-${item.variantSku}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-l transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          id={`qty-increase-${item.variantSku}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-r transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#8b3a42]">
                          {formatPKR(item.unitPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-stone-400">
                            ({formatPKR(item.unitPrice)} each)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Nationwide Delivery</span>
                  {deliveryCharge === 0 ? (
                    <span className="font-semibold text-emerald-700">FREE</span>
                  ) : (
                    <span className="font-semibold text-stone-900">{formatPKR(deliveryCharge)}</span>
                  )}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Estimated Total</span>
                  <span className="text-base text-[#8b3a42]">{formatPKR(totalAmount)}</span>
                </div>
              </div>

              {/* COD Badge note */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Payment Method: <strong>Cash on Delivery</strong> across Pakistan</span>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-drawer-checkout-btn"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigate('/checkout');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#8b3a42] text-white rounded-xl font-bold text-sm hover:bg-[#6b232a] active:scale-[0.99] transition shadow-md"
              >
                <span>Proceed to COD Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
