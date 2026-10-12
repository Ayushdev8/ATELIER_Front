'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ArrowLeft,
  Store,
} from 'lucide-react';

export default function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/dashboard/customers', icon: Users },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-stone-900 text-stone-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-stone-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center px-6 border-b border-stone-800">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-white uppercase">
                ATELIER
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-900 text-brand-300 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {links.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
          >
            <Store className="w-4 h-4 text-stone-500" />
            <span>Return to Storefront</span>
          </Link>
          <div className="px-3.5 py-2 text-[10px] text-stone-500">
            <span>Demo Mode — Local State</span>
          </div>
        </div>
      </aside>
    </>
  );
}
