'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reportService } from '../services/reports';
import { 
  ArrowRight, 
  Calculator, 
  Grid, 
  TrendingUp,
  Heart,
  Users,
  Loader2,
  Lock,
  Star,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Compass,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Single digit reducer helper
const reduceToSingleDigit = (num: number): number => {
  while (num > 9) {
    num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
};

export default function HomePage() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState(1); // 1: Input, 2: Preview, 3: Payment loading
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'male',
    mobile_number: '',
  });

  const [previewData, setPreviewData] = useState({
    mulank: 0,
    bhagyank: 0,
    mobileTotal: 0,
    kuaNumber: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side quick preview calculator
  const calculatePreview = () => {
    const dob = formData.date_of_birth;
    const mob = formData.mobile_number;
    const gender = formData.gender;

    if (!dob || !mob) return;

    // 1. Mulank: sum of day
    const day = parseInt(dob.split('-')[2]);
    const mulank = reduceToSingleDigit(day);

    // 2. Bhagyank: sum of all digits in YYYY-MM-DD
    const dobSum = dob.replace(/-/g, '').split('').reduce((sum, char) => sum + parseInt(char), 0);
    const bhagyank = reduceToSingleDigit(dobSum);

    // 3. Mobile Total: sum of all digits
    const mobSum = mob.split('').reduce((sum, char) => sum + parseInt(char), 0);
    const mobileTotal = reduceToSingleDigit(mobSum);

    // 4. Kua Number
    const year = parseInt(dob.split('-')[0]);
    const yearSum = reduceToSingleDigit(year.toString().split('').reduce((sum, char) => sum + parseInt(char), 0));
    let kuaNumber = 0;
    if (gender === 'male') {
      kuaNumber = reduceToSingleDigit(11 - yearSum);
    } else {
      kuaNumber = reduceToSingleDigit(4 + yearSum);
    }

    setPreviewData({ mulank, bhagyank, mobileTotal, kuaNumber });
    setStep(2);
    // Smooth scroll to calculations preview
    document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      setError('Failed to load Razorpay payment portal. Check your internet connection.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create order in backend
      const order = await reportService.createOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: 'MOBILE_NUMEROLOGY',
        service_title: 'Premium Mobile Numerology Report',
        price: 199.00,
        notes: `Report request for mobile total calculation: ${formData.mobile_number}`,
        metadata: {
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          mobile_number: formData.mobile_number
        }
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.total_amount * 100, // in paisa
        currency: order.currency || 'INR',
        name: 'AstroMobile',
        description: 'Complete 5-layer Mobile Numerology Report',
        order_id: order.razorpay_order_id,
        handler: async function (response: any) {
          try {
            setStep(3); // Transition to processing state
            await reportService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            router.push(`/payment/success?order_id=${order.id}&email=${encodeURIComponent(formData.email)}`);
          } catch (verifErr: any) {
            setError(verifErr.response?.data?.error || 'Payment verification failed.');
            setStep(2);
          }
          setIsLoading(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#6D28D9'
        }
      };

      // In Local testing, if key is placeholder or order_id is mock, simulate payment success directly
      if (options.key === 'rzp_test_placeholder' || order.razorpay_order_id?.startsWith('order_mock_')) {
        console.warn("Local development/Mock mode detected. Simulating successful Razorpay payment.");
        setStep(3); // Transition to processing state
        try {
          await reportService.verifyPayment({
            razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(7),
            razorpay_order_id: order.razorpay_order_id || 'order_mock_123',
            razorpay_signature: 'sig_mock_123'
          });
          router.push(`/payment/success?order_id=${order.id}&email=${encodeURIComponent(formData.email)}`);
        } catch (verifErr: any) {
          setError(verifErr.response?.data?.error || 'Mock payment verification failed.');
          setStep(2);
        }
        setIsLoading(false);
        return;
      }

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initialize order checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    { 
      q: "What is Mulank (Birth Number) & Bhagyank (Destiny Number)?", 
      a: "Mulank is derived from the day of your birth and governs your core personality and immediate instincts. Bhagyank is the single-digit sum of your complete birth date (YYYY-MM-DD) and dictates your lifelong destiny path and karmic lessons." 
    },
    { 
      q: "Why is my Mobile Number so influential in numerology?", 
      a: "Your mobile number vibrates thousands of times each day with every incoming call, text message, and digital transaction. In Vedic and Chaldean numerology, these continuous frequency patterns align with or clash against your birth chart." 
    },
    { 
      q: "What makes the 3x3 Lo Shu Grid Magic Square unique?", 
      a: "The Chinese Lo Shu Grid maps your birth digits onto nine cosmic sectors (Wealth, Fame, Relationships, Family, Health, Children, Knowledge, Career, and Helpful People). Our engine analyzes your completed planes and identifies missing arrows." 
    },
    { 
      q: "How does Name-Only CX ID compliance protect my privacy?", 
      a: "Every customer account is assigned a secure Name-Only identifier (e.g., CX-NAME-xxxx). We never expose raw database UUIDs or administrative staff identifiers in URLs or client-side storage." 
    },
    { 
      q: "How fast will my PDF report be ready?", 
      a: "Your interactive calculation dashboard opens immediately upon purchase. Your comprehensive, beautifully styled PDF report is compiled on our high-speed Celery background workers and ready to download in under 60 seconds." 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse-subtle" />
        <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-float" />

        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 text-primary dark:text-primary-light text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>5-Layer Lo Shu Grid &amp; Chaldean Numerology Engine</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight text-slate-900 dark:text-white">
            Decode the Cosmic Frequency of Your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-secondary">
              Mobile Number
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Discover whether your 10-digit mobile number attracts abundance or obstacles. We map your Mulank, Bhagyank, Kua number, and Lo Shu Grid matrix to reveal your instant compatibility verdict and personalized remedies.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a
              href="#purchase-section"
              className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-primary to-secondary hover:opacity-95 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(14,165,233,0.35)] transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <span>Calculate My Report Now</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary-light text-slate-800 dark:text-slate-100 font-bold rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>

          {/* Quick Trust Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-200 dark:border-slate-800/80 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Name-Only CX ID Protected</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Instant Dashboard Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary dark:text-primary-light" />
              <span>Complete 3x3 Magic Square</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="h-4 w-4 text-secondary" />
              <span>GDPR Encrypted Storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 6-Card Diagnostic Engine Features */}
      <section id="features-section" className="py-24 bg-linear-to-b from-transparent via-primary/5 to-transparent border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-light block">
              ● comprehensive diagnostic architecture
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white">
              The 5-Layer Vedic &amp; Lo Shu Engine
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Unlike simplistic calculators, our system cross-verifies your mobile number against both Chinese 3x3 Magic Square mathematics and Vedic planetary frequencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light">
                <Grid className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                3x3 Lo Shu Grid Matrix
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Maps your birth date digits across all nine sectors to identify completed planes (Mental, Emotional, Practical) and detect missing arrows of strength.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-secondary/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Mobile Total &amp; Compound Total
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Calculates your single-digit root vibration alongside the deeper 2-digit Chaldean compound number governing financial success and authority.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Harmonic Compatibility Index
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Provides a precise score out of 100 measuring how well your mobile number aligns with your Mulank (Birth) and Bhagyank (Destiny) planetary rulers.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                2-Digit Pair Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Evaluates every adjacent digit pair in your phone number (e.g., 98, 87, 76) to expose subtle wealth-generating combinations or friction vectors.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-secondary/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Name-Only CX ID Protection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Every customer account receives a clean identifier (<code className="font-mono font-semibold">CX-NAME-xxxx</code>) ensuring zero database UUID leakage across CRM portals.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Actionable Vedic Remedies
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Receive practical color codes, screen wallpaper alignments, lucky name spellings, and numeric habits to heal missing numbers in your chart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Section Wizard */}
      <section id="purchase-section" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-light block">
              ● instant preview &amp; checkout
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white">
              Calculate Your Numerology Preview
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Enter your birth coordinates and mobile number below to generate your initial single-digit breakdown before unlocking the full 5-layer report.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-danger/10 border border-danger/30 text-danger text-sm rounded-2xl flex items-center space-x-3">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                calculatePreview();
              }}
              className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-sm"
                    placeholder="Rahul Sharma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-sm"
                    placeholder="rahul@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">WhatsApp Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-sm font-mono"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">10-Digit Mobile Number to Analyze</label>
                  <input
                    type="text"
                    name="mobile_number"
                    required
                    maxLength={10}
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-sm font-mono font-bold tracking-wider"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-6 bg-linear-to-r from-primary to-secondary hover:opacity-95 text-white rounded-2xl font-bold transition-all shadow-lg transform hover:-translate-y-0.5 cursor-pointer text-base"
              >
                <span>Generate Instant Preview</span>
                <Calculator className="h-5 w-5 ml-2.5" />
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-8">
              {/* Calculations Preview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-2xl text-center space-y-1 shadow-sm">
                  <span className="text-xs text-primary dark:text-primary-light font-heading font-bold uppercase tracking-wider">Mulank (Birth)</span>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{previewData.mulank}</p>
                </div>
                <div className="p-5 bg-secondary/10 dark:bg-secondary/20 border border-secondary/30 rounded-2xl text-center space-y-1 shadow-sm">
                  <span className="text-xs text-secondary font-heading font-bold uppercase tracking-wider">Bhagyank (Destiny)</span>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{previewData.bhagyank}</p>
                </div>
                <div className="p-5 bg-success/10 dark:bg-success/20 border border-success/30 rounded-2xl text-center space-y-1 shadow-sm">
                  <span className="text-xs text-success font-heading font-bold uppercase tracking-wider">Mobile Total Root</span>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{previewData.mobileTotal}</p>
                </div>
                <div className="p-5 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-2xl text-center space-y-1 shadow-sm">
                  <span className="text-xs text-primary dark:text-primary-light font-heading font-bold uppercase tracking-wider">Kua Number</span>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{previewData.kuaNumber}</p>
                </div>
              </div>

              {/* Locked Sections Preview */}
              <div className="glass-card p-10 rounded-3xl border border-primary/40 dark:border-primary/50 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-5 z-20">
                  <div className="p-4 rounded-2xl bg-primary/20 text-primary dark:text-primary-light animate-bounce">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                    Unlock Your Complete 5-Layer Report
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
                    Access your personalized 3x3 Lo Shu Grid, Chaldean compound compatibility score, mobile number pair vectors, and custom remedies.
                  </p>
                  
                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="flex items-center justify-center py-4 px-10 bg-linear-to-r from-primary to-secondary hover:opacity-95 text-white rounded-2xl font-bold shadow-lg shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        <span>Initializing Secure Portal...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Report for ₹199</span>
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>

                {/* Background layout resembling grid */}
                <div className="opacity-20 space-y-4 select-none pointer-events-none">
                  <div className="h-6 w-1/3 bg-slate-400 dark:bg-slate-600 rounded" />
                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                    <div className="aspect-square bg-slate-400 dark:bg-slate-600 rounded-xl" />
                    <div className="aspect-square bg-slate-400 dark:bg-slate-600 rounded-xl" />
                    <div className="aspect-square bg-slate-400 dark:bg-slate-600 rounded-xl" />
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setStep(1)}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors hover:underline block text-center w-full cursor-pointer font-semibold"
              >
                ← Edit Birth Details &amp; Mobile Number
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="glass-card p-12 sm:p-16 rounded-3xl text-center space-y-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 shadow-xl">
              <Loader2 className="h-14 w-14 text-primary dark:text-primary-light animate-spin" />
              <div className="space-y-2">
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  Processing Payment &amp; Calculating Report...
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  Please do not close this window. We are synchronizing your Name-Only CX ID and compiling your interactive dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-24 bg-linear-to-b from-transparent via-primary/5 to-transparent border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-light block">
              ● verified real experiences
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white">
              What Our Clients Say
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Read how aligning mobile number frequencies transformed careers, business cashflows, and personal clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 glass-card rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  &quot;The remedies suggested in the report were simple and practical. Changing my mobile total vibration brought immediate alignment in my business dealings and client retention.&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white">Priya Sundaram</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Founder &amp; Entrepreneur</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">CX-PRIYA-8421</span>
              </div>
            </div>

            <div className="p-8 glass-card rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  &quot;The Lo Shu grid analysis was incredibly accurate. It highlighted missing numbers that mapped exactly to career struggles I experienced for years. Highly recommended!&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white">Rohan Kapoor</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">VP of Sales &amp; Growth</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">CX-ROHAN-3912</span>
              </div>
            </div>

            <div className="p-8 glass-card rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  &quot;The pricing is incredibly reasonable, and the PDF compiled cleanly inside my dashboard instantly. I love the Name-Only CX ID privacy feature as well!&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white">Aisha Malik</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Lead UX Architect</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">CX-AISHA-7182</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-light block">
            ● common questions answered
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Everything you need to know about our numerology calculations, Name-Only CX ID security, and instant PDF delivery.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
              <div className="flex items-start space-x-3 text-primary dark:text-primary-light">
                <HelpCircle className="h-6 w-6 shrink-0 mt-0.5" />
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">{faq.q}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm pl-9 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
