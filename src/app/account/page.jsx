'use client';

// FUTURE BACKEND INTEGRATION:
// Replace these local profile operations and order lookups with your user profile API: GET /api/user/profile

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import {
  User,
  Package,
  MapPin,
  LogOut,
  Edit3,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, addAddress, logout } = useAuth();
  const { orders } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses'

  // Edit profile state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  // Add Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: 'Work Studio',
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: user?.phone || '',
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          icon={User}
          title="Please Sign In"
          description="You must be logged in to view your account details and demo order history."
          actionText="Go to Sign In"
          actionHref="/login"
        />
      </div>
    );
  }

  // Filter orders related to this user (or all demo orders for preview)
  const userOrders = orders;

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    addAddress(newAddress);
    setIsAddressModalOpen(false);
    setNewAddress({
      title: 'Work Studio',
      fullName: `${user.firstName} ${user.lastName}`,
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: user.phone || '',
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft-sm mb-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'}
            alt={user.firstName}
            className="w-20 h-20 rounded-full object-cover border-2 border-stone-100 shadow-sm"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950">
                {user.firstName} {user.lastName}
              </h1>
              {user.isAdmin && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded-full">
                  Admin Demo
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">@{user.username} • {user.email}</p>
            <p className="text-xs text-stone-400 mt-1">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.isAdmin && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Admin Dashboard
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-rose-600 hover:bg-rose-50">
            <LogOut className="w-4 h-4 mr-1.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Addresses ({user.addresses?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No Orders Found"
              description="You have not placed any demo orders yet. Add items from the catalog to see them recorded here."
              actionText="Shop Now"
              actionHref="/products"
            />
          ) : (
            userOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft-sm"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-stone-900">{ord.id}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {ord.date}
                    </span>
                    <span className="text-stone-300">•</span>
                    <StatusBadge status={ord.status} />
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-stone-400 block">Total Amount</span>
                    <span className="text-base font-extrabold text-stone-950 font-sans">
                      {formatCurrency(ord.total)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="py-4 space-y-4">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900">{item.name}</p>
                          <p className="text-[11px] text-stone-500">
                            Qty: {item.quantity} {item.size && `• Size: ${item.size}`}{' '}
                            {item.color && `• Color: ${item.color}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-900 font-sans">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment details */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-stone-500 gap-2">
                  <p>
                    <strong>Address:</strong> {ord.customer.address}
                  </p>
                  <p>
                    <strong>Payment:</strong> {ord.paymentMethod} ({ord.paymentStatus})
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft-sm">
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">
            Personal Information
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                required
              />
            </div>

            <Input
              label="Email Address"
              value={user.email}
              readOnly
              helperText="Email changes require identity verification in production."
            />

            <Input
              label="Contact Phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />

            <div className="pt-4">
              <Button type="submit" variant="primary" size="md">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-stone-900">Delivery Addresses</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddressModalOpen(true)}
              className="text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add New Address</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.addresses?.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-soft-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900 font-serif">
                      {addr.title}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-stone-800">{addr.fullName}</p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {addr.street} <br />
                    {addr.city}, {addr.state} {addr.zip} <br />
                    {addr.country}
                  </p>
                  <p className="text-xs text-stone-400 mt-2">{addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add New Delivery Address"
        description="Enter the shipping destination for upcoming orders."
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <Input
            label="Address Title (e.g. Home, Studio)"
            value={newAddress.title}
            onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
            required
          />
          <Input
            label="Recipient Full Name"
            value={newAddress.fullName}
            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
            required
          />
          <Input
            label="Street Address"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              required
            />
            <Input
              label="State / Province"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              required
            />
          </div>
          <Input
            label="ZIP / Postal Code"
            value={newAddress.zip}
            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
            required
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsAddressModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
