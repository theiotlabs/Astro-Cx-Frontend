import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-dark-card border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-primary dark:text-primary-light font-heading font-bold text-xl">
              <Compass className="h-6 w-6" />
              <span>AstroMobile</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Discover the numeric vibrations of your life. Get premium, in-depth reports mapping your mobile number compatibility, Lo Shu grids, and personalized remedies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">Support</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Have questions or need help?
            </p>
            <a href="mailto:support@astromobile.com" className="text-sm font-medium text-primary dark:text-primary-light hover:underline">
              support@astromobile.com
            </a>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} AstroMobile. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>GDPR Name-Only CX ID Protected • Enterprise Numerology Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
