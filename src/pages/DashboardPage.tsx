import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { OrderDetailsModal } from '../components/admin/OrderDetailsModal';
import { PackingSlipModal } from '../components/admin/PackingSlipModal';
import { ProductEditorModal } from '../components/admin/ProductEditorModal';
import {
  fetchAdminStats,
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  updateAdminVariantStock,
  fetchAdminCustomers,
  fetchAdminSettings,
  updateAdminSettings,
  IAdminStats,
  IAdminCustomer,
} from '../api/adminApi';
import { IOrder, IProduct, IStoreSettings, OrderStatus } from '../types/store';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface DashboardPageProps {
  onNavigateStore: () => void;
  categories: Array<{ slug: string; name: string }>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateStore,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<Array<IProduct & {
    totalStock: number;
    hasLowStock: boolean;
    isOutOfStock: boolean;
  }>>([]);
  const [customers, setCustomers] = useState<IAdminCustomer[]>([]);
  const [settings, setSettings] = useState<IStoreSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [packingSlipOrder, setPackingSlipOrder] = useState<IOrder | null>(null);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const loadAllData = useCallback(async (showFullLoader = false) => {
    if (showFullLoader) setIsLoading(true);
    setIsRefreshing(true);
    setError(null);

    try {
      const [statsData, ordersData, productsData, customersData, settingsData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminOrders(),
        fetchAdminProducts(),
        fetchAdminCustomers(),
        fetchAdminSettings(),
      ]);

      setStats(statsData);
      setOrders(ordersData);
      setProducts(productsData);
      setCustomers(customersData);
      setSettings(settingsData);
    } catch (err: any) {
      console.error('[Dashboard] Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData(true);
  }, [loadAllData]);

  // Order status update
  const handleUpdateOrderStatus = async (
    orderNumber: string,
    newStatus: OrderStatus,
    trackingCode?: string,
    note?: string
  ) => {
    const updatedOrder = await updateAdminOrderStatus(orderNumber, newStatus, trackingCode, note);

    // Update in orders list
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderNumber ? updatedOrder : o))
    );

    // Update selected order if opened in modal
    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder(updatedOrder);
    }

    // Refresh stats in background
    fetchAdminStats().then((newStats) => setStats(newStats)).catch(() => {});
  };

  // Stock update
  const handleUpdateVariantStock = async (productId: string, variantSku: string, stock: number) => {
    await updateAdminVariantStock(productId, variantSku, stock);

    // Update products list locally
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId || p.sku === productId) {
          const newVariants = (p.variants || []).map((v) =>
            v.sku === variantSku ? { ...v, stock } : v
          );
          const totalStock = newVariants.reduce((sum, v) => sum + v.stock, 0);
          return {
            ...p,
            variants: newVariants,
            totalStock,
            hasLowStock: newVariants.some((v) => v.stock > 0 && v.stock <= 3),
            isOutOfStock: totalStock === 0,
          };
        }
        return p;
      })
    );

    // Refresh stats
    fetchAdminStats().then((newStats) => setStats(newStats)).catch(() => {});
  };

  // Create / Update product
  const handleSaveProduct = async (productData: Partial<IProduct>) => {
    if (editingProduct) {
      const productId = editingProduct.id || editingProduct.sku;
      const updated = await updateAdminProduct(productId, productData);
      setProducts((prev) =>
        prev.map((p) => ((p.id === editingProduct.id || p.sku === editingProduct.sku) ? { ...p, ...updated } : p))
      );
    } else {
      const created = await createAdminProduct(productData);
      const totalStock = (created.variants || []).reduce((sum, v) => sum + v.stock, 0);
      setProducts((prev) => [
        {
          ...created,
          totalStock,
          hasLowStock: (created.variants || []).some((v) => v.stock > 0 && v.stock <= 3),
          isOutOfStock: totalStock === 0,
        },
        ...prev,
      ]);
    }
    // Refresh stats
    fetchAdminStats().then((newStats) => setStats(newStats)).catch(() => {});
  };

  // Settings update
  const handleSaveSettings = async (newSettings: Partial<IStoreSettings>) => {
    const saved = await updateAdminSettings(newSettings);
    setSettings(saved);
  };

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-stone-300 border-t-[#8b3a42] rounded-full animate-spin mb-3" />
        <p className="font-serif text-base font-bold text-stone-900">Loading Noor & Co. Store Manager...</p>
        <p className="text-xs text-stone-500 mt-1">Fetching orders, metrics and catalog inventory</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900">
      {/* Admin Top Header */}
      <AdminHeader
        onNavigateStore={onNavigateStore}
        onRefresh={() => loadAllData(false)}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          pendingOrdersCount={stats?.pendingOrders || 0}
          lowStockCount={stats?.lowStockCount || 0}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadAllData(false)}
                className="font-bold underline text-rose-900 hover:no-underline text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {activeTab === 'overview' && stats && (
            <AdminOverviewTab
              stats={stats}
              onSelectOrder={setSelectedOrder}
              onNavigateTab={setActiveTab}
              onOpenPackingSlip={setPackingSlipOrder}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              onSelectOrder={setSelectedOrder}
              onUpdateStatus={handleUpdateOrderStatus}
              onOpenPackingSlip={setPackingSlipOrder}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsTab
              products={products}
              categories={categories}
              onOpenNewProductModal={() => {
                setEditingProduct(null);
                setIsProductEditorOpen(true);
              }}
              onEditProduct={(prod) => {
                setEditingProduct(prod);
                setIsProductEditorOpen(true);
              }}
              onUpdateVariantStock={handleUpdateVariantStock}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomersTab customers={customers} />
          )}

          {activeTab === 'settings' && settings && (
            <AdminSettingsTab
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
          onOpenPackingSlip={(o) => {
            setSelectedOrder(null);
            setPackingSlipOrder(o);
          }}
        />
      )}

      {/* Packing Slip Print Modal */}
      {packingSlipOrder && (
        <PackingSlipModal
          order={packingSlipOrder}
          onClose={() => setPackingSlipOrder(null)}
        />
      )}

      {/* Product Editor Modal */}
      {isProductEditorOpen && (
        <ProductEditorModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsProductEditorOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
