import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Phone,
  Truck,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { IOrder } from '../types/store';
import { fetchOrderByNumber } from '../api';
import { formatPKR } from '../utils/formatters';
import { buildOrderConfirmationWhatsAppUrl } from '../utils/whatsapp';
import { useSettings } from '../context/SettingsContext';

interface OrderConfirmationPageProps {
  orderNumber: string;
  onNavigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderNumber,
  onNavigate,
}) => {
  const { settings } = useSettings();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (orderNumber) {
      fetchOrderByNumber(orderNumber)
        .then(setOrder)
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  const handleWhatsAppConfirm = () => {
    if (!order) return;
    const url = buildOrderConfirmationWhatsAppUrl(
      order.orderNumber,
      order.shippingDetails.fullName,
      order.totalAmount,
      order.items.reduce((sum, i) => sum + i.quantity, 0),
      settings.whatsappNumber
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="order-confirmation-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-9 h-9" />
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Shukriya! Your Order is Placed
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          We have received your Cash on Delivery booking. Our order fulfillment team will pack your suits with utmost care.
        </p>
      </div>

      {/* Order Number Badge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
            Order Reference Number
          </span>
          <span className="font-mono text-base sm:text-lg font-bold text-[#8b3a42]">
            {orderNumber}
          </span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Status: Order Placed</span>
        </div>
      </div>

      {/* WhatsApp Reassurance Box (Flow B) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 space-y-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-sm sm:text-base">
              Confirm or Expedite Your Order on WhatsApp
            </h2>
            <p className="text-xs text-emerald-900 leading-relaxed">
              For fastest priority dispatch, share your order number with our customer care representative on WhatsApp.
            </p>
          </div>
        </div>

        <button
          id="confirm-order-whatsapp-btn"
          onClick={handleWhatsAppConfirm}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span>Send Order Confirmation to WhatsApp</span>
        </button>
      </div>

      {/* Order Items & Shipping Summary */}
      {order && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-xs">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-200">
              Ordered Items
            </h2>
            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-14 object-cover rounded-lg bg-stone-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.productName}
                      </h4>
                      <span className="text-[11px] text-stone-500 block">
                        {item.color} • {item.size} • Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#8b3a42]">
                    {formatPKR(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Nationwide Delivery</span>
              <span className="font-semibold text-stone-900">
                {order.deliveryCharge === 0 ? 'FREE' : formatPKR(order.deliveryCharge)}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
              <span>Amount Due on Cash Delivery</span>
              <span className="text-base text-[#8b3a42]">{formatPKR(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery destination */}
          <div className="pt-4 border-t border-stone-200 bg-stone-50 p-4 rounded-xl space-y-1 text-xs text-stone-600">
            <h4 className="font-bold text-stone-900">Delivery Address:</h4>
            <p className="font-medium text-stone-800">{order.shippingDetails.fullName} ({order.shippingDetails.phone})</p>
            <p>{order.shippingDetails.address}, {order.shippingDetails.city}</p>
            {order.shippingDetails.landmark && (
              <p className="text-stone-500">Landmark: {order.shippingDetails.landmark}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => onNavigate(`/track-order?orderNumber=${orderNumber}`)}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs transition"
        >
          Track This Order
        </button>
        <button
          onClick={() => onNavigate('/shop')}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-[#8b3a42] text-white font-bold text-xs transition shadow"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
