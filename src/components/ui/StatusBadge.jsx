import React from 'react';

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case 'delivered':
      case 'paid':
      case 'active':
      case 'in stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
      case 'low stock':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
      case 'failed':
      case 'inactive':
      case 'out of stock':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
}
