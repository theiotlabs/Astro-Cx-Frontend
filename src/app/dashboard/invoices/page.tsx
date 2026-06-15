'use client';

import React, { useEffect, useState } from 'react';
import { Receipt, Calendar, Download, RefreshCw, Loader2, ArrowRight } from 'lucide-react';
import { reportService } from '../../../services/reports';
import api from '../../../services/api';
import { API_BASE_URL } from '../../../constants';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  invoice_number: string;
  pdf_url: string;
  issued_at: string;
  amount: string;
  tax_amount: string;
  status: string;
  order_id: string;
  service_title: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      const data = await reportService.listInvoices();
      setInvoices(Array.isArray(data.results) ? data.results : []);
    } catch (err: any) {
      console.error('Failed to load invoices:', err);
      setError('Could not retrieve invoice records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadInvoice = async (invoiceId: string, invoiceNumber: string, pdfUrl: string) => {
    if (!pdfUrl) {
      alert('Invoice PDF is not compiled yet.');
      return;
    }
    setDownloadingId(invoiceId);
    try {
      // Clean path and ensure absolute URL
      const cleanPath = pdfUrl.startsWith('http') ? pdfUrl : `${API_BASE_URL}${pdfUrl}`;
      const response = await api.get(cleanPath, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Invoice download failed:', err);
      alert('Could not download invoice file.');
    } finally {
      setDownloadingId(null);
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
            Invoices & Billing
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Download your serial invoice receipts and tax details for all transactions.
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchInvoices();
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

      {/* Invoices List */}
      {invoices.length > 0 ? (
        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Table Header for large screens */}
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-slate-100 dark:bg-dark-card border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Invoice Number</span>
            <span>Date Issued</span>
            <span>Service</span>
            <span className="text-right">Total Amount</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {invoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-5 items-center hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors"
              >
                {/* Invoice Number */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 text-success rounded-lg">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white block">
                      {invoice.invoice_number}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-success/15 border border-success/20 text-success rounded font-semibold uppercase tracking-wider inline-block">
                      {invoice.status}
                    </span>
                  </div>
                </div>

                {/* Issued Date */}
                <div className="flex items-center text-sm text-slate-500 space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(invoice.issued_at).toLocaleDateString()}</span>
                </div>

                {/* Service Name */}
                <div className="text-sm font-semibold truncate md:max-w-xs text-slate-700 dark:text-slate-300">
                  {invoice.service_title}
                </div>

                {/* Total amount (with tax info) */}
                <div className="md:text-right space-y-0.5">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white block">
                    ₹{parseFloat(invoice.amount).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Incl. ₹{parseFloat(invoice.tax_amount).toFixed(2)} GST
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-2 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
                  <button
                    onClick={() => handleDownloadInvoice(invoice.id, invoice.invoice_number, invoice.pdf_url)}
                    disabled={downloadingId === invoice.id}
                    className="inline-flex items-center justify-center space-x-1 py-2 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {downloadingId === invoice.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>Download PDF</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto space-y-6 shadow-sm flex flex-col items-center">
          <Receipt className="h-12 w-12 text-slate-400 animate-pulse-subtle" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl">No invoices compiled</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              No transaction invoices are generated yet. Run a report to create billing receipts.
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
