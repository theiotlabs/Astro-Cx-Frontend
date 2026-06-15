'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { reportService } from '../../services/reports';
import { CatalogService } from '../../types';
import { Compass, Check, Loader2, ArrowRight } from 'lucide-react';
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

  // Default fallback service if catalog is empty
  const defaultServices: CatalogService[] = [
    {
      id: 'default-report-id',
      name: 'Mobile Numerology Report',
      slug: 'mobile-numerology',
      description: 'Complete 5-layer mobile numerology analysis detailing Mulank, Bhagyank, Kua number, Compound totals, pairs, and remedies.',
      short_description: 'Complete 5-layer mobile numerology analysis.',
      price: '199.00',
      discount_price: null,
      is_active: true,
    }
  ];

  const activeServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="font-heading font-extrabold text-4xl mb-4 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
            Flexible, Premium Plans
          </h1>
          <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400">
            Select the report type that fits your goals. Unlock insights instantly.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-4xl mx-auto">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative"
              >
                {/* Visual badge for best value */}
                <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-secondary text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Popular
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-2xl text-primary dark:text-primary-light">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {service.short_description || service.description}
                  </p>
                  
                  <div className="flex items-baseline space-x-1 py-4">
                    <span className="text-4xl font-extrabold font-heading">
                      ₹{parseFloat(service.price).toFixed(0)}
                    </span>
                    <span className="text-slate-500 text-sm">one-time</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-success" />
                      <span>Lo Shu Grid Analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-success" />
                      <span>Mulank & Bhagyank analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-success" />
                      <span>Mobile Pairs & Compound totals</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-success" />
                      <span>Actionable remedies & tips</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-success" />
                      <span>Lifetime dashboard storage</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/#purchase-section`}
                    className="w-full flex justify-center items-center py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all shadow-md"
                  >
                    <span>Get Instant Report</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
