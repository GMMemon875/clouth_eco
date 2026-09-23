import React from 'react';
import { ExternalLink, RefreshCw, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const { user, logout } = useAuth();

  const handleAdminLogout = async () => {
    await logout();
    onNavigateStore();
  };

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
                <span className="text-[11px] font-semibold tracking-wide bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Operations & COD Dispatch Portal • Pakistan
              </p>
            </div>
          </div>

          {/* Quick Actions & Admin Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Email Pill */}
            {user && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-xs">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">{user.email}</span>
              </div>
            )}

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

            {/* Logout button */}
            <button
              id="admin-logout-btn"
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-medium border border-red-800/60 transition shadow-sm"
              title="Sign Out of Administrator Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
