'use client';

// FUTURE BACKEND INTEGRATION:
// Replace local demo cart operations with backend cart operations.

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { calculateDiscountedPrice } from '@/utils/calculateDiscount';
import { useNotification } from '@/hooks/useNotification';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'atelier_cart_items';
const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING_FEE = 15;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { notify } = useNotification();

  // Load from localStorage only after mount to prevent hydration mismatch
  useEffect(() => {
    const saved = getStorageItem(CART_STORAGE_KEY, []);
    setItems(Array.isArray(saved) ? saved : []);
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever cart changes, after initialization
  useEffect(() => {
    if (isInitialized) {
      setStorageItem(CART_STORAGE_KEY, items);
    }
  }, [items, isInitialized]);

  // Add to Cart
  const addToCart = useCallback((product, quantity = 1, selectedSize = null, selectedColor = null) => {
    if (!product || !product.id) return;

    setItems((prevItems) => {
      const itemKey = `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`;
      const existingIndex = prevItems.findIndex((i) => i.cartItemId === itemKey);

      const effectivePrice = calculateDiscountedPrice(product.price, product.discountPercentage);
      const originalPrice = product.price;
      const maxStock = product.stock || 99;

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > maxStock) {
          notify.warning(`Maximum stock reached (${maxStock} available)`);
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        notify.success(`Updated "${product.name}" quantity to ${newQuantity}`);
        return updated;
      } else {
        if (quantity > maxStock) {
          notify.warning(`Only ${maxStock} items available in stock`);
          return prevItems;
        }

        const newItem = {
          cartItemId: itemKey,
          id: product.id,
          name: product.name,
          category: product.category,
          originalPrice,
          effectivePrice,
          discountPercentage: product.discountPercentage || 0,
          image: product.images?.[0] || '',
          stock: maxStock,
          size: selectedSize || product.sizes?.[0] || null,
          color: selectedColor || product.colors?.[0] || null,
          quantity,
        };

        notify.success(`Added "${product.name}" to cart`);
        return [...prevItems, newItem];
      }
    });
  }, [notify]);

  // Update quantity
  const updateQuantity = useCallback((cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          if (newQuantity > item.stock) {
            notify.warning(`Sorry, only ${item.stock} units available.`);
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  }, [notify]);

  // Remove from cart
  const removeFromCart = useCallback((cartItemId) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.cartItemId === cartItemId);
      if (itemToRemove) {
        notify.info(`Removed "${itemToRemove.name}" from cart`);
      }
      return prevItems.filter((i) => i.cartItemId !== cartItemId);
    });
  }, [notify]);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    setStorageItem(CART_STORAGE_KEY, []);
  }, []);

  // Totals calculations
  const { totalItems, originalSubtotal, discountedSubtotal, discountSavings, shippingFee, finalTotal } = useMemo(() => {
    let count = 0;
    let origSub = 0;
    let discSub = 0;

    items.forEach((item) => {
      count += item.quantity;
      origSub += item.originalPrice * item.quantity;
      discSub += item.effectivePrice * item.quantity;
    });

    const savings = Math.max(0, origSub - discSub);
    const shipping = discSub >= FREE_SHIPPING_THRESHOLD || discSub === 0 ? 0 : STANDARD_SHIPPING_FEE;
    const total = discSub + shipping;

    return {
      totalItems: count,
      originalSubtotal: Math.round(origSub),
      discountedSubtotal: Math.round(discSub),
      discountSavings: Math.round(savings),
      shippingFee: shipping,
      finalTotal: Math.round(total),
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isInitialized,
        totalItems,
        originalSubtotal,
        discountedSubtotal,
        discountSavings,
        shippingFee,
        finalTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
