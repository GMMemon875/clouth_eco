import React from 'react';
import { X, RotateCcw, Filter, Check } from 'lucide-react';
import { ICategory } from '../../types/store';

export interface FilterState {
  category: string;
  fabric: string;
  size: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  sale: boolean;
  sort: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ICategory[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  totalProductsCount,
}) => {
  const fabrics = [
    'All Fabrics',
    'Luxury Swiss Lawn',
    'Fine Combed Lawn',
    'Pure Crinkle Chiffon',
    '100% Egyptian Combed Cotton',
    'Heritage Kamalia Khaddar',
    'Textured Jacquard Cotton',
    'Pure Silk Velvet',
  ];

  const sizes = ['All Sizes', 'XS', 'S', 'M', 'L', 'XL', 'Unstitched'];

  const content = (
    <div className="space-y-6 text-sm">
      {/* Categories */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-3">
          Category
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange({ category: 'all' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
              filters.category === 'all' || !filters.category
                ? 'bg-stone-900 text-white font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>All Categories</span>
            {(filters.category === 'all' || !filters.category) && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onFilterChange({ category: cat.slug })}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                filters.category === cat.slug
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.slug && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-3">
          Price Range (PKR)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-stone-500 block mb-1">Min (Rs.)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              placeholder="e.g. 1500"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#8b3a42] outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 block mb-1">Max (Rs.)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              placeholder="e.g. 10000"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#8b3a42] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Fabric */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-3">
          Fabric
        </h4>
        <div className="space-y-1">
          {fabrics.map((f) => {
            const val = f === 'All Fabrics' ? 'all' : f;
            const isSelected = filters.fabric === val || (!filters.fabric && val === 'all');
            return (
              <button
                key={f}
                type="button"
                onClick={() => onFilterChange({ fabric: val })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isSelected ? 'bg-stone-200 font-semibold text-stone-900' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{f}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#8b3a42]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-3">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const val = s === 'All Sizes' ? 'all' : s;
            const isSelected = filters.size === val || (!filters.size && val === 'all');
            return (
              <button
                key={s}
                type="button"
                onClick={() => onFilterChange({ size: val })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-800">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
            className="w-4 h-4 rounded text-[#8b3a42] focus:ring-[#8b3a42] border-stone-300"
          />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-800">
          <input
            type="checkbox"
            checked={filters.newArrival}
            onChange={(e) => onFilterChange({ newArrival: e.target.checked })}
            className="w-4 h-4 rounded text-[#8b3a42] focus:ring-[#8b3a42] border-stone-300"
          />
          <span>New Arrivals</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-800">
          <input
            type="checkbox"
            checked={filters.bestSeller}
            onChange={(e) => onFilterChange({ bestSeller: e.target.checked })}
            className="w-4 h-4 rounded text-[#8b3a42] focus:ring-[#8b3a42] border-stone-300"
          />
          <span>Best Sellers</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-800">
          <input
            type="checkbox"
            checked={filters.sale}
            onChange={(e) => onFilterChange({ sale: e.target.checked })}
            className="w-4 h-4 rounded text-[#8b3a42] focus:ring-[#8b3a42] border-stone-300"
          />
          <span>On Sale Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filter Layout */}
      <aside className="hidden lg:block w-64 shrink-0 pr-6 border-r border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Filter className="w-4 h-4 text-[#8b3a42]" />
            <span>Filters</span>
          </div>
          <button
            onClick={onResetFilters}
            className="text-xs text-stone-500 hover:text-[#8b3a42] flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
        {content}
      </aside>

      {/* Mobile Modal Drawer Layout */}
      {isOpen && (
        <div
          id="mobile-filter-drawer-backdrop"
          className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        >
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div
              id="mobile-filter-panel"
              className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#8b3a42]" />
                  <h3 className="font-bold text-sm text-stone-900">Filters</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">{content}</div>

              <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center gap-2">
                <button
                  onClick={onResetFilters}
                  className="flex-1 py-2.5 px-3 border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-100 transition"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 bg-[#8b3a42] text-white rounded-xl text-xs font-semibold hover:bg-[#6b232a] transition shadow"
                >
                  Show ({totalProductsCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
