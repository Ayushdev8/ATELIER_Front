'use client';

// FUTURE BACKEND INTEGRATION:
// Replace these local order updates with your order processing APIs:
// GET /api/admin/orders, PATCH /api/admin/orders/:id/status

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatCurrency } from '@/utils/formatCurrency';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import {
  Search,
  Eye,
  ShoppingBag,
  Calendar,
  CheckCircle,
  Truck,
  Package,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search.trim() ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || o.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
            Fulfillment Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
            Order Management ({orders.length})
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Review client purchases, modify demo delivery stages, and inspect invoices.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order ID or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            <option value="">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-stone-200/80 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-4">Client</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Items</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Order Status</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-stone-900">{ord.id}</td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-stone-900">{ord.customer.name}</p>
                    <span className="text-[10px] text-stone-400">{ord.customer.email}</span>
                  </td>

                  <td className="py-3.5 px-4 text-stone-500">{ord.date}</td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-800">{ord.items.length} items</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={ord.paymentStatus} />
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-brand-700 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-stone-950 font-sans">
                    {formatCurrency(ord.total)}
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                      aria-label="View order details"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details: ${selectedOrder.id}` : 'Order Details'}
        description="Complete breakdown of client order and items."
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Meta summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Placed On</span>
                <span className="font-bold text-stone-900">{selectedOrder.date}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment</span>
                <span className="font-bold text-stone-900">{selectedOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Status</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Order Total</span>
                <span className="font-extrabold text-stone-950 font-sans text-sm">
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-xs space-y-1">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                Shipping Destination
              </h4>
              <p className="font-semibold text-stone-900">{selectedOrder.customer.name}</p>
              <p className="text-stone-600">{selectedOrder.customer.address}</p>
              <p className="text-stone-500">{selectedOrder.customer.email} • {selectedOrder.customer.phone}</p>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[10px] mb-3">
                Purchased Pieces ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                      />
                      <div>
                        <p className="text-xs font-bold text-stone-900">{item.name}</p>
                        <p className="text-[10px] text-stone-400">
                          Qty: {item.quantity} {item.size && `• ${item.size}`}{' '}
                          {item.color && `• ${item.color}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-900 font-sans">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update status quick bar */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Set Fulfillment Stage:</span>
              <div className="flex gap-2">
                {['Processing', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedOrder.status === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
