'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Calendar, CreditCard, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { reportService } from '../../../services/reports';

interface OrderItem {
  id: string;
  service_title: string;
  amount: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await reportService.listOrders();
      setOrders(Array.isArray(data.results) ? data.results : []);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError('Could not retrieve order logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="text-xs px-2.5 py-1 bg-success/10 border border-success/20 text-success rounded-full font-medium uppercase tracking-wide">
            Completed
          </span>
        );
      case 'PROCESSING':
      case 'CONFIRMED':
        return (
          <span className="text-xs px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-medium uppercase tracking-wide flex items-center space-x-1 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="text-xs px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full font-medium uppercase tracking-wide">
            Pending
          </span>
        );
      case 'CANCELLED':
      default:
        return (
          <span className="text-xs px-2.5 py-1 bg-danger/10 border border-danger/20 text-danger rounded-full font-medium uppercase tracking-wide">
            Cancelled
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="space-y-4">
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Order History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your report requests, consulting schedules, and digital purchases.
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchOrders();
          }}
          className="inline-flex items-center space-x-1.5 py-2 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all self-start"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors"
            >
              {/* Left Side: Icon & Titles */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl mt-0.5">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                    {order.service_title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="font-mono">ID: {order.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Price & Status */}
              <div className="flex items-center justify-between sm:justify-end sm:space-x-8 w-full sm:w-auto shrink-0 border-t border-slate-100 dark:border-slate-800 pt-4 sm:pt-0">
                <div className="space-y-0.5 text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Amount</span>
                  <span className="font-extrabold text-lg text-primary dark:text-primary-light">
                    ₹{parseFloat(order.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(order.status)}
                  <ChevronRight className="h-5 w-5 text-slate-400 hidden sm:block" />
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto space-y-6 shadow-sm flex flex-col items-center">
          <ShoppingBag className="h-12 w-12 text-slate-400 animate-pulse-subtle" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl">No orders found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You haven&apos;t placed any orders yet. Visit our homepage to calculate a premium report!
            </p>
          </div>
          <Link
            href="/#purchase-section"
            className="inline-flex items-center justify-center py-2.5 px-6 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-md transition-all"
          >
            <span>Order a Report</span>
          </Link>
        </div>
      )}

    </div>
  );
}
