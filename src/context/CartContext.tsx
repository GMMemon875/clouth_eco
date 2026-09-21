import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICartItem, IProduct, IVariant } from '../types/store';
import { useSettings } from './SettingsContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: ICartItem[];
  addToCart: (product: IProduct, variant: IVariant, quantity?: number) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => boolean;
  clearCart: () => void;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  freeShippingQualified: boolean;
  amountNeededForFreeDelivery: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  totalCartItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'noor_clothing_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { settings } = useSettings();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = (product: IProduct, variant: IVariant, quantity: number = 1): boolean => {
    if (variant.stock <= 0) {
      showToast(`Sorry, ${variant.color} in size ${variant.size} is currently out of stock.`, 'error');
      return false;
    }

    const itemId = `${product.id || (product as any)._id || product.sku}_${variant.sku}`;
    const existingIndex = cart.findIndex((item) => item.id === itemId);

    const unitPrice = product.basePrice + (variant.additionalPrice || 0);
    const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || '';

    if (existingIndex > -1) {
      const existing = cart[existingIndex];
      const nextQty = existing.quantity + quantity;

      if (nextQty > variant.stock) {
        showToast(
          `Cannot add more. Only ${variant.stock} available in stock for ${variant.color} (${variant.size}).`,
          'error'
        );
        return false;
      }

      const updated = [...cart];
      updated[existingIndex] = {
        ...existing,
        quantity: nextQty,
        maxStock: variant.stock,
      };
      setCart(updated);
      showToast(`Updated quantity of "${product.name}" in your bag.`, 'success');
    } else {
      if (quantity > variant.stock) {
        showToast(`Only ${variant.stock} items available in stock.`, 'error');
        return false;
      }

      const newItem: ICartItem = {
        id: itemId,
        productId: product.id || (product as any)._id || product.sku,
        productSlug: product.slug,
        productName: product.name,
        sku: product.sku,
        variantSku: variant.sku,
        color: variant.color,
        colorCode: variant.colorCode,
        size: variant.size,
        unitPrice,
        quantity,
        image: primaryImage,
        maxStock: variant.stock,
      };
      setCart([...cart, newItem]);
      showToast(`Added "${product.name}" (${variant.size}) to your bag.`, 'success');
    }

    setIsCartDrawerOpen(true);
    return true;
  };

  const updateQuantity = (itemId: string, newQuantity: number): boolean => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return true;
    }

    const item = cart.find((i) => i.id === itemId);
    if (!item) return false;

    if (newQuantity > item.maxStock) {
      showToast(`Maximum available stock reached (${item.maxStock} pieces).`, 'error');
      return false;
    }

    setCart(
      cart.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
    );
    return true;
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    setCart(cart.filter((i) => i.id !== itemId));
    if (item) {
      showToast(`Removed "${item.productName}" from your bag.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const freeShippingQualified = subtotal >= settings.delivery.freeDeliveryThreshold && subtotal > 0;
  const deliveryCharge = cart.length === 0 ? 0 : freeShippingQualified ? 0 : settings.delivery.standardCharge;
  const totalAmount = subtotal + deliveryCharge;

  const amountNeededForFreeDelivery = Math.max(0, settings.delivery.freeDeliveryThreshold - subtotal);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryCharge,
        totalAmount,
        freeShippingQualified,
        amountNeededForFreeDelivery,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        totalCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
