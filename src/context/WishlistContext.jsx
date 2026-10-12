'use client';

// FUTURE BACKEND INTEGRATION:
// Replace local wishlist operations with backend wishlist endpoints.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'atelier_wishlist_items';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { notify } = useNotification();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = getStorageItem(WISHLIST_STORAGE_KEY, []);
    setItems(Array.isArray(saved) ? saved : []);
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      setStorageItem(WISHLIST_STORAGE_KEY, items);
    }
  }, [items, isInitialized]);

  const isInWishlist = useCallback(
    (productId) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  const toggleWishlist = useCallback(
    (product) => {
      if (!product || !product.id) return;

      setItems((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          notify.info(`Removed "${product.name}" from your wishlist`);
          return prev.filter((item) => item.id !== product.id);
        } else {
          notify.success(`Saved "${product.name}" to your wishlist`);
          return [...prev, product];
        }
      });
    },
    [notify]
  );

  const removeFromWishlist = useCallback(
    (productId) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === productId);
        if (item) {
          notify.info(`Removed "${item.name}" from wishlist`);
        }
        return prev.filter((i) => i.id !== productId);
      });
    },
    [notify]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    setStorageItem(WISHLIST_STORAGE_KEY, []);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInitialized,
        wishlistCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
