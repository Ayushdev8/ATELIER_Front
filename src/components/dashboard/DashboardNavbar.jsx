'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, Bell, Search, ExternalLink, Shield } from 'lucide-react';

export default function DashboardNavbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-soft-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          aria-label="Toggle admin sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-700 hidden sm:inline" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Store Administration Portal
          </span>
          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full ml-1">
            Demo Environment
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-400 transition-colors"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        {/* User preview */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover border border-stone-200"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-stone-900 leading-none">
              {user?.firstName || 'Julian'} {user?.lastName || 'Sterling'}
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Store Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
