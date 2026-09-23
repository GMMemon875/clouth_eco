import React from 'react';
import { ExternalLink, RefreshCw, ShoppingBag, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  onNavigateStore: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onNavigateStore,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header id="admin-header" className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#8b3a42] flex items-center justify-center text-amber-200 font-serif font-bold text-lg shadow-sm">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-wider text-base sm:text-lg text-white">
                  NOOR & CO.
                </span>
                <span className="text-[11px] font-medium tracking-wide bg-stone-800 text-amber-400 px-2 py-0.5 rounded border border-stone-700">
                  Store Manager
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Operations & COD Dispatch Portal • Pakistan
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">COD Store Live</span>
            </div>

            {/* Refresh button */}
            <button
              id="admin-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition flex items-center gap-1.5 text-xs"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* View storefront */}
            <button
              id="admin-view-storefront-btn"
              onClick={onNavigateStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit Storefront</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
