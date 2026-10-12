'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this local login and authentication simulation with your real authentication API / JWT session endpoints.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'atelier_demo_user';

const DEFAULT_DEMO_USER = {
  id: 'usr_demo_882',
  firstName: 'Julian',
  lastName: 'Sterling',
  username: 'julian_sterling',
  email: 'julian.sterling@example.com',
  phone: '+1 (555) 321-9876',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  addresses: [
    {
      id: 'addr_1',
      title: 'Home (Default)',
      fullName: 'Julian Sterling',
      street: '450 Lexington Ave, Apt 14B',
      city: 'New York',
      state: 'NY',
      zip: '10017',
      country: 'United States',
      phone: '+1 (555) 321-9876',
      isDefault: true,
    },
    {
      id: 'addr_2',
      title: 'Design Studio',
      fullName: 'Julian Sterling',
      street: '180 Varick St, Floor 6',
      city: 'New York',
      state: 'NY',
      zip: '10014',
      country: 'United States',
      phone: '+1 (555) 432-8877',
      isDefault: false,
    }
  ],
  isAdmin: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useNotification();

  // Load demo auth state from localStorage safely after mount
  useEffect(() => {
    const savedUser = getStorageItem(AUTH_STORAGE_KEY, null);
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    } else {
      // Provide default demo logged-in user for effortless exploration
      setUser(DEFAULT_DEMO_USER);
      setIsAuthenticated(true);
      setStorageItem(AUTH_STORAGE_KEY, DEFAULT_DEMO_USER);
    }
    setIsLoading(false);
  }, []);

  // Simulated Login
  const login = useCallback(
    async (emailOrUsername, password) => {
      // FUTURE BACKEND INTEGRATION:
      // Replace this local login simulation with the real authentication endpoint.
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!emailOrUsername || !password) {
            notify.error('Please enter both username/email and password.');
            reject(new Error('Missing credentials'));
            return;
          }

          if (password.length < 6) {
            notify.error('Password must be at least 6 characters.');
            reject(new Error('Password too short'));
            return;
          }

          const loggedInUser = {
            ...DEFAULT_DEMO_USER,
            email: emailOrUsername.includes('@') ? emailOrUsername : DEFAULT_DEMO_USER.email,
            username: !emailOrUsername.includes('@') ? emailOrUsername : DEFAULT_DEMO_USER.username,
          };

          setUser(loggedInUser);
          setIsAuthenticated(true);
          setStorageItem(AUTH_STORAGE_KEY, loggedInUser);
          notify.success(`Welcome back, ${loggedInUser.firstName}!`);
          resolve(loggedInUser);
        }, 500);
      });
    },
    [notify]
  );

  // Simulated Registration
  const register = useCallback(
    async (userData) => {
      // FUTURE BACKEND INTEGRATION:
      // Replace this local demo registration with your backend registration API endpoint.
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!userData.email || !userData.password || !userData.firstName) {
            notify.error('Please complete all required fields.');
            reject(new Error('Validation error'));
            return;
          }

          const newUser = {
            id: `usr_${Date.now()}`,
            firstName: userData.firstName,
            lastName: userData.lastName || '',
            username: userData.username || userData.email.split('@')[0],
            email: userData.email,
            phone: userData.phone || '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            addresses: [
              {
                id: `addr_${Date.now()}`,
                title: 'Primary Address',
                fullName: `${userData.firstName} ${userData.lastName || ''}`.trim(),
                street: '123 Market Street',
                city: 'San Francisco',
                state: 'CA',
                zip: '94105',
                country: 'United States',
                phone: userData.phone || '',
                isDefault: true,
              }
            ],
            isAdmin: false,
          };

          setUser(newUser);
          setIsAuthenticated(true);
          setStorageItem(AUTH_STORAGE_KEY, newUser);
          notify.success(`Account created successfully! Welcome, ${newUser.firstName}.`);
          resolve(newUser);
        }, 600);
      });
    },
    [notify]
  );

  // Update profile
  const updateProfile = useCallback(
    (updatedFields) => {
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...updatedFields };
        setStorageItem(AUTH_STORAGE_KEY, updated);
        notify.success('Profile details updated successfully');
        return updated;
      });
    },
    [notify]
  );

  // Save new address
  const addAddress = useCallback(
    (newAddress) => {
      setUser((prev) => {
        if (!prev) return prev;
        const addressWithId = {
          ...newAddress,
          id: `addr_${Date.now()}`,
        };
        const updatedAddresses = [addressWithId, ...(prev.addresses || [])];
        const updated = { ...prev, addresses: updatedAddresses };
        setStorageItem(AUTH_STORAGE_KEY, updated);
        notify.success('New shipping address added');
        return updated;
      });
    },
    [notify]
  );

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    removeStorageItem(AUTH_STORAGE_KEY);
    notify.info('You have been logged out.');
  }, [notify]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        updateProfile,
        addAddress,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
