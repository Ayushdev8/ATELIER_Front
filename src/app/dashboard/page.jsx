'use client';

// FUTURE BACKEND INTEGRATION:
// Replace these local store metrics and aggregation calculations with your analytics API: GET /api/admin/metrics

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { dashboardOverview } from '@/data/dashboard';
import { formatCurrency } from '@/utils/formatCurrency';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import SalesChart from '@/components/dashboard/SalesChart';
import Button from '@/components/ui/Button';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { products, orders, customers } = useStore();

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 48500);
  const totalOrdersCount = orders.length + 380;
  const totalProductsCount = products.length;
  const totalCustomersCount = customers.length + 1240;

  const recentOrders = orders.slice(0, 5);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
            Control Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
            Store Performance Overview
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Real-time demo indicators, recent orders, and catalog activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/products">
            <Button variant="primary" size="sm">
              <Package className="w-4 h-4 mr-1.5" />
              <span>Manage Products</span>
            </Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              <span>View All Orders</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change="+14.8%"
          isPositive={true}
          timeframe="vs. prior month"
          icon={DollarSign}
        />
        <StatCard
          label="Total Orders"
          value={totalOrdersCount.toLocaleString()}
          change="+8.2%"
          isPositive={true}
          timeframe="vs. prior month"
          icon={ShoppingBag}
        />
        <StatCard
          label="Catalog Products"
          value={totalProductsCount.toString()}
          change={`${products.filter((p) => p.isNew).length} new`}
          isPositive={true}
          timeframe="in current catalog"
          icon={Package}
        />
        <StatCard
          label="Shoppers"
          value={totalCustomersCount.toLocaleString()}
          change="+19.4%"
          isPositive={true}
          timeframe="active customers"
          icon={Users}
        />
      </div>

      {/* Sales Visualization Chart */}
      <SalesChart />

      {/* Two Column Grid: Recent Orders & Best Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-950">Recent Orders</h3>
              <p className="text-xs text-stone-400">Latest incoming transactions</p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-stone-900">{ord.id}</td>
                    <td className="py-3.5 text-stone-700">{ord.customer.name}</td>
                    <td className="py-3.5">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3.5 text-right font-bold text-stone-900 font-sans">
                      {formatCurrency(ord.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-950">Top Performers</h3>
              <p className="text-xs text-stone-400">Best-selling curated goods</p>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              Inventory
            </Link>
          </div>

          <div className="space-y-4">
            {bestSellers.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                      {item.category} • {item.reviewCount} sold
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-950 font-sans">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
        <h3 className="font-serif text-lg font-bold text-stone-950 mb-4">Recent Activity Stream</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardOverview.recentActivities.map((act) => (
            <div key={act.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
              <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1.5">
                <span className="uppercase font-bold tracking-wider text-brand-700">{act.type}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {act.time}
                </span>
              </div>
              <h4 className="text-xs font-bold text-stone-900 mb-1">{act.title}</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">{act.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
