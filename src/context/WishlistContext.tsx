import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProduct } from '../types/store';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: IProduct[];
  addToWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: IProduct) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'noor_clothing_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<IProduct[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to persist wishlist:', e);
    }
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => (p.id || (p as any)._id || p.sku) === productId);
  };

  const addToWishlist = (product: IProduct) => {
    const id = product.id || (product as any)._id || product.sku;
    if (!isInWishlist(id)) {
      setWishlist([...wishlist, product]);
      showToast(`Added "${product.name}" to your wishlist.`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const item = wishlist.find((p) => (p.id || (p as any)._id || p.sku) === productId);
    setWishlist(wishlist.filter((p) => (p.id || (p as any)._id || p.sku) !== productId));
    if (item) {
      showToast(`Removed "${item.name}" from your wishlist.`, 'info');
    }
  };

  const toggleWishlist = (product: IProduct) => {
    const id = product.id || (product as any)._id || product.sku;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
