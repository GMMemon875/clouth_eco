import React, { useState } from 'react';
import { Search, Users, MessageSquare, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { IAdminCustomer } from '../../api/adminApi';

interface AdminCustomersTabProps {
  customers: IAdminCustomer[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            Customer Directory & Accounts
          </h1>
          <p className="text-xs text-stone-500">
            Active buyers across Lahore, Karachi, Islamabad, Faisalabad and other cities
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
          />
        </div>
      </div>

      {/* Customer list table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-semibold text-stone-800 text-sm">No customers found</p>
            <p className="text-xs mt-1">Customers automatically register when placing an order.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Primary City & Address</th>
                  <th className="py-3 px-4 text-center">Orders Count</th>
                  <th className="py-3 px-4">Total Spent (PKR)</th>
                  <th className="py-3 px-4">Last Order</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((c) => {
                  const cleanPhone = c.phone.replace(/[^\d]/g, '');
                  const waNumber = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
                  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum ${c.fullName}, Noor & Co. greeting you from our store team.`
                  )}`;

                  return (
                    <tr key={c.id} className="hover:bg-stone-50/70 transition">
                      {/* Name & avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#8b3a42]/10 text-[#8b3a42] font-serif font-bold text-xs flex items-center justify-center">
                            {c.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{c.fullName}</p>
                            <span className="text-[10px] text-stone-400">Verified Buyer</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-800">
                        {c.phone}
                      </td>

                      {/* City & Address */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-stone-800">{c.city}</p>
                        <p className="text-[10px] text-stone-500 truncate max-w-[180px]" title={c.address}>
                          {c.address}
                        </p>
                      </td>

                      {/* Orders count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-800 text-[11px]">
                          {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        Rs. {c.totalSpent.toLocaleString()}
                      </td>

                      {/* Last Order */}
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-stone-700">{c.lastOrderNumber}</p>
                        <p className="text-[10px] text-stone-400">
                          {new Date(c.lastOrderDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </td>

                      {/* Quick Contact */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition"
                            title="Message on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
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
