'use client';

// FUTURE BACKEND INTEGRATION:
// Replace these local store settings with your admin configuration endpoint: PATCH /api/admin/settings

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Store, ShieldCheck, Mail, DollarSign, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useStore();
  const { user } = useAuth();

  const [storeForm, setStoreForm] = useState({
    storeName: settings?.storeName || 'ATELIER & CO.',
    storeEmail: settings?.storeEmail || 'support@atelierandco.store',
    supportPhone: settings?.supportPhone || '+1 (800) 555-0199',
    currency: settings?.currency || 'USD ($)',
    taxRate: settings?.taxRate || 8.5,
    freeShippingThreshold: settings?.freeShippingThreshold || 150,
    standardShippingFee: settings?.standardShippingFee || 15,
  });

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    updateSettings(storeForm);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
          Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
          Store &amp; Environment Settings
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
          Configure storefront metadata, free shipping thresholds, and tax preferences.
        </p>
      </div>

      <Alert type="info">
        <strong>Demo Mode Notice:</strong> Changes made here are persisted in your browser's local demo storage. Real admin authentication and multi-tenant isolation will be enforced once connected to your backend API.
      </Alert>

      {/* Store Information Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft-sm">
        <h3 className="font-serif text-lg font-bold text-stone-950 mb-6 flex items-center gap-2">
          <Store className="w-5 h-5 text-brand-700" />
          <span>General Storefront Properties</span>
        </h3>

        <form onSubmit={handleSaveStoreSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store Brand Name"
              value={storeForm.storeName}
              onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
              required
            />
            <Input
              label="Store Support Email"
              type="email"
              value={storeForm.storeEmail}
              onChange={(e) => setStoreForm({ ...storeForm, storeEmail: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Customer Support Hotline"
              value={storeForm.supportPhone}
              onChange={(e) => setStoreForm({ ...storeForm, supportPhone: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Default Currency
              </label>
              <select
                value={storeForm.currency}
                onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                className="block w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="INR (₹)">INR (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Input
              label="Free Shipping Minimum ($)"
              type="number"
              min="0"
              value={storeForm.freeShippingThreshold}
              onChange={(e) =>
                setStoreForm({ ...storeForm, freeShippingThreshold: Number(e.target.value) })
              }
              required
            />
            <Input
              label="Standard Shipping Fee ($)"
              type="number"
              min="0"
              value={storeForm.standardShippingFee}
              onChange={(e) =>
                setStoreForm({ ...storeForm, standardShippingFee: Number(e.target.value) })
              }
              required
            />
            <Input
              label="Estimated Tax Rate (%)"
              type="number"
              step="0.1"
              min="0"
              value={storeForm.taxRate}
              onChange={(e) => setStoreForm({ ...storeForm, taxRate: Number(e.target.value) })}
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Save Store Settings
            </Button>
          </div>
        </form>
      </div>

      {/* Admin User Profile Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft-sm">
        <h3 className="font-serif text-lg font-bold text-stone-950 mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <span>Active Administrator Session</span>
        </h3>

        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'}
            alt="Admin Avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-stone-100 shadow-sm"
          />
          <div>
            <h4 className="font-serif text-base font-bold text-stone-900">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="text-xs text-stone-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Full Superadmin Access
            </span>
          </div>
        </div>

        <div className="pt-4 text-xs text-stone-500 leading-relaxed">
          <p>
            Role permissions and token expiry will be managed by your backend authorization layer once configured.
          </p>
        </div>
      </div>
    </div>
  );
}
