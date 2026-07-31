'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { reportService } from '../../services/reports';
import { CatalogService } from '../../types';
import { Compass, Check, Loader2, ArrowRight, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await reportService.getServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  const defaultServices: CatalogService[] = [
    {
      id: 'basic-report',
      name: 'Essential Lo Shu Audit',
      slug: 'essential-loshu',
      description: 'Quick 3x3 Lo Shu magic square calculation with Mulank & Bhagyank summary and basic lucky numbers.',
      short_description: 'Basic birth date & mobile number compatibility check.',
      price: '99.00',
      discount_price: null,
      is_active: true,
    },
    {
      id: 'mobile-numerology-report',
      name: 'Mobile Numerology Report',
      slug: 'mobile-numerology',
      description: 'Complete 5-layer mobile numerology analysis detailing Mulank, Bhagyank, Kua number, Compound totals, pairs, and actionable remedies.',
      short_description: 'Instant PDF + Dashboard with full 5-layer analysis & remedies.',
      price: '199.00',
      discount_price: null,
      is_active: true,
    },
    {
      id: 'enterprise-report',
      name: 'Enterprise 360° Portal Sync',
      slug: 'enterprise-numerology',
      description: 'Full name-only CX ID synchronization across Astro CRM IoT, lifetime Lo Shu Grid updates, Chaldean + Pythagorean matrices, and priority email support.',
      short_description: 'Professional CRM sync + Master Chaldean & Pythagorean matrices.',
      price: '499.00',
      discount_price: null,
      is_active: true,
    }
  ];

  const activeServices = services.length > 0 && services.length >= 3 ? services : defaultServices;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-300">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 text-primary dark:text-primary-light text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Transparent &amp; Powerful Numerology Tiers</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-slate-900 dark:text-white tracking-tight">
            Flexible, Professional <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-secondary">Cosmic Plans</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Unlock precision Lo Shu Grid matrices, Chaldean mobile vibrations, and automated CRM synchronizations.
          </p>
        </div>

        {/* Name-Only CX ID Compliance Banner */}
        <div className="max-w-4xl mx-auto p-6 glass-card rounded-2xl border border-primary/30 dark:border-primary/40 bg-linear-to-r from-primary/10 via-indigo-500/10 to-secondary/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-3 rounded-xl bg-primary/20 text-primary dark:text-primary-light shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                Professional Name-Only CX ID Protected
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                All plans automatically assign a GDPR &amp; CRM compliant identifier (<code className="font-mono font-semibold text-primary dark:text-primary-light">CX-NAME-xxxx</code>) without exposing raw UUIDs.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold shrink-0">
            <span>● SECURE ENTERPRISE SYNC</span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary dark:text-primary-light animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto items-stretch">
            {activeServices.map((service, index) => {
              const isMiddle = index === 1;
              return (
                <div
                  key={service.id}
                  className={`glass-card p-8 sm:p-10 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative shadow-lg ${
                    isMiddle 
                      ? 'border-primary/60 dark:border-primary/70 bg-linear-to-b from-white/95 via-white/85 to-primary/10 dark:from-slate-900/95 dark:via-slate-900/85 dark:to-primary/15 shadow-primary/20 sm:-translate-y-2 hover:shadow-2xl hover:border-primary' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {isMiddle && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary to-secondary text-white text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Most Popular Tier</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-primary dark:text-primary-light uppercase tracking-wider block mb-1">
                        {isMiddle ? 'Instant PDF + Dashboard' : index === 0 ? 'Starter Analysis' : 'Professional 360° Portal'}
                      </span>
                      <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {service.short_description || service.description}
                      </p>
                    </div>

                    <div className="flex items-baseline space-x-2 py-2 border-y border-slate-200 dark:border-slate-800">
                      <span className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white">
                        ₹{parseFloat(service.price).toFixed(0)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">/ one-time</span>
                    </div>

                    <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-200">
                      <li className="flex items-center space-x-3">
                        <div className="p-1 rounded-full bg-success/20 text-success shrink-0">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="font-medium">3x3 Lo Shu Grid Matrix</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="p-1 rounded-full bg-success/20 text-success shrink-0">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Mulank &amp; Bhagyank analysis</span>
                      </li>
                      {index >= 1 && (
                        <>
                          <li className="flex items-center space-x-3">
                            <div className="p-1 rounded-full bg-success/20 text-success shrink-0">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Mobile Number Pairs &amp; Compound Total</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <div className="p-1 rounded-full bg-success/20 text-success shrink-0">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Actionable Vedic &amp; Feng Shui Remedies</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <div className="p-1 rounded-full bg-success/20 text-success shrink-0">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Instant PDF Download + Vault Storage</span>
                          </li>
                        </>
                      )}
                      {index === 2 && (
                        <li className="flex items-center space-x-3">
                          <div className="p-1 rounded-full bg-primary/20 text-primary dark:text-primary-light shrink-0">
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-primary dark:text-primary-light">Name-Only CX ID CRM Synchronization</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/#purchase-section"
                      className={`w-full flex justify-center items-center py-3.5 px-6 rounded-xl font-bold transition-all shadow-md ${
                        isMiddle
                          ? 'bg-linear-to-r from-primary to-secondary hover:opacity-90 text-white shadow-primary/25'
                          : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900'
                      }`}
                    >
                      <span>Get Report Now</span>
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enterprise FAQ / Trust Footer */}
        <div className="max-w-3xl mx-auto text-center space-y-4 pt-8">
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Need Custom Enterprise Numerology for your Team?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            We provide custom API endpoints and batch mobile numerology evaluations for corporate astrology services. Contact our engineering team for dedicated SLA and high-throughput Celery worker pipelines.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary-light hover:underline"
            >
              <span>Contact Astro Enterprise Solutions</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
