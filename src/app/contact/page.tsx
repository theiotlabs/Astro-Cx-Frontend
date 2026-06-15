'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="font-heading font-extrabold text-4xl mb-4 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
            Get in Touch
          </h1>
          <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400">
            Have questions about your report or custom billing? Contact our support staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="font-heading font-bold text-2xl mb-6">Send Message</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-success/10 border border-success/25 text-success rounded-lg text-sm">
                Thank you! Your query has been successfully submitted. Our team will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all shadow-md focus:outline-none disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Query</span>
                    <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Details */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-3xl">Get in touch directly</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Our customer success auditors and numerologists are ready to assist you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-6 w-6 text-primary dark:text-primary-light mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-950 dark:text-slate-100">Email Us</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">support@astromobile.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-6 w-6 text-secondary mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-950 dark:text-slate-100">Call Us</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-success mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-950 dark:text-slate-100">Office</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">AstroMobile Labs, Sector 62, Noida, UP, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
