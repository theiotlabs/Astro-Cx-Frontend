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
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  Calendar,
  ExternalLink
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
    amount: number;
    status: string;
    date: string;
  }>;
  recent_reports?: Array<{
    id: string;
    name: string;
    phone: string;
    created_at: string;
    status: string;
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

        try {
          const notifs = await reportService.listNotifications();
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

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED' || s === 'PAID' || s === 'CONFIRMED' || s === 'SUCCESS' || s === 'READY') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-success/10 border border-success/25 text-success rounded-full">
          <CheckCircle2 className="h-3 w-3" />
          {s}
        </span>
      );
    }
    if (s === 'PENDING' || s === 'PROCESSING' || s === 'DRAFT') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 rounded-full">
          <Clock className="h-3 w-3 animate-spin-slow" />
          {s}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-500/10 border border-slate-500/25 text-slate-600 dark:text-slate-400 rounded-full">
        <AlertCircle className="h-3 w-3" />
        {s}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome & Cosmic Identity Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Enterprise 360° Portal Sync Active</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold tracking-wider">
              <span>CX ID: {user?.cx_id || 'CX-CLIENT-8421'}</span>
            </div>
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-secondary">{user?.name || 'Astro Seeker'}</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
            Manage your mobile numerology reports, explore personalized planetary vibration matrices, and track your synced CRM activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-primary to-primary-hover text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>New Report</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
          >
            <UserCheck className="h-4 w-4" />
            <span>Profile settings</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Enterprise Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Reports Card */}
        <Link href="/dashboard/reports" className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-xs hover:shadow-md hover:border-primary/40 transition-all group">
          <div className="space-y-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Numerology Reports</span>
            <h3 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {data?.total_reports || 0}
            </h3>
            <p className="text-xs text-slate-500">Lo Shu grids &amp; remedies</p>
          </div>
          <div className="p-3.5 bg-primary/10 dark:bg-primary/20 rounded-2xl text-primary group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6" />
          </div>
        </Link>

        {/* My Orders Card */}
        <Link href="/dashboard/orders" className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-xs hover:shadow-md hover:border-secondary/40 transition-all group">
          <div className="space-y-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total Orders</span>
            <h3 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white group-hover:text-secondary transition-colors">
              {data?.total_orders || 0}
            </h3>
            <p className="text-xs text-slate-500">Synced order history</p>
          </div>
          <div className="p-3.5 bg-secondary/10 dark:bg-secondary/20 rounded-2xl text-secondary group-hover:scale-110 transition-transform">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </Link>

        {/* Paid Invoices Card */}
        <Link href="/dashboard/invoices" className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-xs hover:shadow-md hover:border-success/40 transition-all group">
          <div className="space-y-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Paid Invoices</span>
            <h3 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white group-hover:text-success transition-colors">
              {data?.total_invoices || 0}
            </h3>
            <p className="text-xs text-slate-500">GST billing records</p>
          </div>
          <div className="p-3.5 bg-success/10 dark:bg-success/20 rounded-2xl text-success group-hover:scale-110 transition-transform">
            <Receipt className="h-6 w-6" />
          </div>
        </Link>

        {/* CRM Security & Sync Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Portal Security</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Active</h3>
            </div>
            <p className="text-xs text-slate-500">Multi-Factor Login Ready</p>
          </div>
          <div className="p-3.5 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl text-indigo-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Quick Feature Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 bg-linear-to-tr from-primary via-indigo-600 to-primary-hover text-white rounded-2xl flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
          <div className="space-y-2">
            <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
            <h3 className="font-heading font-bold text-xl">Analyze Secondary Number</h3>
            <p className="text-xs opacity-90 leading-relaxed">
              Unlock Chaldean &amp; Pythagorean vibration vectors for another mobile number instantly.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
            <span>Generate Report</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-all">
          <div className="space-y-2">
            <Compass className="h-8 w-8 text-secondary animate-spin-slow" />
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Lo Shu Numerology Vault</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Access your detailed planetary alignment tables, remedies, and lucky name numbers.
            </p>
          </div>
          <Link href="/dashboard/reports" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-light hover:underline">
            <span>Open Vault</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-all">
          <div className="space-y-2">
            <UserCheck className="h-8 w-8 text-success" />
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Customer Profile 360°</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Keep your birth coordinates and personal preferences synchronized with your CRM identity.
            </p>
          </div>
          <Link href="/dashboard/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-light hover:underline">
            <span>Manage Identity</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>

      {/* Main Grid: Recent Reports & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Numerology Reports */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    Recent Numerology Reports
                  </h3>
                  <p className="text-xs text-slate-500">Your latest mobile number analyses</p>
                </div>
              </div>
              <Link href="/dashboard/reports" className="text-xs font-semibold text-primary dark:text-primary-light hover:underline flex items-center gap-1">
                <span>View all</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
              {data?.recent_reports && data.recent_reports.length > 0 ? (
                data.recent_reports.map((report) => (
                  <div key={report.id} className="py-4 flex items-center justify-between gap-4 first:pt-4 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 shrink-0">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {report.phone || 'Number Analysis'}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{report.name}</span>
                          <span>&bull;</span>
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(report.status)}
                      <Link
                        href={`/dashboard/reports/${report.id}`}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary hover:text-white text-primary dark:text-primary-light text-xs font-semibold transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3">
                  <Smartphone className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No reports generated yet</p>
                  <Link href="/" className="inline-block text-xs font-semibold text-primary hover:underline">
                    Create your first mobile numerology report →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-xl text-secondary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    Recent Orders
                  </h3>
                  <p className="text-xs text-slate-500">Purchase transactions and payment status</p>
                </div>
              </div>
              <Link href="/dashboard/orders" className="text-xs font-semibold text-primary dark:text-primary-light hover:underline flex items-center gap-1">
                <span>View all</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
              {data?.recent_orders && data.recent_orders.length > 0 ? (
                data.recent_orders.map((order) => (
                  <div key={order.id} className="py-4 flex items-center justify-between gap-4 first:pt-4 last:pb-0">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {order.service_title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          ₹{typeof order.amount === 'number' ? order.amount.toFixed(2) : order.amount}
                        </span>
                        <span>&bull;</span>
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3">
                  <ShoppingBag className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No orders placed yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Notifications & System Updates Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl text-indigo-500">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Recent Notifications &amp; System Alerts
              </h3>
              <p className="text-xs text-slate-500">Log of emails, SMS, and WhatsApp alerts sent to your account</p>
            </div>
          </div>
          <Link href="/dashboard/notifications" className="text-xs font-semibold text-primary dark:text-primary-light hover:underline flex items-center gap-1">
            <span>View all</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary mt-0.5 shrink-0">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{log.subject}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-success/10 border border-success/20 text-success rounded-md uppercase shrink-0">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Channel: <span className="font-medium text-slate-700 dark:text-slate-300 uppercase">{log.channel}</span> &bull; {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500 text-sm">
              No recent notifications logged.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
