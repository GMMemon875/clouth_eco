import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shirt,
  Filter,
} from 'lucide-react';
import { IProduct } from '../../types/store';

interface AdminProductsTabProps {
  products: Array<IProduct & {
    totalStock: number;
    hasLowStock: boolean;
    isOutOfStock: boolean;
  }>;
  categories: Array<{ slug: string; name: string }>;
  onOpenNewProductModal: () => void;
  onEditProduct: (product: IProduct) => void;
  onUpdateVariantStock: (productId: string, variantSku: string, stock: number) => Promise<void>;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  categories,
  onOpenNewProductModal,
  onEditProduct,
  onUpdateVariantStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editingStockSku, setEditingStockSku] = useState<string | null>(null);
  const [stockInputVal, setStockInputVal] = useState<number>(0);

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? p.hasLowStock
        : p.isOutOfStock;

    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q);

    return matchesCategory && matchesStock && matchesSearch;
  });

  const handleSaveStock = async (productId: string, sku: string) => {
    try {
      await onUpdateVariantStock(productId, sku, stockInputVal);
      setEditingStockSku(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            Catalog & Inventory Management
          </h1>
          <p className="text-xs text-stone-500">
            Track sizes, adjust Pakistani lawn & formal wear quantities, and publish new designs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-add-product-btn"
            onClick={onOpenNewProductModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#8b3a42] hover:bg-[#722f36] text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Suit / Pret</span>
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, fabric..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
          />
        </div>

        {/* Category filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock status filter */}
        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="low">Low Stock Alerts (&le; 3 units)</option>
            <option value="out">Out of Stock (0 units)</option>
          </select>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <Shirt className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-semibold text-stone-800 text-sm">No products found</p>
            <p className="text-xs mt-1">Try clearing your search query or category filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Dress Image & Title</th>
                  <th className="py-3 px-4">Fabric</th>
                  <th className="py-3 px-4">Price (PKR)</th>
                  <th className="py-3 px-4">Available Variants & Stock</th>
                  <th className="py-3 px-4">Inventory Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((prod) => {
                  return (
                    <tr key={prod.id || prod.sku} className="hover:bg-stone-50/70 transition">
                      {/* Image & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                            alt={prod.name}
                            className="w-12 h-16 object-cover rounded-lg border border-stone-200 shadow-sm flex-shrink-0"
                          />
                          <div className="max-w-[200px] sm:max-w-[260px]">
                            <p className="font-semibold text-stone-900 line-clamp-1">{prod.name}</p>
                            <p className="text-[11px] font-mono text-stone-500 mt-0.5">SKU: {prod.sku}</p>
                            <span className="text-[10px] text-stone-400 capitalize">
                              {prod.category.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Fabric */}
                      <td className="py-3.5 px-4 text-stone-700 font-medium">
                        {prod.fabric}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-stone-900">
                          Rs. {prod.basePrice.toLocaleString()}
                        </p>
                        {prod.compareAtPrice && (
                          <p className="text-[10px] text-stone-400 line-through">
                            Rs. {prod.compareAtPrice.toLocaleString()}
                          </p>
                        )}
                      </td>

                      {/* Variants & stock interactive badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {prod.variants?.map((v) => {
                            const isEditingThis = editingStockSku === v.sku;

                            if (isEditingThis) {
                              return (
                                <div key={v.sku} className="flex items-center gap-1 bg-stone-100 p-1 rounded">
                                  <span className="font-bold text-[10px]">{v.size}:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={stockInputVal}
                                    onChange={(e) => setStockInputVal(Number(e.target.value))}
                                    className="w-12 px-1 py-0.5 text-xs text-center border rounded font-bold"
                                  />
                                  <button
                                    onClick={() => handleSaveStock(prod.id || prod.sku, v.sku)}
                                    className="px-1.5 py-0.5 bg-stone-900 text-white rounded text-[10px]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingStockSku(null)}
                                    className="px-1 py-0.5 text-stone-500 text-[10px]"
                                  >
                                    ✕
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={v.sku}
                                onClick={() => {
                                  setEditingStockSku(v.sku);
                                  setStockInputVal(v.stock);
                                }}
                                title={`Click to edit stock for size ${v.size}`}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border transition ${
                                  v.stock === 0
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                    : v.stock <= 3
                                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                    : 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200'
                                }`}
                              >
                                <span className="font-bold">{v.size}:</span> {v.stock}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Stock Summary Badge */}
                      <td className="py-3.5 px-4">
                        {prod.isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>Sold Out (0)</span>
                          </span>
                        ) : prod.hasLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock ({prod.totalStock})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock ({prod.totalStock})</span>
                          </span>
                        )}
                      </td>

                      {/* Edit Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onEditProduct(prod)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded transition"
                          title="Edit Product Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
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
