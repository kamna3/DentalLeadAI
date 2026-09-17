import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Flame,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ArrowRight,
  Bot,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Lead } from '../types.ts';

interface LeadsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onBookLead: (lead: Lead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ leads, onSelectLead, onBookLead }) => {
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLeadDrawer, setSelectedLeadDrawer] = useState<Lead | null>(null);

  const filteredLeads = (leads || []).filter((lead) => {
    const s = (search || '').trim().toLowerCase();
    const matchesSearch =
      !s ||
      (lead.name || '').toLowerCase().includes(s) ||
      (lead.serviceInterest || '').toLowerCase().includes(s) ||
      (lead.phone || '').includes(s);
    if (!matchesSearch) return false;

    if (scoreFilter === 'hot' && lead.leadScore < 80) return false;
    if (scoreFilter === 'warm' && (lead.leadScore < 50 || lead.leadScore >= 80)) return false;
    if (scoreFilter === 'cold' && lead.leadScore >= 50) return false;

    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Patient Leads & Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by AI scoring based on treatment value, urgency, and booking readiness.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600">Total Leads: {leads.length}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient, phone, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Score Selector */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {[
              { id: 'all', label: 'All Scores' },
              { id: 'hot', label: '🔥 HOT (80+)' },
              { id: 'warm', label: 'WARM (50-79)' },
              { id: 'cold', label: 'COLD (<50)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setScoreFilter(s.id as any)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  scoreFilter === s.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="booked">Booked</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Patient Name</th>
                <th className="px-4 py-3">Treatment Interest</th>
                <th className="px-4 py-3">AI Lead Score</th>
                <th className="px-4 py-3">Est. Value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLeadDrawer(lead)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{lead.name}</div>
                    <div className="text-[11px] text-slate-400">{lead.phone}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-800">{lead.serviceInterest}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        lead.leadScore >= 80
                          ? 'bg-amber-100 text-amber-800'
                          : lead.leadScore >= 50
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lead.leadScore}/100 {lead.leadScore >= 80 ? 'HOT' : lead.leadScore >= 50 ? 'WARM' : 'COLD'}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    ${(lead.estimatedValue || 0).toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      lead.status === 'converted' ? 'bg-emerald-100 text-emerald-800' :
                      lead.status === 'booked' ? 'bg-sky-100 text-sky-800' :
                      lead.status === 'qualified' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-slate-500 capitalize">
                    {lead.source.replace('_', ' ')}
                  </td>

                  <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onBookLead(lead)}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Book Slot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {selectedLeadDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900 font-display">Lead Breakdown & AI Score</h3>
                <button
                  onClick={() => setSelectedLeadDrawer(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center text-lg">
                    {selectedLeadDrawer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{selectedLeadDrawer.name}</h4>
                    <p className="text-xs text-slate-500">{selectedLeadDrawer.phone}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Interest:</span>
                    <span className="font-bold text-slate-900">{selectedLeadDrawer.serviceInterest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Value:</span>
                    <span className="font-bold text-emerald-600">${(selectedLeadDrawer.estimatedValue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Source:</span>
                    <span className="font-semibold text-slate-800 capitalize">{selectedLeadDrawer.source ? selectedLeadDrawer.source.replace('_', ' ') : 'Web'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Captured At:</span>
                    <span className="text-slate-700">{selectedLeadDrawer.createdAt ? new Date(selectedLeadDrawer.createdAt).toLocaleString() : 'Recently'}</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-1">AI Lead Scoring Rationale</h5>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    Lead Score: <strong>{selectedLeadDrawer.leadScore}/100</strong>. Evaluated high intent for high-margin procedure ({selectedLeadDrawer.serviceInterest}) with active scheduling inquiries.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  onBookLead(selectedLeadDrawer);
                  setSelectedLeadDrawer(null);
                }}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Schedule Appointment Now
              </button>
              <button
                onClick={() => setSelectedLeadDrawer(null)}
                className="w-full py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
