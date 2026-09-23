import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Truck,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrdersApi } from '../api/authApi';
import { IOrder } from '../types/store';
import { formatPKR, formatDate } from '../utils/formatters';

interface AccountPageProps {
  onNavigate: (path: string) => void;
  initialTab?: 'profile' | 'orders';
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
  'Other / Nationwide',
];

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, initialTab = 'profile' }) => {
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>(initialTab);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Lahore',
    area: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change Password state
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders State
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Sync profile data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address?.address || '',
        city: user.address?.city || 'Lahore',
        area: user.address?.area || '',
      });
    }
  }, [user]);

  // Load orders when activeTab becomes 'orders'
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  async function loadOrders() {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await fetchMyOrdersApi();
      setOrders(data);
    } catch (err: any) {
      setOrdersError(err.message || 'Failed to load your orders.');
    } finally {
      setOrdersLoading(false);
    }
  }

  // Redirect to login if unauthenticated and not loading
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Sign In Required</h2>
        <p className="text-xs text-stone-500">Please sign in to view your profile and order history.</p>
        <button
          onClick={() => onNavigate('/login')}
          className="px-6 py-2.5 bg-[#8b3a42] text-white rounded-xl text-xs font-semibold"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      await updateProfile(profileData);
      setProfileMsg({ type: 'success', text: 'Profile and delivery address updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaving(true);
    setPassMsg(null);

    if (passData.newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      setPassSaving(false);
      return;
    }

    if (passData.newPassword !== passData.confirmPassword) {
      setPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      setPassSaving(false);
      return;
    }

    try {
      await changePassword(passData.currentPassword, passData.newPassword, passData.confirmPassword);
      setPassMsg({ type: 'success', text: 'Your password was changed successfully.' });
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPassSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Confirmed':
      case 'Processing':
      case 'Packed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
      case 'Returned':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div id="customer-account-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Profile Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Account Dashboard</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Welcome, {user?.name || 'Customer'}
          </h1>
          <p className="text-xs text-stone-500">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          id="tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-[#8b3a42] text-[#8b3a42]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Address</span>
        </button>

        <button
          id="tab-orders"
          onClick={() => {
            setActiveTab('orders');
            loadOrders();
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-[#8b3a42] text-[#8b3a42]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>
      </div>

      {/* Tab 1: Profile Details & Password */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal and Address Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#8b3a42]" />
                  <span>Personal & Delivery Information</span>
                </h2>
                <span className="text-[11px] text-stone-400">Used for express checkout</span>
              </div>

              {profileMsg && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 text-xs animate-in fade-in ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {profileMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                    <input
                      id="profile-name"
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address (Account ID)
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-stone-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                    <input
                      id="profile-phone"
                      type="tel"
                      required
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                    <select
                      id="profile-city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Area / Sector</label>
                  <input
                    id="profile-area"
                    type="text"
                    value={profileData.area}
                    onChange={(e) => setProfileData({ ...profileData, area: e.target.value })}
                    placeholder="e.g. Phase 5 DHA, Gulberg III"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Street Address</label>
                  <textarea
                    id="profile-address"
                    rows={2}
                    required
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    placeholder="House #, Street #, Block/Phase"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900 resize-none"
                  />
                </div>

                <button
                  id="profile-save-btn"
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-[#8b3a42] hover:bg-[#6b232a] text-white rounded-xl text-xs font-semibold transition disabled:opacity-60 cursor-pointer"
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Change Password */}
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Lock className="w-4 h-4 text-[#8b3a42]" />
                <span>Change Password</span>
              </h2>

              {passMsg && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 text-xs animate-in fade-in ${
                    passMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {passMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{passMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Current Password</label>
                  <input
                    id="curr-pass"
                    type="password"
                    required
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    New Password (min 6 chars)
                  </label>
                  <input
                    id="new-pass"
                    type="password"
                    required
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm New Password</label>
                  <input
                    id="confirm-new-pass"
                    type="password"
                    required
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8b3a42] text-stone-900"
                  />
                </div>

                <button
                  id="change-pass-btn"
                  type="submit"
                  disabled={passSaving}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-60 cursor-pointer"
                >
                  {passSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {ordersLoading ? (
            <div className="p-12 text-center text-xs text-stone-500">Loading your orders...</div>
          ) : ordersError ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {ordersError}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-stone-900">No Orders Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You haven't placed any orders with this account yet. Discover our latest Pakistani lawn and couture collections.
              </p>
              <button
                onClick={() => onNavigate('/shop')}
                className="px-6 py-2.5 bg-[#8b3a42] text-white rounded-xl text-xs font-semibold hover:bg-[#6b232a] transition"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Order Number</span>
                        <span className="font-mono font-bold text-stone-900 text-sm">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Date Placed</span>
                        <span className="text-stone-700 font-medium">{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Total</span>
                        <span className="font-bold text-stone-900">{formatPKR(order.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-stone-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                          alt={item.productName}
                          className="w-16 h-20 object-cover rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-stone-900 truncate">{item.productName}</h4>
                          <p className="text-xs text-stone-500">
                            Color: <span className="font-medium text-stone-700">{item.color}</span> | Size:{' '}
                            <span className="font-medium text-stone-700">{item.size}</span>
                          </p>
                          <p className="text-xs text-stone-500">
                            Qty: <span className="font-medium text-stone-700">{item.quantity}</span> ×{' '}
                            {formatPKR(item.unitPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-stone-900">{formatPKR(item.subtotal)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Delivery Summary */}
                  <div className="p-4 sm:p-5 bg-stone-50/70 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-stone-800">Delivered to:</strong> {order.shippingDetails.fullName},{' '}
                        {order.shippingDetails.address}, {order.shippingDetails.city} ({order.shippingDetails.phone})
                      </span>
                    </div>

                    {order.trackingCode && (
                      <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Courier Tracking: <strong>{order.trackingCode}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
