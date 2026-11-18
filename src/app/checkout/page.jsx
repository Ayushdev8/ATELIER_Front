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
import api from '@/service/api';
import AddressSection from '@/components/checkout/AddressSection';


export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addOrder } = useStore();
  const { notify } = useNotification();
  const {
    cartItems,
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
  const [addressId, setAddressId] = useState(null);

  

  if (cartItems.length === 0) {
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

        if (!addressId) {
            notify("Please select a delivery address", "error");
          return;
        }

        try {
            setIsSubmitting(true);

            // STEP 1: Create local order in Spring Boot
            const res = await api.post("/order/create", {
                "addressId": addressId,
             });

            console.log(res.data);

            const order = res.data;

            console.log("Created order:", order);

            // STEP 2: Initiate Cashfree payment
            const paymentResponse = await api.post(
                `/payment/cashfree/checkout/${order.orderId}`
            );
            console.log("Cashfree session response:", paymentResponse.data);

            const paymentSessionId =
                paymentResponse.data.paymentSessionId;


            if (typeof window.Cashfree !== "function") {
            throw new Error("Cashfree SDK is not loaded");
            }

            // STEP 3: Open Cashfree checkout
            const cashfree = window.Cashfree({
                mode: "sandbox",
            });

            await cashfree.checkout({
                paymentSessionId,
                redirectTarget: "_self",
            });

        } catch (error) {

            console.error( "Checkout error:",error.response?.data || error.message);

           notify(error.response?.data?.message );
         } finally {
            setIsSubmitting(false);
        }
    };

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
          Secure Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
          Finalize Your Order
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Complete the checkout form below. No payment card details are stored or charged.
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

          {/* 2. Delivery Address */}
        <div className="lg:col-span-7">
            <AddressSection
            onAddressSelect={setAddressId}
          />
        </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">
                3
              </span>
              <span> Payment Simulation</span>
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
              {cartItems.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 pt-2 first:pt-0">
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900 line-clamp-1">{item.productName}</p>
                      <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900 font-sans">
                    {formatCurrency(discountedSubtotal)}
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
                disabled={isSubmitting}
                className="w-full shadow-lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isSubmitting
                    ? "Processing..."
                    : `Place Order • ${formatCurrency(finalTotal)}`}
                
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
