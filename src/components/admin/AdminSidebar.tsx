import React from 'react';
import {
  LayoutDashboard,
  Package,
  Shirt,
  Users,
  Sliders,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export type AdminTab = 'overview' | 'orders' | 'products' | 'customers' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onChangeTab,
  pendingOrdersCount = 0,
  lowStockCount = 0,
}) => {
  const tabs = [
    {
      id: 'overview' as AdminTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders Desk',
      icon: Package,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-[#8b3a42] text-white',
    },
    {
      id: 'products' as AdminTab,
      label: 'Products & Inventory',
      icon: Shirt,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: 'bg-amber-500/20 text-amber-700 border border-amber-300',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Customers',
      icon: Users,
      badge: null,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Store Settings',
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <aside id="admin-sidebar" className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-stone-200 lg:min-h-[calc(100vh-4rem)] p-4 flex-shrink-0">
      {/* Horizontal on mobile, vertical on desktop */}
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap lg:whitespace-normal ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
              </div>
              {tab.badge !== null && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    tab.badgeColor || (isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick operational summary box on desktop */}
      <div className="hidden lg:block mt-8 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#8b3a42]" />
          <span>COD Operations</span>
        </div>
        <p className="text-[11px] text-stone-600 leading-relaxed">
          Orders are settled via Cash on Delivery nationwide (TCS, Leopards, Trax). Verify phone numbers before dispatching parcels.
        </p>
      </div>
    </aside>
  );
};
