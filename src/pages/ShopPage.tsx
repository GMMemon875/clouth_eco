import React, { useState, useEffect, useCallback } from 'react';
import {
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  X,
  RotateCcw,
} from 'lucide-react';
import { IProduct, ICategory } from '../types/store';
import { fetchProducts, fetchCategories } from '../api';
import { ProductCard } from '../components/product/ProductCard';
import { FilterDrawer, FilterState } from '../components/product/FilterDrawer';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

interface ShopPageProps {
  initialSearch?: string;
  initialCategory?: string;
  initialSale?: boolean;
  initialNewArrival?: boolean;
  initialBestSeller?: boolean;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialSearch = '',
  initialCategory = '',
  initialSale = false,
  initialNewArrival = false,
  initialBestSeller = false,
  onNavigate,
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Search input state
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || 'all',
    fabric: 'all',
    size: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    newArrival: initialNewArrival,
    bestSeller: initialBestSeller,
    sale: initialSale,
    sort: 'newest',
  });

  // Load Categories once
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.warn);
  }, []);

  // Sync props changes if user navigated via header links
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: initialCategory || prev.category,
      newArrival: initialNewArrival || prev.newArrival,
      bestSeller: initialBestSeller || prev.bestSeller,
      sale: initialSale || prev.sale,
    }));
    if (initialSearch !== undefined) {
      setSearchInput(initialSearch);
    }
  }, [initialCategory, initialNewArrival, initialBestSeller, initialSale, initialSearch]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: 12,
        sort: filters.sort,
      };

      if (searchInput.trim()) params.search = searchInput.trim();
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.fabric && filters.fabric !== 'all') params.fabric = filters.fabric;
      if (filters.size && filters.size !== 'all') params.size = filters.size;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.inStock) params.inStock = true;
      if (filters.newArrival) params.newArrival = true;
      if (filters.bestSeller) params.bestSeller = true;
      if (filters.sale) params.sale = true;

      const res = await fetchProducts(params);
      setProducts(res.products);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters, searchInput]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      fabric: 'all',
      size: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      newArrival: false,
      bestSeller: false,
      sale: false,
      sort: 'newest',
    });
    setSearchInput('');
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  return (
    <div id="shop-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
            All Collections
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
            Pakistani Designer Storefront
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse {total} handcrafted suits, pret kurtas, and luxury unstitched fabrics.
          </p>
        </div>

        {/* Search input in shop */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by suit name or SKU (e.g. LS-101)..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-[#8b3a42] focus:bg-white outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-[#8b3a42] transition shrink-0"
          >
            Find
          </button>
        </form>
      </div>

      {/* Filter Chips / Quick Category Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleFilterChange({ category: 'all' })}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
            filters.category === 'all'
              ? 'bg-stone-900 text-white font-semibold'
              : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-400'
          }`}
        >
          All Suits
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleFilterChange({ category: cat.slug })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              filters.category === cat.slug
                ? 'bg-stone-900 text-white font-semibold'
                : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Control Bar: Mobile Filter Button & Sorting */}
      <div className="flex items-center justify-between gap-4 py-3 px-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            id="mobile-filter-open-btn"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 shadow-xs hover:bg-stone-100 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b3a42]" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-stone-500">
            Showing <strong className="text-stone-800">{products.length}</strong> of {total} products
          </span>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
          <label htmlFor="sort-select" className="text-xs text-stone-600 hidden sm:block">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={filters.sort}
            onChange={(e) => handleFilterChange({ sort: e.target.value })}
            className="bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#8b3a42]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="best_sellers">Best Sellers</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: Sidebar + Products Grid */}
      <div className="flex gap-8 items-start">
        {/* Filter Drawer / Sidebar */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalProductsCount={total}
        />

        {/* Product Grid Stage */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No clothing items found"
              description="We couldn't find any outfits matching your current filter criteria. Try clearing filters or searching for terms like 'Lawn', 'Embroidered', or 'Chiffon'."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.sku} product={product} onNavigate={onNavigate} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-stone-600 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
