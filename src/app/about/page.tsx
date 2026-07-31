import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Compass, ShieldCheck, Sparkles, BookOpen, Cpu, Lock, Layers, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-300">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 text-primary dark:text-primary-light text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>5-Layer Lo Shu &amp; Vedic Numerology Engine</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-slate-900 dark:text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-secondary">AstroMobile</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Fusing ancient 3x3 Lo Shu magic square mathematics with modern high-throughput Celery analytical engines to decode your personal digital vibration.
          </p>
        </div>

        {/* Philosophy & Magic Square Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
              <span>● THE FREQUENCY OF DIGITAL IDENTIFIERS</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Why Your Mobile Number Governs Your Fortune
            </h2>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
              Numbers are not merely placeholder quantities; they represent archetypal energetic frequencies that influence behavior, choice patterns, and fortune. The mobile number you hold is one of the most high-frequency digital identifiers you carry—vibrating daily with every text, call, business deal, and connection.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              By mapping your birth date coordinates (Mulank &amp; Bhagyank) against your mobile number&apos;s composite planes, we uncover compatibility indexes, strengths, missing numeric planes, and actionable remedies.
            </p>
          </div>

          <div className="md:col-span-5 glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-lg bg-linear-to-b from-primary/5 via-transparent to-secondary/5">
            <div className="flex items-center space-x-3 text-primary dark:text-primary-light">
              <div className="p-3 bg-primary/20 rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Lo Shu Grid System</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ancient 3x3 Magic Square</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Our calculation engine derives from the traditional Chinese 3x3 magic square. The nine sectors correspond directly to Wealth (4), Fame (9), Marriage (2), Family (3), Health (5), Children (7), Knowledge (8), Career (1), and Helpful People (6).
            </p>
            <div className="grid grid-cols-3 gap-2 py-2 max-w-xs mx-auto">
              <div className="p-3 rounded-xl bg-primary/15 border border-primary/25 text-center font-mono font-bold text-slate-900 dark:text-white">4</div>
              <div className="p-3 rounded-xl bg-secondary/15 border border-secondary/25 text-center font-mono font-bold text-slate-900 dark:text-white">9</div>
              <div className="p-3 rounded-xl bg-primary/15 border border-primary/25 text-center font-mono font-bold text-slate-900 dark:text-white">2</div>
              <div className="p-3 rounded-xl bg-secondary/15 border border-secondary/25 text-center font-mono font-bold text-slate-900 dark:text-white">3</div>
              <div className="p-3 rounded-xl bg-success/20 border border-success/30 text-center font-mono font-extrabold text-success">5</div>
              <div className="p-3 rounded-xl bg-secondary/15 border border-secondary/25 text-center font-mono font-bold text-slate-900 dark:text-white">7</div>
              <div className="p-3 rounded-xl bg-primary/15 border border-primary/25 text-center font-mono font-bold text-slate-900 dark:text-white">8</div>
              <div className="p-3 rounded-xl bg-secondary/15 border border-secondary/25 text-center font-mono font-bold text-slate-900 dark:text-white">1</div>
              <div className="p-3 rounded-xl bg-primary/15 border border-primary/25 text-center font-mono font-bold text-slate-900 dark:text-white">6</div>
            </div>
          </div>
        </div>

        {/* Enterprise Name-Only CX ID Architecture Section */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-primary/30 dark:border-primary/40 shadow-xl space-y-8 bg-linear-to-r from-primary/10 via-indigo-500/10 to-secondary/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3.5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                  Professional Name-Only CX ID Security Architecture
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Strict GDPR, zero raw UUID exposure, and isolated customer portal tokenization.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold shrink-0">
              <Lock className="h-3.5 w-3.5" />
              <span>ENTERPRISE GRADE COMPLIANCE</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-primary dark:text-primary-light">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">Zero Raw UUID Exposure</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                In strict adherence to enterprise security rules, administrative staff and raw primary key UUIDs are excluded from customer-facing URLs and APIs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-primary dark:text-primary-light">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">Name-Only Identifier Format</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Every customer is assigned a clean, human-readable identifier formatted as <code className="font-mono font-bold text-primary dark:text-primary-light">CX-NAME-xxxx</code> (e.g., CX-RAHUL-4829) for secure portal synchronization.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-primary dark:text-primary-light">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">1:1 CRM &amp; Portal Sync</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your portal login binds 1:1 with Astro CRM IoT via secure JWT tokens, ensuring your Lo Shu Grid reports and orders stay synchronized across all devices.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-8 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-primary/40 transition-colors shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-2xl text-primary dark:text-primary-light">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Precision Vedic Engine</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dual-engine verification mapping Chaldean and Pythagorean compound numbers, pairs, and planes with zero approximation errors.
            </p>
          </div>

          <div className="p-8 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-secondary/40 transition-colors shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-secondary/10 dark:bg-secondary/20 rounded-2xl text-secondary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Practical Remedies</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Actionable advice on planetary color codes, wallpaper alignments, lucky name frequencies, and numeric remedies.
            </p>
          </div>

          <div className="p-8 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-success/40 transition-colors shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-success/10 dark:bg-success/20 rounded-2xl text-success">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Privacy Safeguarded</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Secure client access tokens ensure reports are viewable only by verified recipients inside your personalized vault.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center space-y-6 pt-4">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Ready to Discover Your Cosmic Frequency?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Get your comprehensive 5-layer mobile numerology analysis and Lo Shu Grid report instantly.
          </p>
          <div>
            <Link
              href="/#purchase-section"
              className="inline-flex items-center justify-center py-3.5 px-8 bg-linear-to-r from-primary to-secondary hover:opacity-90 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <span>Calculate My Numbers Now</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
