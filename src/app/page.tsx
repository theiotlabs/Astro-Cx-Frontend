'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reportService } from '../services/reports';
import { 
  Compass, 
  ArrowRight, 
  HelpCircle, 
  Lock, 
  CheckCircle, 
  Star, 
  Sparkles,
  Calculator,
  Grid,
  TrendingUp,
  Heart,
  Users,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        notes: `Report request for mobile total calculation: ${formData.mobile_number}`
      });

      // 2. Open Razorpay Widget
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
            // Verify payment signature
            await reportService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            // Redirect to Success page
            router.push(`/payment/success?order_id=${order.id}&email=${encodeURIComponent(formData.email)}`);
          } catch (verifErr: any) {
            setError(verifErr.response?.data?.error || 'Payment verification failed.');
            setStep(2);
          }
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
    { q: "What is Mulank & Bhagyank?", a: "Mulank (Birth Number) represents your character traits and raw potential. Bhagyank (Destiny Number) represents your life path and karmic patterns." },
    { q: "How does my mobile number affect my life?", a: "Your phone number vibrates thousands of times daily. In numerology, these continuous numeric vibrations shape career alignments, financial flows, and relationship harmonies." },
    { q: "What is the Lo Shu Grid?", a: "An ancient 3x3 magic square mapping your date of birth onto planes (mental, emotional, practical) to detect hidden personality strengths and missing remedies." },
    { q: "How long does it take to get my report?", a: "Report compilation is completed instantly. PDF generation will process in the background within 60 seconds." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-subtle" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/15 dark:bg-secondary/5 rounded-full blur-3xl -z-10 animate-float" />

        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl tracking-tight leading-none">
            Unlock the Hidden Power of Your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Mobile Number
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Fusing ancient Lo Shu magic grid analysis with modern algorithm engines to reveal your compatibility score, missing elements, and exact remedies.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <a
              href="#purchase-section"
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>Get Report Now</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#features-section"
              className="px-6 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-section" className="py-20 bg-slate-100 dark:bg-dark-card border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl">What our Report covers</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
              Every analysis includes a complete 5-layer breakdown generated instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 glass-card rounded-2xl space-y-4">
              <Grid className="h-8 w-8 text-primary" />
              <h3 className="font-heading font-bold text-xl">Lo Shu Grid</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Visualizes your birth date elements, planes (mental, will, action), and strong vs missing arrows.
              </p>
            </div>

            <div className="p-6 glass-card rounded-2xl space-y-4">
              <TrendingUp className="h-8 w-8 text-secondary" />
              <h3 className="font-heading font-bold text-xl">Numerology Score</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Calculates your compatibility score out of 100 based on Mulank, Bhagyank, and Mobile numbers.
              </p>
            </div>

            <div className="p-6 glass-card rounded-2xl space-y-4">
              <Heart className="h-8 w-8 text-success" />
              <h3 className="font-heading font-bold text-xl">Practical Remedies</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Provides numeric remedies, color guides, and recommendations to offset bad combinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Section Wizard */}
      <section id="purchase-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl">Get Your Report</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your details to calculate your initial preview.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/25 text-danger text-sm rounded-lg">
              {error}
            </div>
          )}

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                calculatePreview();
              }}
              className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WhatsApp Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                    placeholder="+919876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number to Analyze</label>
                  <input
                    type="text"
                    name="mobile_number"
                    required
                    maxLength={10}
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all shadow-md focus:outline-none transform hover:-translate-y-0.5"
              >
                <span>Calculate Preview</span>
                <Calculator className="h-5 w-5 ml-2" />
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Calculations Preview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-primary/10 border border-primary/25 rounded-xl text-center space-y-1">
                  <span className="text-xs text-primary font-heading font-semibold uppercase tracking-wider">Mulank</span>
                  <p className="text-3xl font-extrabold">{previewData.mulank}</p>
                </div>
                <div className="p-4 bg-secondary/10 border border-secondary/25 rounded-xl text-center space-y-1">
                  <span className="text-xs text-secondary font-heading font-semibold uppercase tracking-wider">Bhagyank</span>
                  <p className="text-3xl font-extrabold">{previewData.bhagyank}</p>
                </div>
                <div className="p-4 bg-success/10 border border-success/25 rounded-xl text-center space-y-1">
                  <span className="text-xs text-success font-heading font-semibold uppercase tracking-wider">Mobile Total</span>
                  <p className="text-3xl font-extrabold">{previewData.mobileTotal}</p>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/25 rounded-xl text-center space-y-1">
                  <span className="text-xs text-primary font-heading font-semibold uppercase tracking-wider">Kua Number</span>
                  <p className="text-3xl font-extrabold">{previewData.kuaNumber}</p>
                </div>
              </div>

              {/* Locked Sections Preview */}
              <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50 dark:bg-dark-bg/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Lock className="h-10 w-10 text-primary dark:text-primary-light animate-bounce" />
                  <h3 className="font-heading font-bold text-2xl">Unlock Your Complete Report</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                    Unlock your personalized 3x3 Lo Shu Grid, compatible number combinations, and specific Remedies.
                  </p>
                  
                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="flex items-center justify-center py-3 px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        <span>Initializing Payment...</span>
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
                <div className="opacity-15 space-y-4 select-none pointer-events-none">
                  <div className="h-6 w-1/3 bg-slate-400 rounded" />
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    <div className="aspect-ratio bg-slate-400 rounded h-16" />
                    <div className="aspect-ratio bg-slate-400 rounded h-16" />
                    <div className="aspect-ratio bg-slate-400 rounded h-16" />
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setStep(1)}
                className="text-sm text-slate-500 hover:text-primary transition-colors hover:underline block text-center w-full"
              >
                ← Edit details
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="glass-card p-12 rounded-2xl text-center space-y-4 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <h3 className="font-heading font-bold text-2xl">Processing Payment...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Please do not close this window or navigate away. We are finalizing your transaction.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-100 dark:bg-dark-card border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl">What Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 glass-card rounded-xl space-y-3">
              <div className="flex text-amber-500">
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                &quot;The remedies suggested in the report were simple and practical. Changing my mobile total vibration brought immediate alignment in my business dealings.&quot;
              </p>
              <h4 className="font-heading font-semibold text-slate-900 dark:text-slate-100">- Priya S., Entrepreneur</h4>
            </div>

            <div className="p-6 glass-card rounded-xl space-y-3">
              <div className="flex text-amber-500">
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                &quot;The Lo Shu grid analysis was incredibly accurate. It highlighted missing numbers that mapped exactly to personal struggles I experienced for years.&quot;
              </p>
              <h4 className="font-heading font-semibold text-slate-900 dark:text-slate-100">- Rohan K., Sales Manager</h4>
            </div>

            <div className="p-6 glass-card rounded-xl space-y-3">
              <div className="flex text-amber-500">
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
                <Star className="fill-current h-4 w-4" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                &quot;Highly recommend this service! The pricing is incredibly reasonable, and the PDF compiled cleanly inside my dashboard instantly.&quot;
              </p>
              <h4 className="font-heading font-semibold text-slate-900 dark:text-slate-100">- Aisha M., Designer</h4>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-primary dark:text-primary-light">
                <HelpCircle className="h-5 w-5" />
                <h3 className="font-heading font-bold text-lg">{faq.q}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
