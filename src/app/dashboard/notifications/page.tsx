'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Calendar, RefreshCw, Layers } from 'lucide-react';
import { reportService } from '../../../services/reports';

interface NotificationItem {
  id: number;
  recipient: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'SYSTEM';
  subject: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED' | 'BOUNCED';
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const data = await reportService.listNotifications();
      const list = Array.isArray(data) 
        ? data 
        : (data && Array.isArray(data.results) ? data.results : []);
      setNotifications(list);
    } catch (err: any) {
      console.error('Failed to load notifications:', err);
      setError('Could not retrieve activity logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getChannelIcon = (channel: NotificationItem['channel']) => {
    switch (channel) {
      case 'EMAIL':
        return <Mail className="h-5 w-5 text-primary" />;
      case 'WHATSAPP':
        return <MessageSquare className="h-5 w-5 text-success" />;
      case 'SMS':
        return <Smartphone className="h-5 w-5 text-secondary" />;
      case 'SYSTEM':
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusBadge = (status: NotificationItem['status']) => {
    switch (status) {
      case 'DELIVERED':
      case 'SENT':
        return (
          <span className="text-[10px] px-2 py-0.5 bg-success/10 border border-success/20 text-success rounded-md font-semibold uppercase tracking-wider">
            {status}
          </span>
        );
      case 'PENDING':
        return (
          <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-md font-semibold uppercase tracking-wider">
            {status}
          </span>
        );
      case 'FAILED':
      case 'BOUNCED':
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 bg-danger/10 border border-danger/25 text-danger rounded-md font-semibold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="space-y-4">
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
            Activity & Notifications Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chronological audit log of emails, SMS alerts, and WhatsApp notifications dispatched for your orders.
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchNotifications();
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

      {/* Notifications list */}
      {notifications.length > 0 ? (
        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((item) => (
            <div 
              key={item.id}
              className="p-5 flex items-start space-x-4 hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors"
            >
              {/* Channel Icon */}
              <div className="p-2.5 bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-slate-850 rounded-xl shrink-0 mt-0.5">
                {getChannelIcon(item.channel)}
              </div>

              {/* Contents */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.subject}
                  </h3>
                  <div className="flex items-center space-x-3 shrink-0">
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate">
                  Sent to: <span className="font-mono font-medium">{item.recipient}</span>
                </p>

                <div className="flex items-center text-[10px] text-slate-400 space-x-1 pt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(item.created_at).toLocaleString()}</span>
                  <span>&bull;</span>
                  <span>Channel: {item.channel}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto space-y-6 shadow-sm flex flex-col items-center">
          <Bell className="h-12 w-12 text-slate-400 animate-pulse-subtle" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl">No notifications logged</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              There are no messages logged for your account at this moment.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
