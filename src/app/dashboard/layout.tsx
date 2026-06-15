'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  ShoppingBag, 
  Receipt, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Loader2
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If client-side detects not authenticated, redirect to login
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [mounted, isAuthenticated, pathname, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <LoaderSpinner />
      </div>
    );
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center space-x-2 text-primary dark:text-primary-light font-heading font-bold text-lg">
            <Compass className="h-6 w-6 text-primary" />
            <span>AstroMobile</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name ? getInitials(user.name) : 'AM'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.name || 'Astro User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 w-full glass border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 text-primary dark:text-primary-light font-heading font-bold text-lg">
          <Compass className="h-6 w-6" />
          <span>AstroMobile</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-50 dark:bg-color-dark-bg border-r border-slate-200 dark:border-slate-800 h-full p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-primary dark:text-primary-light">Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Securing session...</p>
    </div>
  );
}
