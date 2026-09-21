import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { trackOrderApi } from '../api';
import { IOrderTrackingResult } from '../types/store';
import { formatPKR } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';

interface TrackOrderPageProps {
  initialOrderNumber?: string;
  onNavigate: (path: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  initialOrderNumber = '',
  onNavigate,
}) => {
  const { settings } = useSettings();
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<IOrderTrackingResult | null>(null);

  const steps = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter your order reference number.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter the mobile number used when placing the order.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await trackOrderApi(orderNumber.trim(), phone.trim());
      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || 'No matching order found. Please verify your order number and mobile phone.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const statusOrder = ['placed', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());
    const stepIndex = statusOrder.indexOf(stepKey.toLowerCase());

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'pending';
  };

  return (
    <div id="track-order-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
          Nationwide Dispatch Tracking
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Enter your unique order reference number (e.g. LS-20260921-00101) and mobile number.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Order Reference Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. LS-20260921-00101"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Customer Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:ring-1 focus:ring-[#8b3a42] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#8b3a42] hover:bg-[#6b232a] text-white text-sm font-bold rounded-xl transition shadow disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Locating Parcel...' : 'Check Status'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-900 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Could not locate order:</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Tracking Result View */}
      {trackingData && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8 shadow-xs animate-in fade-in duration-300">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                Order Tracking
              </span>
              <span className="font-mono text-lg font-bold text-stone-900">
                {trackingData.orderNumber}
              </span>
              <span className="text-xs text-stone-500 block mt-0.5">
                Destination: {trackingData.city} • {trackingData.itemCount} piece(s)
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-stone-100 text-[#8b3a42]">
                Status: {trackingData.status.toUpperCase()}
              </span>
              <div className="text-xs font-bold text-stone-900 mt-1">
                COD Due: {formatPKR(trackingData.totalAmount)}
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Shipment Progress
            </h3>

            <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-2 pt-2">
              {steps.map((step, idx) => {
                const stepState = getStepStatus(step.key, trackingData.status);
                const isDone = stepState === 'completed';
                return (
                  <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 text-left sm:text-center relative">
                    {/* Connecting line on desktop */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`hidden sm:block absolute top-4 left-1/2 w-full h-0.5 z-0 ${
                          isDone ? 'bg-emerald-600' : 'bg-stone-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div>
                      <span className={`text-xs font-bold block ${isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary in Tracking */}
          <div className="pt-6 border-t border-stone-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
              Items in this Parcel
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trackingData.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-14 object-cover rounded-lg bg-stone-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-stone-900 truncate block">
                      {item.productName}
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      {item.color} • {item.size} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Inquiries regarding tracking */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
            <div className="text-xs text-emerald-950 text-center sm:text-left">
              <strong className="block font-bold">Need assistance with your courier?</strong>
              <span>Message our customer support on WhatsApp with your reference number.</span>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                `Assalam-o-Alaikum, I need an update regarding Order ${trackingData.orderNumber}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact WhatsApp Support</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
