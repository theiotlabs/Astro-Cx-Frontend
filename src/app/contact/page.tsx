'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cxId, setCxId] = useState('');
  const [message, setMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setCxId('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-300">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 text-primary dark:text-primary-light text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>24/7 Dedicated Support &amp; Consultation</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-slate-900 dark:text-white tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-secondary">Touch</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Have questions about your Lo Shu Grid report, Name-Only CX ID compliance, or custom CRM billing? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Contact Details & SLA Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Direct Communication
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Our customer success team and Vedic numerologists are ready to assist with calculation queries and portal synchronizations.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Card */}
              <div className="p-5 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-4 shadow-sm hover:border-primary/40 transition-colors">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary dark:text-primary-light shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white">Email Support</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">24/7 Ticket SLA &lt; 2 hours</p>
                  <p className="text-sm font-semibold text-primary dark:text-primary-light mt-1">support@astromobile.com</p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-5 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-4 shadow-sm hover:border-secondary/40 transition-colors">
                <div className="p-3 bg-secondary/10 dark:bg-secondary/20 rounded-xl text-secondary shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white">Phone &amp; WhatsApp</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mon - Sat, 10:00 AM to 7:00 PM IST</p>
                  <p className="text-sm font-semibold text-secondary mt-1">+91 98765 43210</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-5 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-4 shadow-sm hover:border-success/40 transition-colors">
                <div className="p-3 bg-success/10 dark:bg-success/20 rounded-xl text-success shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white">AstroMobile Labs</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Corporate HQ &amp; Numerology Center</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">Sector 62, Electronic City, Noida, UP, India</p>
                </div>
              </div>
            </div>

            {/* CX ID Compliance Notice */}
            <div className="p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/30 flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-200">
              <ShieldCheck className="h-5 w-5 text-primary dark:text-primary-light shrink-0" />
              <span>
                <strong>Privacy Protected:</strong> We never request sensitive passwords. Please mention your <code className="font-mono text-primary font-bold">CX-NAME-xxxx</code> ID in correspondence.
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg relative">
            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-2">
              Send Us a Message
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Fill out the form below and our numerology audit team will respond to your email directly.
            </p>
            
            {success && (
              <div className="mb-6 p-4 bg-success/15 border border-success/30 text-success rounded-xl text-sm flex items-center space-x-3 animate-pulse-subtle">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <div>
                  <strong className="font-semibold block">Query Successfully Submitted!</strong>
                  <span>Your request has been logged. Our support team will review it within 2 hours.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-xs"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-xs"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-xs font-mono"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Customer ID <span className="text-xs font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={cxId}
                    onChange={(e) => setCxId(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-xs font-mono uppercase"
                    placeholder="CX-NAME-xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">How can we help you?</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-all shadow-xs"
                  placeholder="Describe your question regarding your Lo Shu Grid report or billing..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-6 bg-linear-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl font-bold transition-all shadow-lg focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Query</span>
                    <Send className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
