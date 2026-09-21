import React, { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

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
import { FAQPage } from './pages/static/FAQPage';
import { ReturnPolicyPage } from './pages/static/ReturnPolicyPage';
import { ContactPage } from './pages/static/ContactPage';
import { AboutPage } from './pages/static/AboutPage';
import { PrivacyPolicyPage, TermsPage } from './pages/static/PrivacyPolicyPage';

export function AppContent() {
  const [currentUrl, setCurrentUrl] = useState(() => window.location.pathname + window.location.search);

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

      {/* Main Navigation Header */}
      <Header
        currentPath={currentUrl}
        onNavigate={navigate}
        onSearchSubmit={(term) => navigate(`/shop?search=${encodeURIComponent(term)}`)}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {pageContent}
      </main>

      {/* Slide-over Shopping Bag Drawer */}
      <CartDrawer onNavigate={navigate} />

      {/* Floating Sticky WhatsApp Button */}
      <StickyWhatsAppButton />

      {/* Mobile Sticky Navigation Dock */}
      <MobileBottomNav currentPath={path} onNavigate={navigate} />

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </SettingsProvider>
  );
}
