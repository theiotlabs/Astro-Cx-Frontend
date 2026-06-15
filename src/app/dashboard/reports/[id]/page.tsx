'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Grid, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  FileText, 
  Download, 
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Activity,
  Heart,
  CheckCircle,
  Printer,
  Loader2
} from 'lucide-react';
import { reportService } from '../../../../services/reports';
import useAuthStore from '../../../../store/useAuthStore';
import useThemeStore from '../../../../store/useThemeStore';
import api from '../../../../services/api';
import { API_BASE_URL } from '../../../../constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

const loShuLayout = [
  { digit: 4, name: 'Wood / Wealth', element: 'wood', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' },
  { digit: 9, name: 'Fire / Fame', element: 'fire', color: 'bg-rose-500/10 border-rose-500/30 text-rose-500' },
  { digit: 2, name: 'Earth / Relationship', element: 'earth', color: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' },
  { digit: 3, name: 'Wood / Family', element: 'wood', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' },
  { digit: 5, name: 'Earth / Health', element: 'earth', color: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' },
  { digit: 7, name: 'Metal / Children', element: 'metal', color: 'bg-purple-500/10 border-purple-500/30 text-purple-500' },
  { digit: 8, name: 'Earth / Knowledge', element: 'earth', color: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' },
  { digit: 1, name: 'Water / Career', element: 'water', color: 'bg-sky-500/10 border-sky-500/30 text-sky-500' },
  { digit: 6, name: 'Metal / Helpers', element: 'metal', color: 'bg-purple-500/10 border-purple-500/30 text-purple-500' }
];

const planesList = [
  { name: 'Mental Plane (4-9-2)', digits: [4, 9, 2], desc: 'Intellect, memory, and analytical skills.' },
  { name: 'Emotional Plane (3-5-7)', digits: [3, 5, 7], desc: 'Intuition, feelings, and empathy.' },
  { name: 'Practical Plane (8-1-6)', digits: [8, 1, 6], desc: 'Execution, hard work, and business sense.' },
  { name: 'Thought Plane (4-3-8)', digits: [4, 3, 8], desc: 'Planning, structure, and vision.' },
  { name: 'Will Plane (9-5-1)', digits: [9, 5, 1], desc: 'Determination, stamina, and drive.' },
  { name: 'Action Plane (2-7-6)', digits: [2, 7, 6], desc: 'Physical speed, speech, and execution.' },
  { name: 'Success Plane (4-5-6)', digits: [4, 5, 6], desc: 'Auspicious fortune and general balance.' },
  { name: 'Spiritual Plane (2-5-8)', digits: [2, 5, 8], desc: 'Inner peace, philosophy, and spiritual connection.' }
];

// Compatibility lookup
const compatibilityMatrix: Record<number, { friends: number[], enemies: number[], neutral: number[] }> = {
  1: { friends: [1, 2, 3, 9], enemies: [8], neutral: [4, 5, 6, 7] },
  2: { friends: [1, 2, 3, 9], enemies: [8], neutral: [4, 5, 6, 7] },
  3: { friends: [1, 2, 3, 9], enemies: [5, 6], neutral: [4, 7, 8] },
  4: { friends: [1, 2, 3, 9], enemies: [8], neutral: [4, 5, 6, 7] },
  5: { friends: [1, 6, 5], enemies: [2, 8], neutral: [3, 4, 7, 9] },
  6: { friends: [5, 6, 8], enemies: [3, 9], neutral: [1, 2, 4, 7] },
  7: { friends: [1, 2, 3, 9], enemies: [8], neutral: [4, 5, 6, 7] },
  8: { friends: [5, 6, 8], enemies: [1, 2, 4, 9], neutral: [3, 7] },
  9: { friends: [1, 2, 3, 7], enemies: [6], neutral: [4, 5, 8] }
};

const luckyDaysMap: Record<number, string[]> = {
  1: ["Sunday", "Monday"], 2: ["Monday", "Friday", "Sunday"], 3: ["Thursday", "Friday", "Tuesday"],
  4: ["Sunday", "Monday", "Saturday"], 5: ["Wednesday", "Friday"], 6: ["Friday", "Thursday", "Tuesday"],
  7: ["Monday", "Sunday", "Wednesday"], 8: ["Saturday", "Friday"], 9: ["Tuesday", "Thursday", "Friday"]
};

const missingNumberRemedies: Record<number, string> = {
  1: "Drink water from copper vessels, wear shades of blue, and respect father/mentors.",
  2: "Wear a silver bracelet, drink water in a silver glass, and respect mother/females.",
  3: "Respect teachers/elders, wear yellow threads on the wrist, or wear yellow clothes.",
  4: "Keep a wooden pen with you, wear green clothes or use green accessories.",
  5: "Feed green grass to cows on Wednesdays, use brass cookware, and keep a green plant in the center of your home.",
  6: "Wear perfume regularly, use white/cream colored handkerchiefs, and help the needy.",
  7: "Wear a cat's eye stone, feed street dogs, and avoid grey/black colors.",
  8: "Help construction laborers, light a mustard oil lamp under a Peepal tree on Saturdays.",
  9: "Keep a red handkerchief, avoid arguments with brothers, and donate red items."
};

export default function ReportDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { theme } = useThemeStore();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'pdf'>('interactive');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await reportService.getReportDetail(id);
        setReport(data);
      } catch (err: any) {
        console.error('Failed to load report detail:', err);
        setError('Report not found or permission denied.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleDownload = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      const response = await api.get(`/api/mobile-numerology/reports/${report.id}/download/`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AstroMobile_Report_${report.mobile_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not download report PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Assembling Lo Shu grids...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-6 max-w-md mx-auto py-12 text-center">
        <AlertCircle className="h-12 w-12 text-danger mx-auto" />
        <h2 className="font-heading font-bold text-2xl">Unauthorized or Not Found</h2>
        <p className="text-sm text-slate-500">
          This report does not exist or you do not have permission to view it. Please check your credentials.
        </p>
        <Link href="/dashboard/reports" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Reports</span>
        </Link>
      </div>
    );
  }

  // Parse calculations grid
  const calcData = report.report_data || {};
  const loshuGrid = calcData.loshu_grid || {};
  
  // Build cell frequency helper
  const getCellText = (digit: number) => {
    const freq = loshuGrid[digit.toString()] || 0;
    if (freq === 0) return '—';
    return digit.toString().repeat(freq);
  };

  // Get planes scores
  const getPlaneScore = (digits: number[]) => {
    let presentCount = 0;
    digits.forEach(d => {
      if ((loshuGrid[d.toString()] || 0) > 0) {
        presentCount++;
      }
    });
    return presentCount;
  };

  const getPlaneStatus = (score: number) => {
    if (score === 3) return { label: 'Strong', color: 'text-success bg-success/10 border-success/20' };
    if (score === 2) return { label: 'Balanced', color: 'text-primary bg-primary/10 border-primary/20' };
    if (score === 1) return { label: 'Weak', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Missing', color: 'text-danger bg-danger/10 border-danger/20' };
  };

  // Get compatibility details
  const mulank = report.mulank || 1;
  const compat = compatibilityMatrix[mulank] || { friends: [], enemies: [], neutral: [] };
  const luckyDays = luckyDaysMap[mulank] || ["Sunday"];

  // Missing numbers
  const missingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    d => (loshuGrid[d.toString()] || 0) === 0
  );

  return (
    <div className="space-y-8">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Reports</span>
        </Link>
        <div className="flex items-center space-x-3 self-end">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center space-x-1.5 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl text-sm shadow transition-all disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Title & Tabs Toggle */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl">Report for {report.mobile_number}</h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Compiled on {new Date(report.created_at).toLocaleDateString()} &bull; Order ID: {report.order_short_id || report.order_id?.substring(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-200/60 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-300/30 dark:border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'interactive' 
                ? 'bg-white dark:bg-slate-900 text-primary dark:text-primary-light shadow' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Interactive Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'pdf' 
                ? 'bg-white dark:bg-slate-900 text-primary dark:text-primary-light shadow' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Generated PDF Report
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'interactive' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Interactive Lo Shu & Summary */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Executive Summary Widget */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse-subtle" />
                <span>Executive Summary</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center space-y-1">
                  <span className="block text-[10px] text-primary font-semibold uppercase">Mulank (Birth)</span>
                  <span className="text-3xl font-extrabold">{report.mulank}</span>
                </div>
                <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-center space-y-1">
                  <span className="block text-[10px] text-secondary font-semibold uppercase">Bhagyank (Destiny)</span>
                  <span className="text-3xl font-extrabold">{report.bhagyank}</span>
                </div>
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-center space-y-1">
                  <span className="block text-[10px] text-success font-semibold uppercase">Mobile Total</span>
                  <span className="text-3xl font-extrabold">{report.mobile_total}</span>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center space-y-1">
                  <span className="block text-[10px] text-primary font-semibold uppercase">Kua Number</span>
                  <span className="text-3xl font-extrabold">{calcData.kua || '—'}</span>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Compatibility Verdict</span>
                  <h4 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                    Harmonious Alignment
                  </h4>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Ecosystem Score</span>
                  <span className="text-3xl font-black text-primary dark:text-primary-light">85 / 100</span>
                </div>
              </div>
            </div>

            {/* Client-Side Lo Shu Grid */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
                  <Grid className="h-5 w-5 text-secondary" />
                  <span>3x3 Lo Shu Magic Grid</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Shows present digits & repetition count</span>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto aspect-square w-full">
                {loShuLayout.map((cell) => {
                  const present = (loshuGrid[cell.digit.toString()] || 0) > 0;
                  return (
                    <div
                      key={cell.digit}
                      className={`loshu-cell border ${
                        present 
                          ? cell.color + ' shadow-md scale-102 font-black border-2' 
                          : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900 border-dashed text-slate-400/50 dark:text-slate-800'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl tracking-wider">{getCellText(cell.digit)}</span>
                        <span className="text-[9px] font-semibold mt-1 opacity-70 uppercase truncate max-w-full px-1">{cell.name.split(' / ')[1]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Planes Completion Analysis */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
                <Activity className="h-5 w-5 text-success animate-pulse-subtle" />
                <span>Cosmic Planes & Arrows Completion</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {planesList.map((plane) => {
                  const score = getPlaneScore(plane.digits);
                  const pct = Math.round((score / 3) * 100);
                  const status = getPlaneStatus(score);
                  return (
                    <div key={plane.name} className="p-4 bg-slate-100/80 dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h4 className="font-semibold text-sm">{plane.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{plane.desc}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                          <span>Progress</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              score === 3 ? 'bg-success' : score === 2 ? 'bg-primary' : score === 1 ? 'bg-amber-500' : 'bg-danger'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Compatibility, remedies, and detox */}
          <div className="space-y-8">
            
            {/* Compatibility Matrix */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
                <Heart className="h-5 w-5 text-danger animate-pulse-subtle" />
                <span>Compatibility Guide</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs text-slate-500 font-semibold uppercase mb-1">Friendly Numbers</span>
                  <div className="flex flex-wrap gap-1.5">
                    {compat.friends.map(n => (
                      <span key={n} className="px-2.5 py-1 bg-success/10 text-success border border-success/20 rounded-lg font-bold">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs text-slate-500 font-semibold uppercase mb-1">Transformative / Neutral</span>
                  <div className="flex flex-wrap gap-1.5">
                    {compat.neutral.map(n => (
                      <span key={n} className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-slate-700 rounded-lg font-bold">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs text-slate-500 font-semibold uppercase mb-1">Incompatible Numbers</span>
                  <div className="flex flex-wrap gap-1.5">
                    {compat.enemies.map(n => (
                      <span key={n} className="px-2.5 py-1 bg-danger/10 text-danger border border-danger/20 rounded-lg font-bold">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Lucky Days:</span>
                    <p className="font-medium">{luckyDays.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Remedies & Mobile Detox */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                <span>Ecosystem Remedies</span>
              </h3>

              <div className="space-y-4">
                {missingNumbers.length > 0 ? (
                  missingNumbers.map(n => (
                    <div key={n} className="space-y-1 text-sm border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-b-0 last:pb-0">
                      <span className="font-bold text-xs text-amber-500 uppercase">Missing Number {n} Remedy:</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {missingNumberRemedies[n] || 'Respect elders and maintain healthy routines.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-success/10 text-success rounded-xl flex items-center space-x-2 text-xs">
                    <CheckCircle className="h-4 w-4" />
                    <span>No missing numbers! Your grid is fully complete.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* PDF Preview Tab */
        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-[75vh] flex flex-col relative">
          <div className="p-4 bg-slate-100 dark:bg-dark-card border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
            <span className="text-sm font-semibold">Embedded Premium HTML Report Preview</span>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center space-x-1.5 py-1.5 px-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg text-xs transition-all disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>Download PDF</span>
            </button>
          </div>

          <iframe
            src={`${API_BASE_URL}/api/mobile-numerology/reports/${report.id}/preview/?theme=${theme}`}
            className="flex-1 w-full border-none bg-white dark:bg-dark-bg"
            title="Premium Report Preview"
          />
        </div>
      )}

    </div>
  );
}
