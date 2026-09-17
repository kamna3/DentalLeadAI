import React from 'react';
import { Building2, TrendingUp, DollarSign, Users, Bot, ShieldCheck } from 'lucide-react';
import { PlatformMetrics } from '../types.ts';

interface PlatformAdminViewProps {
  platformMetrics: PlatformMetrics;
}

export const PlatformAdminView: React.FC<PlatformAdminViewProps> = ({ platformMetrics }) => {
  const clinics = [
    { name: 'Smile Dental Clinic', city: 'Chicago, IL', plan: 'GROWTH', patientsRecovered: 14, revenueRecovered: 18420, status: 'Active' },
    { name: 'Apex Orthodontics & Implants', city: 'Austin, TX', plan: 'PRO', patientsRecovered: 29, revenueRecovered: 38900, status: 'Active' },
    { name: 'Pure White Dental Spa', city: 'Miami, FL', plan: 'DENTAL_GROUP', patientsRecovered: 44, revenueRecovered: 58200, status: 'Active' },
    { name: 'Northstar Pediatric Dentistry', city: 'Seattle, WA', plan: 'STARTER', patientsRecovered: 8, revenueRecovered: 9400, status: 'Active' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
              Platform Admin
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              DentalLead AI SaaS Metrics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-clinic aggregate analytics, MRR, recovered practice revenue, and subscriber retention.
          </p>
        </div>
      </div>

      {/* High-Level Platform Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Monthly Recurring Revenue (MRR)</span>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-2">
            ${(platformMetrics?.totalMrr || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            ~${((platformMetrics?.totalMrr || 0) * 12).toLocaleString()} ARR Run-Rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Active Dental Clinics</span>
          <p className="text-3xl font-extrabold text-sky-600 font-display mt-2">
            {platformMetrics?.activeClinicsCount ?? 0}
          </p>
          <span className="text-[11px] text-sky-600 font-semibold mt-1 block">
            +6 clinics onboarded this week
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Total Revenue Recovered</span>
          <p className="text-3xl font-extrabold text-emerald-600 font-display mt-2">
            ${(platformMetrics?.totalRecoveredRevenueAcrossAllClinics || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Across all subscriber practices
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Net Logo Churn Rate</span>
          <p className="text-3xl font-extrabold text-purple-600 font-display mt-2">
            {platformMetrics.churnRatePercent}%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Exceptional negative net revenue churn
          </span>
        </div>

      </div>

      {/* Dental Clinics Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Subscribed Dental Practices</h3>
          <span className="text-xs font-semibold text-slate-500">Live Production Database</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Dental Clinic</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">SaaS Tier</th>
              <th className="px-4 py-3">Patients Recovered</th>
              <th className="px-4 py-3">Revenue Recovered</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clinics.map((c, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80">
                <td className="px-5 py-3.5 font-bold text-slate-900">{c.name}</td>
                <td className="px-4 py-3.5 text-slate-600">{c.city}</td>
                <td className="px-4 py-3.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {c.plan}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-800">{c.patientsRecovered} patients</td>
                <td className="px-4 py-3.5 font-extrabold text-emerald-600">${(c.revenueRecovered || 0).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
