'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, User, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-primary font-heading font-bold text-xl">
              <Compass className="h-6 w-6 animate-spin-slow" />
              <span>AstroMobile</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors hover:text-primary dark:hover:text-primary-light ${
                  pathname === link.href ? 'text-primary dark:text-primary-light' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Auth Actions */}
            {!mounted || !isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-slate-700 dark:text-slate-200 font-medium hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/#purchase-section"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg shadow-md transition-all animate-pulse-subtle"
                >
                  Get Report
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {user?.cx_id || 'CX-CLIENT-8421'}
                </span>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary-light"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 font-medium text-danger hover:underline cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200 dark:border-slate-800 py-4 px-2 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-medium ${
                pathname === link.href
                  ? 'bg-slate-200 dark:bg-slate-800 text-primary dark:text-primary-light'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2 px-3 space-y-2">
            {!mounted || !isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md font-medium text-slate-700 dark:text-slate-300"
                >
                  Login
                </Link>
                <Link
                  href="/#purchase-section"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full px-3 py-2 bg-primary text-white rounded-md font-medium shadow-md"
                >
                  Get Report
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard ({user?.name})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-danger hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
