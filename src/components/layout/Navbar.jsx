'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { categories } from '@/data/categories';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Offers", href: "/products?sale=true" },
  ];

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href.split("?")[0];
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft-sm"
          : "bg-[#FAF8F5]"
      } border-b border-stone-200/70`}
    >
      {/* ROW 1: Brand, search, account, wishlist, cart, auth */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="min-h-[68px] sm:min-h-[78px] flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile drawer button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden shrink-0 p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand */}
          <Link href="/" className="group flex flex-col shrink-0">
            <span className="font-serif text-lg sm:text-2xl tracking-[0.14em] sm:tracking-[0.2em] font-extrabold text-stone-950 uppercase group-hover:text-brand-700 transition-colors">
              ATELIER
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-stone-500 font-sans -mt-1 font-semibold">
              &amp; CO. EST 2012
            </span>
          </Link>

          {/* Desktop search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative items-center flex-1 max-w-xl mx-4 lg:mx-8"
          >
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/90 border border-stone-200 rounded-full text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Top row actions */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setIsSearchOpen((open) => !open)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle search"
              aria-expanded={isSearchOpen}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / profile */}
            <div className="relative">
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full hover:bg-stone-100 transition-colors border border-stone-200"
                    aria-label="User account menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <img
                      src={
                        user.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                      }
                      alt={user.firstName || "User"}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="hidden xl:inline text-xs font-semibold text-stone-800 pr-1">
                      {user.firstName}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-stone-200 p-2 z-50 animate-slide-down">
                      <div className="px-3 py-2 border-b border-stone-100 mb-1">
                        <p className="text-xs font-bold text-stone-900 font-serif">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-950 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        My Account &amp; Orders
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-950 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-stone-400" />
                        Admin Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href="/login"
                    className="text-[11px] sm:text-xs font-medium text-stone-700 hover:text-brand-700 px-2 sm:px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex text-xs font-semibold bg-stone-900 text-white px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-bold text-white bg-brand-700 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label={`Shopping cart${totalItems > 0 ? ` (${totalItems})` : ""}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-bold text-white bg-stone-950 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search row, shown on demand */}
        {isSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="pb-3 md:hidden animate-slide-down">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </form>
        )}
      </div>

      {/* ROW 2: Main navigation links, categories, admin shortcut */}
      <div className="border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="hidden lg:flex min-h-[46px] items-center justify-center gap-7">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-3 ${
                    active ? "text-brand-700 font-semibold" : "text-stone-700 hover:text-brand-700"
                  }`}
                >
                  {link.label}
                  {active && <span className="absolute bottom-1 left-0 w-full h-0.5 bg-brand-700 rounded-full" />}
                </Link>
              );
            })}

            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button
                onClick={() => setIsCategoryDropdownOpen((open) => !open)}
                className="flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-brand-700 py-3 transition-colors"
                aria-expanded={isCategoryDropdownOpen}
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-1 z-50">
                  <div className="bg-white rounded-2xl shadow-soft-lg border border-stone-200/80 p-2 animate-slide-down">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-brand-800 hover:bg-stone-50 transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-stone-400 font-normal">{cat.itemCount} items</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900 px-2.5 py-1 rounded-md border border-dashed border-stone-300 hover:border-stone-500 transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </Link>
          </nav>

          {/* Tablet and mobile: compact horizontal second-row navigation */}
          <nav className="lg:hidden flex items-center gap-5 min-h-[42px] overflow-x-auto whitespace-nowrap scrollbar-hide">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`shrink-0 text-xs sm:text-sm font-medium py-3 transition-colors ${
                    active ? "text-brand-700 font-semibold" : "text-stone-700 hover:text-brand-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              className="shrink-0 text-xs font-semibold text-stone-500 hover:text-stone-900 py-3"
            >
              Admin Demo
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile drawer for categories/admin and account actions */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-down">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                <Link href="/" className="font-serif text-xl font-bold tracking-widest text-stone-950 uppercase">
                  ATELIER &amp; CO.
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50 hover:text-brand-700 rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-bold uppercase tracking-wider text-stone-400">Categories</p>
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 hover:text-brand-700 rounded-xl transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-stone-400">{cat.itemCount}</span>
                  </Link>
                ))}
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-bold uppercase tracking-wider text-stone-400">Administration</p>
                </div>
                <Link
                  href="/dashboard"
                  className="px-3 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50 hover:text-brand-700 rounded-xl transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-stone-500" />
                  Admin Dashboard
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                      alt={user.firstName || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-stone-900 font-serif">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] text-stone-500">View Account &amp; Orders</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="w-full py-2.5 text-center text-xs font-medium border border-stone-300 rounded-xl text-stone-800 hover:bg-stone-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="w-full py-2.5 text-center text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

