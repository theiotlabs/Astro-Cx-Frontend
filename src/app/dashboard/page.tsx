'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ShoppingBag, 
  Receipt, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  UserCheck, 
  Bell,
  Loader2
} from 'lucide-react';
import { authService } from '../../services/auth';
import { reportService } from '../../services/reports';
import useAuthStore from '../../store/useAuthStore';

interface DashboardData {
  total_orders: number;
  total_invoices: number;
  total_reports: number;
  recent_orders: Array<{
    id: string;
    service_title: string;
    date: string;
  }>;
}

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const stats = await authService.getDashboardStats();
        setData(stats);

        // Fetch notifications
        try {
          const notifs = await reportService.listNotifications();
          // Take the 5 most recent notifications
          setNotifications(Array.isArray(notifs) ? notifs.slice(0, 5) : []);
        } catch (nErr) {
          console.error('Failed to load notifications:', nErr);
        }
      } catch (err: any) {
        console.error('Failed to load dashboard metrics:', err);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div>
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
          Welcome back, {user?.name || 'Astro Seeker'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Explore your cosmic mobile numerology report and manage your profile details.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Reports */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Reports</span>
            <h3 className="text-3xl font-extrabold font-heading">{data?.total_reports || 0}</h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">My Orders</span>
            <h3 className="text-3xl font-extrabold font-heading">{data?.total_orders || 0}</h3>
          </div>
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        {/* Paid Invoices */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Paid Invoices</span>
            <h3 className="text-3xl font-extrabold font-heading">{data?.total_invoices || 0}</h3>
          </div>
          <div className="p-3 bg-success/10 rounded-xl text-success">
            <Receipt className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-linear-to-tr from-primary to-primary-hover text-white rounded-2xl flex flex-col justify-between space-y-6 shadow-lg transform hover:-translate-y-0.5 transition-all">
          <div className="space-y-2">
            <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
            <h3 className="font-heading font-bold text-xl">Analyze Another Number</h3>
            <p className="text-xs opacity-90">Unlock prediction vectors for a secondary phone number.</p>
          </div>
          <Link href="/" className="flex items-center text-sm font-semibold hover:underline space-x-1">
            <span>Get Report</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-6 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-2">
            <UserCheck className="h-8 w-8 text-secondary" />
            <h3 className="font-heading font-bold text-xl">Complete Your Profile</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fill in your date of birth, gender, and location details.</p>
          </div>
          <Link href="/dashboard/profile" className="flex items-center text-sm font-semibold text-primary dark:text-primary-light hover:underline space-x-1">
            <span>Manage Profile</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-6 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-2">
            <Compass className="h-8 w-8 text-success animate-spin-slow" />
            <h3 className="font-heading font-bold text-xl">View Numerology Reports</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Inspect the Lo Shu grid interpretations and remedy files.</p>
          </div>
          <Link href="/dashboard/reports" className="flex items-center text-sm font-semibold text-primary dark:text-primary-light hover:underline space-x-1">
            <span>Access Reports</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-secondary" />
              <span>Recent Orders</span>
            </h3>
            <Link href="/dashboard/orders" className="text-xs text-primary dark:text-primary-light hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data?.recent_orders && data.recent_orders.length > 0 ? (
              data.recent_orders.map((order) => (
                <div key={order.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{order.service_title}</p>
                    <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-success/10 border border-success/20 text-success rounded-full font-medium">
                    PAID
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No orders created yet.</p>
            )}
          </div>
        </div>

        {/* Notifications & System Updates */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Recent Alerts</span>
            </h3>
            <Link href="/dashboard/notifications" className="text-xs text-primary dark:text-primary-light hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((log) => (
                <div key={log.id} className="flex space-x-3 text-sm items-start">
                  <div className="p-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500 mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{log.subject}</p>
                    <p className="text-xs text-slate-500">
                      Channel: {log.channel} &bull; {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-success/10 border border-success/20 text-success rounded-md uppercase">
                    {log.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No notifications logs available.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
