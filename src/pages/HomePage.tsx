import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Phone,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { IProduct, ICategory } from '../types/store';
import { fetchProducts, fetchCategories } from '../api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { useSettings } from '../context/SettingsContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newArrivals, setNewArrivals] = useState<IProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      fetchCategories(),
      fetchProducts({ newArrival: true, limit: 4 }),
      fetchProducts({ bestSeller: true, limit: 4 }),
    ])
      .then(([cats, arrivalsRes, bestRes]) => {
        setCategories(cats);
        setNewArrivals(arrivalsRes.products);
        setBestSellers(bestRes.products);
      })
      .catch((err) => {
        console.warn('Home fetch error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const waNumber = settings.whatsappNumber.replace(/[^\d]/g, '');

  return (
    <div id="home-page" className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Banner */}
      <section id="hero-banner" className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80"
            alt="Pakistani Luxury Lawn Summer Collection"
            className="w-full h-full object-cover object-top opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 border border-[#c5a880]/30 text-xs font-semibold tracking-wider text-[#c5a880] uppercase backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spring / Summer 2026 Collection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Timeless Elegance, <br />
              <span className="italic text-[#c5a880] font-normal">Pure Swiss Lawn</span> & Chiffon
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-lg">
              Discover exquisitely embroidered 3-piece luxury suits, breathable Swiss lawns, and effortless pret wear.
              Handcrafted silhouettes tailored for Pakistani festivities and everyday poise.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={() => onNavigate('/shop')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#8b3a42] hover:bg-[#6b232a] text-white font-bold text-sm rounded-xl transition shadow-lg hover:shadow-xl active:scale-[0.99]"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum, I am browsing your new arrivals on the website and would like to order.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition border border-emerald-500/30 backdrop-blur-sm shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick feature pill row */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-stone-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cash on Delivery (COD)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free Delivery on Rs. 3,500+</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7-Day Easy Exchange</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category Showcase */}
      <section id="shop-by-category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-bold text-[#8b3a42] hover:text-[#6b232a] flex items-center gap-1 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.slug}
              id={`cat-card-${cat.slug}`}
              onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition text-left"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-stone-100 border border-stone-200 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="font-medium text-xs sm:text-sm text-stone-900 group-hover:text-[#8b3a42] transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5">Explore</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Showcase */}
      <section id="new-arrivals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
              Fresh Off The Loom
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop?newArrival=true')}
            className="text-xs font-bold text-[#8b3a42] hover:text-[#6b232a] flex items-center gap-1 transition"
          >
            <span>Explore All New Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.sku} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Luxury Fabric & Craftsmanship Feature Banner */}
      <section id="fabric-feature-banner" className="bg-stone-100 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
                Heirloom Textiles
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                Pure Swiss Lawn, Crinkle Chiffon & Authentic Resham Zari
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every Noor & Co. suit is woven using super-fine combed yarns tailored for the warmth of Pakistani summers.
                From intricate chikankari cutwork to hand-embellished necklines and pure silk dupattas, each ensemble delivers breathability and royal grace.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <h3 className="font-bold text-sm text-stone-900">80s Combed Lawn</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Ultra-breathable thread count</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <h3 className="font-bold text-sm text-stone-900">100% Color Fastness</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Vibrant reactive vat dyes</p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('/shop?category=luxury-lawn')}
                  className="px-6 py-3 bg-stone-900 hover:bg-[#8b3a42] text-white text-xs font-semibold rounded-xl transition shadow"
                >
                  View Luxury Lawn Collection
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80"
                  alt="Embroidery craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md mt-6">
                <img
                  src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=700&q=80"
                  alt="Dupatta drape elegance"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Showcase */}
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop?bestSeller=true')}
            className="text-xs font-bold text-[#8b3a42] hover:text-[#6b232a] flex items-center gap-1 transition"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.sku} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Why Shop With Us Trust Badges */}
      <section id="why-shop-with-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 sm:p-12 text-center">
          <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
            The Noor & Co. Promise
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 mb-8">
            Why Women Across Pakistan Trust Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Cash on Delivery</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Pay safely with cash when your parcel reaches your doorstep anywhere in Pakistan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Free Shipping on Rs. 3,500+</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Standard delivery of Rs. 250 waived automatically on all qualifying orders.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">7-Day Easy Exchange</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Need a different size or shade? Our hassle-free exchange process has you covered.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Instant WhatsApp Orders</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Prefer chatting directly? Message our consultants anytime with your suit code.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
