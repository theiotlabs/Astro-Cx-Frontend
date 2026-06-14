import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Compass, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            About AstroMobile
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Fusing ancient Lo Shu numerology grid formulas with modern SaaS analytical tools to reveal your personal cosmic frequency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-3xl">Our Philosophy</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Numbers are not just placeholder quantities; they represent energetic frequencies that influence behavior, choice patterns, and fortune. The mobile number you hold is one of the most high-frequency digital identifiers you carry, vibrating daily with every text, call, and connection.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              By mapping your birth date (Mulank & Bhagyank) against your mobile number&apos;s composite frequencies, we uncover compatibility indexes, strengths, missing planes, and critical remedies.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center space-x-3 text-primary dark:text-primary-light">
              <BookOpen className="h-6 w-6" />
              <h3 className="font-heading font-semibold text-lg">Lo Shu Grid System</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Our calculations derive from the traditional Chinese 3x3 magic square. The nine sectors correspond directly to wealth, fame, relationships, family, health, children, knowledge, career, and helpful people. Our engine compiles these details instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-y-3 p-6 glass-card rounded-xl">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full text-primary">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl">Precision Engine</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Dual-engine verification mapping compound numbers, pairs, and planes correctly.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 glass-card rounded-xl">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-secondary/10 rounded-full text-secondary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl">Practical Remedies</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Actionable advice on color codes, wallpaper alignments, and numeric elements.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 glass-card rounded-xl">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-success/10 rounded-full text-success">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl">Privacy Safeguarded</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Secure client access tokens ensure reports are viewable only by verified recipients.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
