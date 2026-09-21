import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { submitCodOrder } from '../api';
import { formatPKR } from '../utils/formatters';
import { IShippingDetails } from '../types/store';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onOrderSuccess: (orderNumber: string) => void;
}

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Sheikhupura',
  'Jhelum',
  'Wah Cantt',
  'Mardan',
  'Rahim Yar Khan',
  'Other / Nationwide',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderSuccess }) => {
  const { cart, subtotal, deliveryCharge, totalAmount, clearCart, totalCartItems } = useCart();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<IShippingDetails>({
    fullName: '',
    phone: '',
    whatsapp: '',
    city: 'Lahore',
    area: '',
    address: '',
    landmark: '',
    notes: '',
  });

  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500">Please select an item from our collections before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-2.5 bg-[#8b3a42] text-white rounded-xl text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'phone' && whatsappSameAsPhone) {
        updated.whatsapp = value;
      }
      return updated;
    });
  };

  const handleWhatsappCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setWhatsappSameAsPhone(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, whatsapp: prev.phone }));
    }
  };

  const validatePhone = (phone: string) => {
    // Pakistani numbers typically 03XXXXXXXXX (11 digits) or +923XXXXXXXXX
    const cleaned = phone.replace(/[^\d]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrorMessage('Please enter a valid Pakistani mobile number (e.g. 03001234567).');
      return;
    }

    if (!formData.address.trim() || formData.address.length < 8) {
      setErrorMessage('Please enter a complete street address with house/plot and block for delivery.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        shippingDetails: {
          ...formData,
          whatsapp: whatsappSameAsPhone ? formData.phone : formData.whatsapp || formData.phone,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          variantSku: item.variantSku,
          quantity: item.quantity,
        })),
      };

      const result = await submitCodOrder(payload);
      clearCart();
      showToast(`Order placed successfully! Order #${result.orderNumber}`, 'success');
      onOrderSuccess(result.orderNumber);
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setErrorMessage(
        err.message ||
          'Could not complete your order. Some items might be out of stock. Please review your cart.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="checkout-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="pb-6 border-b border-stone-200">
        <button
          onClick={() => onNavigate('/cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </button>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Cash on Delivery (COD) Checkout
          </h1>
          <div className="hidden sm:flex items-center gap-1 text-xs text-stone-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Guest Checkout</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-900 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Please check your information:</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Form Left + Order Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Customer & Address Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center justify-between">
                <span>1. Contact Details</span>
                <span className="text-[10px] text-stone-400 font-normal">No account required</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Fatima Zahra"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 03001234567"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none font-mono"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Rider will call this number prior to delivery
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      WhatsApp Number (for updates)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      disabled={whatsappSameAsPhone}
                      value={whatsappSameAsPhone ? formData.phone : formData.whatsapp}
                      onChange={handleChange}
                      placeholder="e.g. 03001234567"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none font-mono disabled:opacity-60"
                    />
                    <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-stone-600">
                      <input
                        type="checkbox"
                        checked={whatsappSameAsPhone}
                        onChange={handleWhatsappCheckbox}
                        className="rounded text-[#8b3a42] focus:ring-[#8b3a42] w-3.5 h-3.5"
                      />
                      <span>Same as Mobile Number</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                2. Shipping Address in Pakistan
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Area / Sector / Colony
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g. DHA Phase 5 / Gulberg / F-7"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Complete Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House / Flat No., Street No., Sector/Block Name..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nearest Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="e.g. Near Jamia Mosque / Behind PSO Pump"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g. Call before coming, deliver after 2 PM"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <h2 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                3. Payment Method
              </h2>
              <div className="p-4 rounded-xl border-2 border-[#8b3a42] bg-rose-50/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#8b3a42] flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Pay cash to the courier representative when the parcel arrives.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  Active
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit-cod-order-btn"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#8b3a42] hover:bg-[#6b232a] active:scale-[0.99] text-white font-bold text-base rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {submitting ? (
                <span>Securing Stock & Placing Order...</span>
              ) : (
                <span>Confirm & Place Cash on Delivery Order</span>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 shadow-xs space-y-4 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-200">
              Order Summary ({totalCartItems} items)
            </h3>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto divide-y divide-stone-200 pr-1 space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-16 object-cover rounded-lg bg-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-stone-900 truncate">
                      {item.productName}
                    </h4>
                    <span className="text-[10px] text-stone-500 block">
                      {item.color} • {item.size} • Qty: {item.quantity}
                    </span>
                    <span className="text-xs font-bold text-[#8b3a42]">
                      {formatPKR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nationwide Shipping</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-700 uppercase">FREE</span>
                ) : (
                  <span className="font-bold text-stone-900">{formatPKR(deliveryCharge)}</span>
                )}
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-stone-900">
                <span>Total Due on Delivery</span>
                <span className="text-xl text-[#8b3a42]">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-stone-800">100% Genuine Pakistani Textiles</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8b3a42] shrink-0" />
                <span>Estimated dispatch: 24 to 48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
