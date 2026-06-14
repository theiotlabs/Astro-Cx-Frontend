'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Mail, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../../services/auth';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please fill in your email.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl relative">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Compass className="h-10 w-10 text-primary dark:text-primary-light animate-spin-slow" />
            </div>
            <h2 className="font-heading font-bold text-3xl tracking-tight">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your email to receive a password reset link
            </p>
          </div>
          
          {error && (
            <div className="p-4 bg-danger/10 border border-danger/25 text-danger text-sm rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-success/10 border border-success/25 text-success text-sm rounded-lg">
              Password reset link sent to your email! Please check your inbox.
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full flex justify-center items-center py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all shadow-md focus:outline-none disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <>
                    <span>Request Reset Link</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <Link href="/auth/login" className="text-sm font-semibold text-primary dark:text-primary-light hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
