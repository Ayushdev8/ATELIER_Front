'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this dummy customer list with your CRM or user management endpoint: GET /api/admin/customers

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatCurrency } from '@/utils/formatCurrency';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Mail, Phone, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminCustomersPage() {
  const { customers } = useStore();
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    });
  }, [customers, search]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
          Client Registry
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
          Customer Management ({customers.length})
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
          View customer engagement, order counts, and lifetime shopping volume.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-stone-200/80 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Member Since</th>
                <th className="py-4 px-4">Orders Placed</th>
                <th className="py-4 px-4">Lifetime Spend</th>
                <th className="py-4 px-6 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{cust.name}</p>
                        <span className="text-[10px] text-stone-400 font-mono">{cust.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">{cust.email}</td>

                  <td className="py-3.5 px-4 text-stone-500">{cust.joinedDate}</td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900">{cust.ordersCount}</span> orders
                  </td>

                  <td className="py-3.5 px-4 font-bold text-stone-950 font-sans">
                    {formatCurrency(cust.totalSpent)}
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <StatusBadge status={cust.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
