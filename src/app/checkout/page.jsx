'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this local demo order creation with your order API call: POST /api/orders

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { useNotification } from '@/hooks/useNotification';
import { formatCurrency } from '@/utils/formatCurrency';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Info,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useStore();
  const { notify } = useNotification();
  const {
    items,
    totalItems,
    originalSubtotal,
    discountedSubtotal,
    discountSavings,
    shippingFee,
    finalTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Julian',
    lastName: user?.lastName || 'Sterling',
    email: user?.email || 'julian.sterling@example.com',
    phone: user?.phone || '+1 (555) 321-9876',
    street: user?.addresses?.[0]?.street || '450 Lexington Ave, Apt 14B',
    city: user?.addresses?.[0]?.city || 'New York',
    state: user?.addresses?.[0]?.state || 'NY',
    zip: user?.addresses?.[0]?.zip || '10017',
    country: 'United States',
    paymentMethod: 'credit-card',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="No Items in Checkout"
          description="Your bag is currently empty. Add products to proceed with checkout."
          actionText="Browse Catalog"
          actionHref="/products"
        />
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.street.trim()) errs.street = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.zip.trim()) errs.zip = 'Postal ZIP code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notify.error('Please resolve the highlighted validation errors.');
      return;
    }

    setIsSubmitting(true);
    notify.loading('Simulating order authorization and fulfillment...', { duration: 1500 });

    // FUTURE BACKEND INTEGRATION:
    // Replace this local demo order creation with your real order endpoint:
    // const response = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(...) });
    setTimeout(() => {
      const demoOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder = {
        id: demoOrderId,
        date: new Date().toISOString().split('T')[0],
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`,
        },
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.effectivePrice,
          originalPrice: i.originalPrice,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          image: i.image,
        })),
        subtotal: discountedSubtotal,
        discountTotal: discountSavings,
        shipping: shippingFee,
        total: finalTotal,
        paymentMethod:
          formData.paymentMethod === 'apple-pay'
            ? 'Apple Pay (Demo)'
            : formData.paymentMethod === 'paypal'
            ? 'PayPal (Demo)'
            : 'Credit Card (Demo)',
        paymentStatus: 'Paid',
        status: 'Processing',
      };

      // Add to shared store state (and localStorage)
      addOrder(newOrder);

      // Clear the cart only after simulated order succeeds
      clearCart();

      setIsSubmitting(false);
      setCompletedOrder(newOrder);
      notify.success(`Demo Order #${demoOrderId} placed successfully!`);
    }, 1200);
  };

  // SUCCESS PANEL / CONFIRMATION VIEW
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-soft-lg text-center animate-slide-down">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Demo Order Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-4 mb-2">
            Thank you for your demo order!
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
            Order Reference: <strong className="text-stone-900 font-mono">{completedOrder.id}</strong>. A confirmation summary has been registered in your demo profile.
          </p>

          <Alert type="info" className="text-left mb-8">
            <p className="font-semibold mb-1">Frontend Demo Notice:</p>
            This was a simulated checkout. No real payment was charged, and no real delivery is dispatched. Your demo order is now visible in both the <strong>Customer Account</strong> and <strong>Admin Dashboard</strong>.
          </Alert>

          {/* Order Details Brief */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 text-left border border-stone-200/60 mb-8 space-y-3 text-xs">
            <div className="flex justify-between pb-3 border-b border-stone-200/60">
              <span className="text-stone-500">Recipient:</span>
              <span className="font-bold text-stone-900">{completedOrder.customer.name}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-stone-200/60">
              <span className="text-stone-500">Shipping Address:</span>
              <span className="font-medium text-stone-900 text-right max-w-xs">{completedOrder.customer.address}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-stone-200/60">
              <span className="text-stone-500">Payment:</span>
              <span className="font-medium text-stone-900">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span className="text-stone-900 font-serif">Total Paid:</span>
              <span className="text-stone-950 font-sans">{formatCurrency(completedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/account" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full">
                <span>View Order in Account</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                <span>Continue Shopping</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
          Secure Demo Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
          Finalize Your Order
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Complete the simulated checkout form below. No payment card details are stored or charged.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">
                1
              </span>
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                helperText="Order confirmation will be sent here."
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                required
              />
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">
                2
              </span>
              <span>Delivery Address</span>
            </h3>

            <div className="space-y-4">
              <Input
                label="Street Address"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                error={errors.street}
                placeholder="450 Lexington Ave, Apt 14B"
                required
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={errors.city}
                  required
                />
                <Input
                  label="State / Province"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={errors.state}
                  required
                />
                <div className="col-span-2 sm:col-span-1">
                  <Input
                    label="ZIP / Postal Code"
                    value={formData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    error={errors.zip}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="block w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Demo Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">
                3
              </span>
              <span>Demo Payment Simulation</span>
            </h3>

            <p className="text-xs text-stone-500 mb-6">
              Select any demo payment option. No external processor is invoked.
            </p>

            <div className="space-y-3 mb-6">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'credit-card'
                    ? 'border-brand-700 bg-brand-50/50 ring-1 ring-brand-700'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={() => handleInputChange('paymentMethod', 'credit-card')}
                    className="accent-brand-700"
                  />
                  <CreditCard className="w-4 h-4 text-stone-700" />
                  <span className="text-xs font-semibold text-stone-900">Demo Credit Card</span>
                </div>
                <span className="text-[11px] text-stone-400">Visa / Mastercard / Amex</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'apple-pay'
                    ? 'border-brand-700 bg-brand-50/50 ring-1 ring-brand-700'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple-pay"
                    checked={formData.paymentMethod === 'apple-pay'}
                    onChange={() => handleInputChange('paymentMethod', 'apple-pay')}
                    className="accent-brand-700"
                  />
                  <span className="text-xs font-semibold text-stone-900">Apple Pay (Demo)</span>
                </div>
                <span className="text-[11px] text-stone-400">Biometric simulated</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'paypal'
                    ? 'border-brand-700 bg-brand-50/50 ring-1 ring-brand-700'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={() => handleInputChange('paymentMethod', 'paypal')}
                    className="accent-brand-700"
                  />
                  <span className="text-xs font-semibold text-stone-900">PayPal (Demo)</span>
                </div>
                <span className="text-[11px] text-stone-400">One-click simulated</span>
              </label>
            </div>

            {formData.paymentMethod === 'credit-card' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-100">
                <div className="sm:col-span-2">
                  <Input
                    label="Card Number (Demo)"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    readOnly
                  />
                </div>
                <div>
                  <Input
                    label="Expiry"
                    value={formData.cardExpiry}
                    onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                    readOnly
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Review & Button */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
            <h3 className="font-serif text-lg font-bold text-stone-950 pb-4 border-b border-stone-100">
              Order Review ({totalItems} items)
            </h3>

            {/* List preview of items in checkout */}
            <div className="py-4 space-y-3 max-h-60 overflow-y-auto divide-y divide-stone-100">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between gap-3 pt-2 first:pt-0">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900 font-sans">
                    {formatCurrency(item.effectivePrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial lines */}
            <div className="py-4 border-t border-b border-stone-100 space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Original Subtotal</span>
                <span>{formatCurrency(originalSubtotal)}</span>
              </div>
              {discountSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promotional Savings</span>
                  <span>-{formatCurrency(discountSavings)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Delivery</span>
                <span>{shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-bold text-stone-900">
                <span className="font-serif">Final Order Total</span>
                <span className="font-sans text-base">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full shadow-lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                <span>Place Demo Order • {formatCurrency(finalTotal)}</span>
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 mt-4 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Frontend demonstration — zero real charges occur</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
