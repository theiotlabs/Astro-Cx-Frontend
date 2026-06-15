'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  AlertCircle, 
  Compass, 
  ArrowRight,
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';
import { reportService } from '../../../services/reports';
import useAuthStore from '../../../store/useAuthStore';
import api from '../../../services/api';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      const data = await reportService.listReports(user?.email);
      setReports(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch reports:', err);
      setError('Could not retrieve numerology reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user?.email]);

  const handleDownload = async (reportId: number, mobileNumber: string) => {
    setDownloadingId(reportId);
    try {
      const response = await api.get(`/api/mobile-numerology/reports/${reportId}/download/`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AstroMobile_Report_${mobileNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF report:', err);
      alert('Your PDF report is still generating in the background. Please try again in a moment.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="text-xs px-2.5 py-1 bg-success/10 border border-success/20 text-success rounded-full font-medium uppercase tracking-wide">
            Ready
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="text-xs px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-medium uppercase tracking-wide flex items-center space-x-1 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="text-xs px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full font-medium uppercase tracking-wide">
            Queued
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="text-xs px-2.5 py-1 bg-danger/10 border border-danger/20 text-danger rounded-full font-medium uppercase tracking-wide">
            Failed
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
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
            My Numerology Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Access your 5-layer mobile numerology reports, download PDF files, or track active calculation statuses.
          </p>
        </div>
        <Link
          href="/#purchase-section"
          className="inline-flex items-center justify-center py-2.5 px-5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-md transition-all self-start"
        >
          <span>New Analysis</span>
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Reports Directory Grid */}
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              {/* Top Row: Mobile Number & Status */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Mobile Number</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                    {report.mobile_number}
                  </h3>
                  <div className="flex items-center text-xs text-slate-400 space-x-1.5 pt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Ordered {new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  {getStatusBadge(report.status)}
                </div>
              </div>

              {/* Middle Row: Key Calculation Metrics (Mulank, Bhagyank, Total) */}
              {report.status === 'COMPLETED' ? (
                <div className="grid grid-cols-3 gap-3 bg-slate-100/50 dark:bg-dark-card p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase">Mulank</span>
                    <span className="text-lg font-bold text-primary dark:text-primary-light">{report.mulank || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase">Bhagyank</span>
                    <span className="text-lg font-bold text-secondary">{report.bhagyank || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase">Mobile Total</span>
                    <span className="text-lg font-bold text-success">{report.mobile_total || '—'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center space-x-2 text-xs text-slate-500">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <span>
                    {report.status === 'FAILED' 
                      ? 'Calculation error. Please contact customer support.' 
                      : 'Calculations and PDF compilation are running on our Celery workers.'}
                  </span>
                </div>
              )}

              {/* Bottom Row: Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                {report.status === 'COMPLETED' ? (
                  <>
                    <Link
                      href={`/dashboard/reports/${report.id}`}
                      className="inline-flex items-center text-sm font-semibold text-primary dark:text-primary-light hover:underline"
                    >
                      <span>Open Report</span>
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                    <button
                      onClick={() => handleDownload(report.id, report.mobile_number)}
                      disabled={downloadingId === report.id}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                      title="Download PDF Report"
                    >
                      {downloadingId === report.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <Download className="h-5 w-5" />
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed uppercase"
                  >
                    Processing In Background
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto space-y-6 shadow-sm flex flex-col items-center">
          <Layers className="h-12 w-12 text-slate-400 animate-pulse-subtle" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl">No reports generated yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We haven&apos;t calculated any mobile numerology reports under this account yet. Enter a mobile number on our home screen to check predictions.
            </p>
          </div>
          <Link
            href="/#purchase-section"
            className="inline-flex items-center justify-center py-2.5 px-6 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-md transition-all"
          >
            <span>Run First Analysis</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </div>
      )}

    </div>
  );
}
