import React, { useState } from 'react';
import {
  X,
  Printer,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  ExternalLink,
} from 'lucide-react';
import { IOrder, OrderStatus } from '../../types/store';

interface OrderDetailsModalProps {
  order: IOrder;
  onClose: () => void;
  onUpdateStatus: (orderNumber: string, status: OrderStatus, trackingCode?: string, note?: string) => Promise<void>;
  onOpenPackingSlip: (order: IOrder) => void;
}

const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  'Order Placed': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  Processing: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  Packed: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  Shipped: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
  'Out for Delivery': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  Returned: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
};

const statusOptions: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onOpenPackingSlip,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [trackingCode, setTrackingCode] = useState(order.trackingCode || '');
  const [statusNote, setStatusNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cleanPhone = order.shippingDetails.phone.replace(/[^\d]/g, '');
  const whatsappNumber = (order.shippingDetails.whatsapp || order.shippingDetails.phone).replace(/[^\d]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${order.shippingDetails.fullName}! This is Noor & Co. regarding your Cash on Delivery order #${order.orderNumber} (Amount: Rs. ${order.totalAmount.toLocaleString()}). ` +
      (order.status === 'Order Placed'
        ? `We are confirming your delivery address: ${order.shippingDetails.address}, ${order.shippingDetails.city}. Please reply to confirm dispatch!`
        : order.status === 'Shipped' && order.trackingCode
        ? `Your parcel has been dispatched with courier tracking code: ${order.trackingCode}. Please keep exact cash ready upon delivery.`
        : `Your order status is currently: ${order.status}. Thank you for choosing Noor & Co.!`)
  );

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onUpdateStatus(order.orderNumber, selectedStatus, trackingCode.trim() || undefined, statusNote.trim() || undefined);
      setStatusNote('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const style = statusColors[order.status] || { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-200' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Order #{order.orderNumber}
              </h2>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <span>•</span>
              <span className="font-medium text-emerald-700">Cash on Delivery (COD)</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="order-print-slip-btn"
              type="button"
              onClick={() => onOpenPackingSlip(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition shadow-sm"
              title="Print Courier Dispatch Slip"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Packing Slip</span>
            </button>
            <button
              id="order-modal-close-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8b3a42]" />
                <span>Customer & Destination</span>
              </h3>
              <p className="font-semibold text-stone-900 text-sm">{order.shippingDetails.fullName}</p>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {order.shippingDetails.address}
                {order.shippingDetails.area && `, ${order.shippingDetails.area}`}
              </p>
              <p className="text-xs font-medium text-stone-800 mt-0.5">
                {order.shippingDetails.city}, Pakistan
              </p>
              {order.shippingDetails.landmark && (
                <p className="text-[11px] text-stone-500 mt-1">
                  <span className="font-medium">Landmark:</span> {order.shippingDetails.landmark}
                </p>
              )}
              {order.shippingDetails.notes && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-2 border border-amber-200">
                  <span className="font-semibold">Note:</span> {order.shippingDetails.notes}
                </p>
              )}
            </div>

            {/* Contact Actions */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8b3a42]" />
                  <span>Contact Channels</span>
                </h3>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Phone:</span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="font-medium text-[#8b3a42] hover:underline"
                    >
                      {order.shippingDetails.phone}
                    </a>
                  </div>
                  {order.shippingDetails.whatsapp && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">WhatsApp:</span>
                      <span className="font-medium text-stone-800">{order.shippingDetails.whatsapp}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Tracking Code:</span>
                    <span className="font-mono text-xs font-semibold text-stone-900">
                      {order.trackingCode || 'Not Assigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-200">
                <a
                  href={`https://wa.me/${whatsappNumber.startsWith('0') ? '92' + whatsappNumber.slice(1) : whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Customer</span>
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center p-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 transition shadow-sm"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#8b3a42]" />
              <span>Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            </h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white hover:bg-stone-50/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-18 object-cover rounded-lg border border-stone-200 shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 leading-tight">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Color: <span className="font-medium text-stone-800">{item.color}</span> • Size:{' '}
                        <span className="font-medium text-stone-800">{item.size}</span>
                      </p>
                      <p className="text-[10px] font-mono text-stone-400 mt-0.5">SKU: {item.variantSku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-bold text-stone-900">
                      Rs. {item.subtotal.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Rs. {item.unitPrice.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}

              {/* Price Summary Breakdown */}
              <div className="p-4 bg-stone-50 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span>{order.deliveryCharge === 0 ? 'FREE' : `Rs. ${order.deliveryCharge.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Payable (COD)</span>
                  <span className="text-[#8b3a42]">Rs. {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Status & Courier Section */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#8b3a42]" />
              <span>Update Order Dispatch Status</span>
            </h3>

            {submitError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStatus} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Order Status
                  </label>
                  <select
                    id="update-status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Courier Tracking # (TCS / Leopards / Trax)
                  </label>
                  <input
                    id="update-tracking-input"
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="e.g. TCS-98421039"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status Note / Internal Remarks (Optional)
                </label>
                <input
                  id="update-status-note-input"
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Customer confirmed dispatch via WhatsApp."
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  id="update-status-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Update & Log Status'}
                </button>
              </div>
            </form>
          </div>

          {/* Status Timeline History */}
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8b3a42]" />
              <span>Status History Logs</span>
            </h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {(order.statusHistory || []).map((hist, i) => (
                <div key={i} className="relative text-xs">
                  <div className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#8b3a42]" />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">{hist.status}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(hist.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  {hist.note && <p className="text-stone-600 mt-0.5">{hist.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50/70 rounded-b-2xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
