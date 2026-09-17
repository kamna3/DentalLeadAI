import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';
import { DashboardMetrics } from '../types.ts';

interface AnalyticsViewProps {
  metrics: DashboardMetrics;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ metrics }) => {
  const procedureBreakdown = [
    { name: 'Dental Implants', revenue: 7500, count: 3, share: '41%' },
    { name: 'Invisalign & Clear Aligners', revenue: 7600, count: 2, share: '41%' },
    { name: 'Laser Teeth Whitening', revenue: 897, count: 3, share: '5%' },
    { name: 'Root Canal & Crown', revenue: 1400, count: 1, share: '8%' },
    { name: 'Emergency Pain Care', revenue: 1023, count: 5, share: '5%' },
  ];

  const leadSources = [
    { name: 'Website Chat Widget', count: 26, pct: '55%' },
    { name: 'Google Ads Landing Page', count: 12, pct: '25%' },
    { name: 'Instagram DM & Link', count: 6, pct: '13%' },
    { name: 'Missed Call Recovery', count: 3, pct: '7%' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Practice Analytics & Conversion
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed metrics on recovered dental revenue, conversion rates, and inquiry sources.
        </p>
      </div>

      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Total Recovered Revenue</span>
          <p className="text-3xl font-extrabold text-emerald-600 font-display mt-2">${(metrics?.revenueRecovered || 0).toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">${(metrics?.verifiedRevenue || 0).toLocaleString()} verified in cash</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Average AI Response Time</span>
          <p className="text-3xl font-extrabold text-sky-600 font-display mt-2">{metrics.averageResponseTimeSeconds}s</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">99.8% within 3 seconds</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Inquiry to Booking Rate</span>
          <p className="text-3xl font-extrabold text-indigo-600 font-display mt-2">{metrics.conversionRate}%</p>
          <span className="text-[11px] text-indigo-500 font-semibold mt-1 block">+14% over baseline</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Chair Slots Filled</span>
          <p className="text-3xl font-extrabold text-purple-600 font-display mt-2">{metrics.appointmentsBooked}</p>
          <span className="text-[11px] text-purple-500 font-semibold mt-1 block">14 directly recovered</span>
        </div>
      </div>

      {/* Breakdown Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue by Procedure */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Recovered Revenue by Dental Procedure</h3>
          <p className="text-xs text-slate-500">Implants and clear aligners account for 82% of all recovered revenue.</p>

          <div className="space-y-3 pt-2">
            {procedureBreakdown.map((proc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{proc.name} ({proc.count} appointments)</span>
                  <span className="text-emerald-600">${(proc.revenue || 0).toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full"
                    style={{ width: proc.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Ingestion Channels */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Lead Inbound Channels</h3>
          <p className="text-xs text-slate-500">Distribution of patient inquiries handled by AI.</p>

          <div className="space-y-3 pt-2">
            {leadSources.map((src, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{src.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">{src.count} leads</span>
                  <span className="font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full text-[10px]">{src.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
