import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Truck,
  TrendingUp,
  Eye,
  MessageSquare,
  Package,
} from 'lucide-react';
import { IAdminStats } from '../../api/adminApi';
import { IOrder, OrderStatus } from '../../types/store';

interface AdminOverviewTabProps {
  stats: IAdminStats;
  onSelectOrder: (order: IOrder) => void;
  onNavigateTab: (tab: 'overview' | 'orders' | 'products' | 'customers' | 'settings') => void;
  onOpenPackingSlip: (order: IOrder) => void;
}

const statusBadgeStyles: Record<string, string> = {
  'Order Placed': 'bg-amber-100 text-amber-900 border-amber-300',
  Confirmed: 'bg-blue-100 text-blue-900 border-blue-300',
  Processing: 'bg-purple-100 text-purple-900 border-purple-300',
  Packed: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  Shipped: 'bg-cyan-100 text-cyan-900 border-cyan-300',
  'Out for Delivery': 'bg-teal-100 text-teal-900 border-teal-300',
  Delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
};

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  stats,
  onSelectOrder,
  onNavigateTab,
  onOpenPackingSlip,
}) => {
  const maxRevenueInTrend = Math.max(...(stats.salesTrend?.map((d) => d.revenue) || [1]), 1000);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Summary Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold">
            Store Operations Dashboard
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-white">
            Noor & Co. Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Real-time sales, nationwide Cash on Delivery dispatch orders, inventory levels, and customer tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-lg bg-stone-700/80 hover:bg-stone-700 text-white font-medium text-xs transition border border-stone-600 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Stock</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            Rs. {stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Avg Order: <span className="font-semibold text-stone-700">Rs. {stats.averageOrderValue.toLocaleString()}</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            {stats.totalOrders}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Nationwide Cash on Delivery
          </p>
        </div>

        {/* Pending Dispatch */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Pending Dispatch
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            {stats.pendingOrders}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Needs confirmation or packing
          </p>
        </div>

        {/* Delivered / Completed */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Delivered
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            {stats.deliveredOrders}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Cash collected & reconciled
          </p>
        </div>
      </div>

      {/* Sales Trend Chart & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 7-Day Revenue Trend (Custom Responsive Chart) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">
                Recent Sales Revenue Trend
              </h2>
              <p className="text-xs text-stone-500">Past 7 days orders breakdown (PKR)</p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-700">
              Daily
            </span>
          </div>

          <div className="h-44 flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-stone-200">
            {stats.salesTrend?.map((day, idx) => {
              const heightPercent = Math.max(8, Math.round((day.revenue / maxRevenueInTrend) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end">
                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 bg-stone-900 text-white text-[10px] font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    Rs. {day.revenue.toLocaleString()} ({day.orders} orders)
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[40px] rounded-t-md bg-[#8b3a42] hover:bg-[#a64851] transition cursor-pointer"
                  />
                  <span className="text-[10px] font-medium text-stone-500 mt-1">{day.date}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-3">
            <span>7-Day Volume: {stats.salesTrend?.reduce((s, d) => s + d.orders, 0)} orders</span>
            <span className="font-semibold text-stone-800">
              Revenue: Rs. {stats.salesTrend?.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Distribution Breakdown */}
        <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-stone-900 mb-1">
              Orders Status Pipeline
            </h2>
            <p className="text-xs text-stone-500 mb-4">Breakdown by current stage</p>

            <div className="space-y-2.5">
              {Object.entries(stats.ordersByStatus || {}).map(([st, count]) => {
                const total = stats.totalOrders || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={st} className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-stone-700">{st}</span>
                      <span className="font-semibold text-stone-900">
                        {count} <span className="text-stone-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          st === 'Delivered'
                            ? 'bg-emerald-500'
                            : st === 'Cancelled'
                            ? 'bg-rose-500'
                            : st === 'Order Placed'
                            ? 'bg-amber-500'
                            : 'bg-[#8b3a42]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {stats.lowStockCount > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{stats.lowStockCount} items have low or zero stock</span>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs font-semibold text-amber-900 underline hover:no-underline"
              >
                View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">Recent Customer Orders</h2>
              <p className="text-xs text-stone-500">Latest orders placed on your storefront</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-[#8b3a42] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Total (PKR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stats.recentOrders?.map((order) => {
                  const badge = statusBadgeStyles[order.status] || 'bg-stone-100 text-stone-800';
                  return (
                    <tr key={order.orderNumber} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800">
                        {order.shippingDetails.fullName}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{order.shippingDetails.city}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        Rs. {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded transition"
                            title="Inspect Order"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Pakistani Suits */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 sm:p-5 flex flex-col">
          <h2 className="font-serif text-base font-bold text-stone-900 mb-1">
            Top Performing Designs
          </h2>
          <p className="text-xs text-stone-500 mb-4">Highest volume and sales revenue</p>

          <div className="space-y-3.5 flex-1">
            {stats.topSellingProducts?.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-12 object-cover rounded-lg border border-stone-200"
                  />
                  <div className="max-w-[140px] sm:max-w-[180px]">
                    <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-stone-500">{item.units} units dispatched</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900">Rs. {item.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-stone-200">
            <button
              onClick={() => onNavigateTab('products')}
              className="w-full py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition text-center"
            >
              Manage Catalog & Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
