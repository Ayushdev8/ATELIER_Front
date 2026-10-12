'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNotification } from '@/hooks/useNotification';
import { categories } from '@/data/categories';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Instagram,
  Twitter,
  Facebook,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notify } = useNotification();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      notify.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Simulated newsletter subscription locally
      notify.success('Thank you! You have been subscribed to the Atelier Gazette.');
      setEmail('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Value propositions banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pb-12 border-b border-stone-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-brand-300 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Complimentary Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">On all global orders exceeding $150</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-brand-300 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Seamless Returns</h4>
              <p className="text-xs text-stone-400 mt-0.5">30-day effortless exchange guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-brand-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Artisanal Authenticity</h4>
              <p className="text-xs text-stone-400 mt-0.5">Verified origins and sustainable fibers</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-brand-300 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Concierge Support</h4>
              <p className="text-xs text-stone-400 mt-0.5">7-day styling &amp; client assistance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl tracking-[0.2em] font-extrabold text-white uppercase">
                ATELIER
              </span>
              <span className="text-[10px] block uppercase tracking-[0.35em] text-brand-400 font-sans font-semibold">
                &amp; CO. EST 2026
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm mb-6">
              Curating tactile luxury, understated apparel, and mindful lifestyle objects made with exceptional craftsmanship and natural textures.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#social"
                className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Collection</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-brand-300 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products?sale=true" className="text-brand-300 hover:text-brand-200 font-medium transition-colors">
                  Seasonal Archives (Sale)
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Client Care</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/account" className="hover:text-brand-300 transition-colors">
                  Order Status &amp; Tracking
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-300 transition-colors">
                  Bag &amp; Checkout Review
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-brand-300 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-300 transition-colors">
                  Admin Demo Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">The Gazette</h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Receive private capsule invitations and exclusive seasonal offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-700 hover:bg-brand-600 text-white rounded-xl py-2.5 px-4 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Joining...' : 'Subscribe'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© 2026 ATELIER &amp; CO. All rights reserved. Built as a high-fidelity frontend application.</p>
          <div className="flex items-center gap-6">
            <span>Demo Mode — Frontend Only</span>
            <span>Zero Backend Dependency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
