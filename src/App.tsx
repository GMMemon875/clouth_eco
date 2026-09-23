import React, { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { StickyWhatsAppButton } from './components/common/StickyWhatsAppButton';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminResetPasswordPage } from './pages/AdminResetPasswordPage';
import { FAQPage } from './pages/static/FAQPage';
import { ReturnPolicyPage } from './pages/static/ReturnPolicyPage';
import { ContactPage } from './pages/static/ContactPage';
import { AboutPage } from './pages/static/AboutPage';
import { PrivacyPolicyPage, TermsPage } from './pages/static/PrivacyPolicyPage';
import { DashboardPage } from './pages/DashboardPage';
import { fetchCategories } from './api';
import { AlertCircle } from 'lucide-react';

const defaultCategories = [
  { slug: '3-piece-suits', name: '3-Piece Luxury Suits' },
  { slug: '2-piece-suits', name: '2-Piece Everyday Suits' },
  { slug: 'luxury-lawn', name: 'Luxury Swiss Lawn' },
  { slug: 'ready-to-wear', name: 'Ready-to-Wear Pret' },
  { slug: 'unstitched', name: 'Unstitched Fabrics' },
  { slug: 'formals-festive', name: 'Festive & Chiffon Formals' },
];

export function AppContent() {
  const { user, isAuthenticated, isAdmin, loading: authLoading, logout } = useAuth();
  const [currentUrl, setCurrentUrl] = useState(() => window.location.pathname + window.location.search);
  const [categoriesList, setCategoriesList] = useState(defaultCategories);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        if (cats && cats.length > 0) {
          setCategoriesList(cats.map((c) => ({ slug: c.slug, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentUrl) {
      window.history.pushState({}, '', path);
      setCurrentUrl(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Parse path and search params
  const [path, search] = currentUrl.split('?');
  const queryParams = new URLSearchParams(search || '');

  // ==========================================
  // SECURE DEDICATED ADMIN ROUTE (/admin & /dashboard)
  // ==========================================
  if (
    path === '/admin' ||
    path === '/dashboard' ||
    path.startsWith('/admin/') ||
    path.startsWith('/dashboard/')
  ) {
    // Check if reset password request
    if (path === '/admin/reset-password') {
      return (
        <AdminResetPasswordPage
          token={queryParams.get('token') || ''}
          onNavigateToLogin={() => navigate('/admin')}
        />
      );
    }

    // Loading session verification
    if (authLoading) {
      return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center text-amber-400">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-400">Verifying administrator authorization...</p>
          </div>
        </div>
      );
    }

    // If logged in as customer (user role), strictly deny access to admin area!
    if (isAuthenticated && !isAdmin) {
      return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4 py-12 text-stone-100">
          <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">403 Access Denied</h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              You are currently signed in as customer (<strong>{user?.email}</strong>). Normal customer
              accounts do not have administrator permissions to access this management console.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition"
              >
                Return to Public Storefront
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/admin');
                }}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold transition"
              >
                Sign Out & Switch Account
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If not authenticated: show Admin Login Screen
    if (!isAuthenticated || !isAdmin) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => navigate('/admin')}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    // Authorized Administrator: Render Dashboard
    return (
      <DashboardPage
        onNavigateStore={() => navigate('/')}
        categories={categoriesList}
      />
    );
  }

  // ==========================================
  // PUBLIC STOREFRONT ROUTES
  // ==========================================
  let pageContent: React.ReactNode = null;

  if (path === '/' || path === '') {
    pageContent = <HomePage onNavigate={navigate} />;
  } else if (path === '/shop') {
    pageContent = (
      <ShopPage
        initialCategory={queryParams.get('category') || ''}
        initialSearch={queryParams.get('search') || ''}
        initialSale={queryParams.get('sale') === 'true'}
        initialNewArrival={queryParams.get('newArrival') === 'true'}
        initialBestSeller={queryParams.get('bestSeller') === 'true'}
        onNavigate={navigate}
      />
    );
  } else if (path.startsWith('/product/')) {
    const slug = path.replace('/product/', '');
    pageContent = <ProductDetailPage slug={slug} onNavigate={navigate} />;
  } else if (path === '/cart') {
    pageContent = <CartPage onNavigate={navigate} />;
  } else if (path === '/checkout') {
    pageContent = (
      <CheckoutPage
        onNavigate={navigate}
        onOrderSuccess={(orderNum) => navigate(`/order-confirmation?orderNumber=${orderNum}`)}
      />
    );
  } else if (path === '/order-confirmation') {
    const orderNumber = queryParams.get('orderNumber') || '';
    pageContent = <OrderConfirmationPage orderNumber={orderNumber} onNavigate={navigate} />;
  } else if (path === '/track-order') {
    const orderNumber = queryParams.get('orderNumber') || '';
    pageContent = <TrackOrderPage initialOrderNumber={orderNumber} onNavigate={navigate} />;
  } else if (path === '/wishlist') {
    pageContent = <WishlistPage onNavigate={navigate} />;
  } else if (path === '/login') {
    pageContent = (
      <LoginPage
        onNavigate={navigate}
        redirectTo={queryParams.get('redirect') || '/account'}
      />
    );
  } else if (path === '/register') {
    pageContent = <RegisterPage onNavigate={navigate} />;
  } else if (path === '/account') {
    pageContent = (
      <AccountPage
        onNavigate={navigate}
        initialTab={queryParams.get('tab') === 'orders' ? 'orders' : 'profile'}
      />
    );
  } else if (path === '/faq') {
    pageContent = <FAQPage />;
  } else if (path === '/return-policy') {
    pageContent = <ReturnPolicyPage />;
  } else if (path === '/contact') {
    pageContent = <ContactPage />;
  } else if (path === '/about') {
    pageContent = <AboutPage />;
  } else if (path === '/privacy-policy') {
    pageContent = <PrivacyPolicyPage />;
  } else if (path === '/terms') {
    pageContent = <TermsPage />;
  } else {
    // Fallback to home
    pageContent = <HomePage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1c1917]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation Header - completely without Admin/Dashboard link */}
      <Header
        currentPath={currentUrl}
        onNavigate={navigate}
        onSearchSubmit={(term) => navigate(`/shop?search=${encodeURIComponent(term)}`)}
      />

      {/* Main Page Body */}
      <main className="flex-1">{pageContent}</main>

      {/* Slide-over Shopping Bag Drawer */}
      <CartDrawer onNavigate={navigate} />

      {/* Floating Sticky WhatsApp Button */}
      <StickyWhatsAppButton />

      {/* Mobile Sticky Navigation Dock - completely without Admin/Dashboard link */}
      <MobileBottomNav currentPath={path} onNavigate={navigate} />

      {/* Footer - completely without Admin/Dashboard link */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
