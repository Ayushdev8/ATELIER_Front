'use client';

// FUTURE BACKEND INTEGRATION:
// Replace these local store state mutations with your REST / GraphQL product and order management APIs.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts } from '@/data/products';
import { initialOrders } from '@/data/orders';
import { initialCustomers } from '@/data/customers';
import { dashboardOverview } from '@/data/dashboard';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';
import api from '@/service/api';

const StoreContext = createContext(null);

const PRODUCTS_STORAGE_KEY = 'atelier_store_products';
const ORDERS_STORAGE_KEY = 'atelier_store_orders';
const CUSTOMERS_STORAGE_KEY = 'atelier_store_customers';
const SETTINGS_STORAGE_KEY = 'atelier_store_settings';

export function StoreProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [settings, setSettings] = useState(dashboardOverview.storeSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const { notify } = useNotification();

  // Load from localStorage on mount safely
  useEffect(() => {
    const savedProducts = getStorageItem(PRODUCTS_STORAGE_KEY, initialProducts);
    const savedOrders = getStorageItem(ORDERS_STORAGE_KEY, initialOrders);
    const savedCustomers = getStorageItem(CUSTOMERS_STORAGE_KEY, initialCustomers);
    const savedSettings = getStorageItem(SETTINGS_STORAGE_KEY, dashboardOverview.storeSettings);

    if (Array.isArray(savedProducts) && savedProducts.length > 0) setProducts(savedProducts);
    if (Array.isArray(savedOrders) && savedOrders.length > 0) setOrders(savedOrders);
    if (Array.isArray(savedCustomers) && savedCustomers.length > 0) setCustomers(savedCustomers);
    if (savedSettings) setSettings(savedSettings);

    setIsLoaded(true);
  }, []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 12,
    totalPages: 1,
    totalElements: 0,
    last: true,
    first: true,
  });

  const getProduct = async (page = 0, size = 12) => {
    setLoading(true);
    try {
      const res = await api.get("/public/products", {
        params: {
          pageNumber: page,
          pageSize: size,
          page: page,
          size: size,
        },
      });
      console.log(res.data);
      const data = res.data;
      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data.content)
          ? data.content
          : Array.isArray(data.data)
            ? data.data
            : [];
      setProducts(productList);

      // Preserve pagination metadata if returned by API
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setPagination({
          pageNumber: data.number ?? data.pageNumber ?? data.page ?? page,
          pageSize: data.size ?? data.pageSize ?? size,
          totalPages: data.totalPages ?? (data.totalElements ? Math.ceil(data.totalElements / (data.size || data.pageSize || size)) : 1),
          totalElements: data.totalElements ?? data.total ?? productList.length,
          last: data.last ?? data.lastPage ?? true,
          first: data.first ?? data.firstPage ?? (page === 0),
        });
      }
    } catch (err) {
      console.log(err.response?.data?.message || err.response?.data || err.message);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const updateProduct = useCallback(
    (id, updatedFields) => {
      // FUTURE BACKEND INTEGRATION:
      // Replace with PUT/PATCH /api/products/:id
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
        setStorageItem(PRODUCTS_STORAGE_KEY, updated);
        notify.success('Product updated successfully');
        return updated;
      });
    },
    [notify]
  );

  const deleteProduct = useCallback(
    (id) => {
      // FUTURE BACKEND INTEGRATION:
      // Replace with DELETE /api/products/:id
      setProducts((prev) => {
        const p = prev.find((item) => item.id === id);
        const updated = prev.filter((item) => item.id !== id);
        setStorageItem(PRODUCTS_STORAGE_KEY, updated);
        if (p) {
          notify.info(`Product "${p.name}" deleted`);
        }
        return updated;
      });
    },
    [notify]
  );

  // Order Operations
  const addOrder = useCallback(
    (orderData) => {
      // FUTURE BACKEND INTEGRATION:
      // Replace this local demo order creation with your real order endpoint.
      const newOrder = {
        ...orderData,
        id: orderData.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().split('T')[0],
        status: orderData.status || 'Processing',
        paymentStatus: orderData.paymentStatus || 'Paid',
      };

      setOrders((prev) => {
        const updated = [newOrder, ...prev];
        setStorageItem(ORDERS_STORAGE_KEY, updated);
        return updated;
      });

      return newOrder;
    },
    []
  );

  const updateOrderStatus = useCallback(
    (orderId, newStatus) => {
      // FUTURE BACKEND INTEGRATION:
      // Replace with PATCH /api/orders/:id/status
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
        setStorageItem(ORDERS_STORAGE_KEY, updated);
        notify.success(`Order #${orderId} marked as ${newStatus}`);
        return updated;
      });
    },
    [notify]
  );

  // Store Settings
  const updateSettings = useCallback(
    (newSettings) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        setStorageItem(SETTINGS_STORAGE_KEY, updated);
        notify.success('Store settings saved successfully');
        return updated;
      });
    },
    [notify]
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        pagination,
        loading,
        setLoading,
        error,
        setError,
        getProduct,
        orders,
        customers,
        settings,
        isLoaded,
        
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
