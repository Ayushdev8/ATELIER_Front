'use client';

// FUTURE BACKEND INTEGRATION:
// Replace local demo cart operations with backend cart operations.

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { calculateDiscountedPrice } from '@/utils/calculateDiscount';
import { useNotification } from '@/hooks/useNotification';
import api from '@/service/api';

const CartContext = createContext(null);
// const CART_STORAGE_KEY = 'atelier_cart_items';
const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING_FEE = 15;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({
    cartId:null,
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });
  const[cartLoading,setCartLoading] = useState(false);
  const { notify } = useNotification();

  // Load from localStorage only after mount to prevent hydration mismatch
  // useEffect(() => {
  //   const saved = getStorageItem(CART_STORAGE_KEY, []);
  //   setItems(Array.isArray(saved) ? saved : []);
  //   setIsInitialized(true);
  // }, []);

  // // Save to localStorage whenever cart changes, after initialization
  // useEffect(() => {
  //   if (isInitialized) {
  //     setStorageItem(CART_STORAGE_KEY, items);
  //   }
  // }, [items, isInitialized]);

  const getAllCartItems = async()=>{
    setCartLoading(true);
    try{
      const res = await api.get("/cart/getItems")
      console.log(res.data);
      setCartItems(res.data);
    }catch(err){
      console.log(err.response?.data?.message || err.response?.data || err.message);
    }finally{
      setCartLoading(false);
    }

  }
  useEffect(()=>{
      getAllCartItems();
  },[])

  const addToCart = async (selectedVariant,quantity)=>{
     try{
      const res = await api.post("/cart/addToCart",{
        "variantId":selectedVariant.id,
        "quantity":quantity
      })
      console.log(res.data);
      getAllCartItems();
      notify.success("item added in your cart");
     }catch(err){
      console.log(err.response?.data?.message || err.response?.data || err.message);
      notify.error(err.response?.data?.message || err.response?.data || err.message)
     }
  }

  // Update quantity
  const updateQuantity = async (variantId,newQuantity)=>{
    try{
      const res = await api.patch(`/cart/updateItem/${variantId}`,
      newQuantity
    )
     console.log(res.data);
     getAllCartItems();
     notify.success(res.data);
    }catch(err){
      console.log(err.response?.data?.message || err.response?.data || err.message);
      notify.error(err.response?.data?.message || err.response?.data || err.message);
    }
  }

    
  

  // Remove from cart
  const removeFromCart = async (variantId)=>{
    try{
      const res = await api.delete(`/cart/deleteItem/${variantId}`)
      console.log(res.data);
      getAllCartItems();
      notify.info(res.data);
    }catch(err){
      console.log(err.response?.data?.message || err.response?.data || err.message);
      notify.error(err.response?.data?.message || err.response?.data || err.message);

    }
    
  }

  // // Clear cart
  const clearCart = useCallback(() => {
    
  }, []);

  // Totals calculations
  const { totalItems, originalSubtotal, discountedSubtotal, discountSavings, shippingFee, finalTotal } = useMemo(() => {
    
    let origSub = 0;

    cartItems.items.forEach((item) => {
      origSub += item.baseMrp * item.quantity;
    });
    const subtotal = cartItems.totalAmount;
    const savings = Math.max(0, origSub - subtotal );
    const shipping =  subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
    const total = subtotal + shipping;

    return {
      totalItems: cartItems.totalItems,
      originalSubtotal: Math.round(origSub),
      discountedSubtotal: Math.round(subtotal),
      discountSavings: Math.round(savings),
      shippingFee: shipping,
      finalTotal: Math.round(total),
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
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
        cartLoading,
        getAllCartItems,
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
