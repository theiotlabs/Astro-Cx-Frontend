'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Loader2, Lock, FileText } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { reportService } from '../../../services/reports';
import useAuthStore from '../../../store/useAuthStore';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { isAuthenticated, user } = useAuthStore();

  const [report, setReport] = useState<any>(null);
  const [pollProgress, setPollProgress] = useState(0);
  const [pollMessage, setPollMessage] = useState('Initializing report calculation...');
  const [pollStatus, setPollStatus] = useState<'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('PENDING');
  const [invoice, setInvoice] = useState<any>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch report and start polling if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const startPolling = (reportId: number) => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusData = await reportService.checkReportStatus(reportId);
          setPollStatus(statusData.status);
          setPollProgress(statusData.progress || 0);
          setPollMessage(statusData.message || 'Processing...');

          if (statusData.status === 'COMPLETED') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            // Refresh report info
            const reportsData = await reportService.listReports(user?.email);
            if (reportsData?.[0]) {
              setReport(reportsData[0]);
            }
          } else if (statusData.status === 'FAILED') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 2000);
    };

    const fetchLatestReportAndPoll = async () => {
      try {
        // Fetch user's reports to get the latest one
        const reportsData = await reportService.listReports(user?.email);
        const latestReport = reportsData?.[0]; // Sorted by -created_at in backend

        if (latestReport) {
          setReport(latestReport);
          setPollStatus(latestReport.status);
          
          // Also fetch invoices
          try {
            const invoicesData = await reportService.listInvoices();
            const currentInvoice = invoicesData?.results?.find((inv: any) => inv.order_id === orderId || inv.order_short_id === orderId);
            if (currentInvoice) setInvoice(currentInvoice);
          } catch (e) {
            console.error("Failed to fetch invoice", e);
          }
          
          if (latestReport.status === 'COMPLETED') {
            setPollProgress(100);
            setPollMessage('Report ready!');
          } else if (latestReport.status === 'FAILED') {
            setPollProgress(0);
            setPollMessage('Report generation failed. Please contact support.');
          } else {
            // Start polling
            startPolling(latestReport.id);
          }
        } else {
          // No report found yet, retry in 3 seconds
          setTimeout(fetchLatestReportAndPoll, 3000);
        }
      } catch (err) {
        console.error('Error fetching latest report:', err);
      }
    };

    fetchLatestReportAndPoll();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isAuthenticated, user?.email, orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-subtle" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 animate-float" />

        <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-8 shadow-2xl relative">
          <div className="flex justify-center">
            <div className="p-4 bg-success/10 border border-success/20 rounded-full text-success animate-bounce">
              <CheckCircle className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white">Payment Successful!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Thank you for your purchase. Your payment has been processed and your Name-Only CX ID token has been registered.
            </p>
          </div>

          {/* Order Details Summary */}
          <div className="p-5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Order ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{orderId ? orderId.substring(0, 8).toUpperCase() : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">CX ID Security:</span>
              <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                CX-{user?.name ? user.name.substring(0, 6).toUpperCase().replace(/[^A-Z]/g, 'X') : 'CLIENT'}-{Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Amount Paid:</span>
              <span className="font-extrabold text-primary dark:text-primary-light">₹199.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Service:</span>
              <span className="font-semibold text-slate-900 dark:text-white">Mobile Numerology Report</span>
            </div>
          </div>

          {/* Polling / Report Progress Area */}
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Status: {pollStatus}</span>
                <span>{pollProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-linear-to-r from-primary to-secondary h-full transition-all duration-500"
                  style={{ width: `${pollProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                {pollMessage}
              </p>

              {pollStatus === 'COMPLETED' && report && (
                <div className="space-y-3">
                  <Link
                    href={`/dashboard/reports/${report.id}`}
                    className="w-full flex items-center justify-center py-3 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <span>View Interactive Report</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  
                  {invoice && invoice.pdf_url && (
                    <a
                      href={invoice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-sm transition-all"
                    >
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <span>Download Invoice PDF</span>
                    </a>
                  )}
                </div>
              )}

              {pollStatus === 'FAILED' && (
                <div className="text-danger text-sm font-semibold">
                  Generation failed. Please contact support at support@astromobile.com.
                </div>
              )}

              {pollStatus !== 'COMPLETED' && pollStatus !== 'FAILED' && (
                <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Generating Lo Shu prediction vectors...</span>
                </div>
              )}
            </div>
          ) : (
            /* Guest Buyer Flow */
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-start space-x-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl text-left text-sm text-slate-600 dark:text-slate-300">
                <Lock className="h-5 w-5 text-primary dark:text-primary-light shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Secure Your Report Dashboard</h4>
                  <p className="text-xs leading-relaxed text-slate-500">
                    To view, download, and track your interactive numerology reports, please register a password using the email address you entered during checkout.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/auth/register?email=${searchParams.get('email') || ''}`}
                  className="flex-1 flex items-center justify-center py-3 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-md transition-all text-sm"
                >
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
                <Link
                  href="/auth/login"
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all text-sm"
                >
                  Log In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
