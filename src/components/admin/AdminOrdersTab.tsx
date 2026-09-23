import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Printer,
  MessageSquare,
  Phone,
  Truck,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { IOrder, OrderStatus } from '../../types/store';

interface AdminOrdersTabProps {
  orders: IOrder[];
  onSelectOrder: (order: IOrder) => void;
  onUpdateStatus: (orderNumber: string, status: OrderStatus, trackingCode?: string, note?: string) => Promise<void>;
  onOpenPackingSlip: (order: IOrder) => void;
}

const statusOptions: Array<OrderStatus | 'all'> = [
  'all',
  'Order Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const statusStyles: Record<string, string> = {
  'Order Placed': 'bg-amber-50 text-amber-900 border-amber-300',
  Confirmed: 'bg-blue-50 text-blue-900 border-blue-300',
  Processing: 'bg-purple-50 text-purple-900 border-purple-300',
  Packed: 'bg-indigo-50 text-indigo-900 border-indigo-300',
  Shipped: 'bg-cyan-50 text-cyan-900 border-cyan-300',
  'Out for Delivery': 'bg-teal-50 text-teal-900 border-teal-300',
  Delivered: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  Cancelled: 'bg-rose-50 text-rose-900 border-rose-300',
};

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  onOpenPackingSlip,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'all'>('all');
  const [updatingOrderNumber, setUpdatingOrderNumber] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = activeStatus === 'all' || o.status === activeStatus;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return matchesStatus;

    const matchesSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.shippingDetails.fullName.toLowerCase().includes(q) ||
      o.shippingDetails.phone.includes(q) ||
      o.shippingDetails.city.toLowerCase().includes(q) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleQuickStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    setUpdatingOrderNumber(orderNumber);
    try {
      await onUpdateStatus(orderNumber, newStatus);
    } finally {
      setUpdatingOrderNumber(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            Orders Desk & COD Dispatch
          </h1>
          <p className="text-xs text-stone-500">
            Manage customer confirmations, courier dispatches, and COD cash receipts
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="orders-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, Name, Phone, City..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
          />
        </div>
      </div>

      {/* Filter Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusOptions.map((st) => {
          const isActive = activeStatus === st;
          const count =
            st === 'all'
              ? orders.length
              : orders.filter((o) => o.status === st).length;

          return (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{st === 'all' ? 'All Orders' : st}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <p className="font-semibold text-stone-800 text-sm">No orders matching your filter</p>
            <p className="text-xs mt-1">Try resetting the status filter or clearing your search term.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveStatus('all');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order # & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Payable (COD)</th>
                  <th className="py-3 px-4">Status & Action</th>
                  <th className="py-3 px-4 text-right">Dispatch Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const badge = statusStyles[order.status] || 'bg-stone-100 text-stone-800';
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
                  const cleanPhone = order.shippingDetails.phone.replace(/[^\d]/g, '');
                  const waNumber = (order.shippingDetails.whatsapp || order.shippingDetails.phone).replace(/[^\d]/g, '');
                  const waLink = `https://wa.me/${waNumber.startsWith('0') ? '92' + waNumber.slice(1) : waNumber}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum ${order.shippingDetails.fullName}, Noor & Co. updating you on order #${order.orderNumber}.`
                  )}`;

                  return (
                    <tr key={order.orderNumber} className="hover:bg-stone-50/70 transition">
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="font-mono font-bold text-stone-900 hover:text-[#8b3a42] hover:underline flex items-center gap-1"
                        >
                          <span>{order.orderNumber}</span>
                        </button>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-900">{order.shippingDetails.fullName}</p>
                        <p className="text-[11px] text-stone-500">{order.shippingDetails.phone}</p>
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-stone-800">{order.shippingDetails.city}</p>
                        <p className="text-[10px] text-stone-500 truncate max-w-[140px]" title={order.shippingDetails.address}>
                          {order.shippingDetails.area || order.shippingDetails.address}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-stone-800">
                          {totalItems} {totalItems === 1 ? 'suit' : 'suits'}
                        </span>
                        <p className="text-[10px] text-stone-500 truncate max-w-[120px]">
                          {order.items[0]?.productName}
                        </p>
                      </td>

                      {/* Payable */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-stone-900">
                          Rs. {order.totalAmount.toLocaleString()}
                        </p>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          COD
                        </span>
                      </td>

                      {/* Quick Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingOrderNumber === order.orderNumber}
                            onChange={(e) => handleQuickStatusChange(order.orderNumber, e.target.value as OrderStatus)}
                            className={`text-xs px-2 py-1 rounded-md border font-medium focus:outline-none cursor-pointer ${badge}`}
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        {order.trackingCode && (
                          <p className="text-[10px] font-mono text-stone-500 mt-1">
                            CN: {order.trackingCode}
                          </p>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded transition"
                            title="Inspect Full Order"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenPackingSlip(order)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded transition"
                            title="Print Packing Slip / Challan"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition"
                            title="Contact via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
