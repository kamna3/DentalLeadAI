import React, { useState } from 'react';
import { HeartPulse, Search, Calendar, Phone, Mail, CheckCircle2, Clock, DollarSign, ArrowRight, Download, ShieldCheck, Lock } from 'lucide-react';
import { Patient } from '../types.ts';

interface PatientsViewProps {
  patients: Patient[];
}

export const PatientsView: React.FC<PatientsViewProps> = ({ patients }) => {
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients?.[0]?.id || '');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    const headers = ['ID,Name,Phone,Email,Status,TotalSpent,LifetimeValue,AcquisitionSource,CreatedAt'];
    const rows = (patients || []).map(p => 
      `"${p.id}","${p.name}","${p.phone}","${p.email}","${p.status}",${p.totalSpent || 0},${p.lifetimeValue || 0},"${p.acquisitionSource || 'AI Receptionist'}","${p.createdAt || ''}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `patient_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const filteredPatients = (patients || []).filter((p) => {
    const s = (search || '').trim().toLowerCase();
    if (!s) return true;
    return (
      (p.name || '').toLowerCase().includes(s) ||
      (p.email || '').toLowerCase().includes(s) ||
      (p.phone || '').includes(s)
    );
  });

  const selectedPatient = (patients || []).find((p) => p.id === selectedPatientId) || patients?.[0] || null;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              Patient 360 Lifecycle
            </h1>
            <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              <span>HIPAA Compliant</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end patient journey: from initial inquiry through AI qualification, chair booking, and verified revenue.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors shrink-0"
          title="Download full patient records as CSV for OpenDental/Dentrix PMS"
        >
          <Download className="w-3.5 h-3.5 text-sky-600" />
          <span>{downloadSuccess ? 'Exported CSV!' : 'Export Roster (.CSV)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Patient Selector Table */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-sky-50/80 border-l-4 border-sky-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{p.name}</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ${(p.totalRevenue || 0).toLocaleString()} Lifetime
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.phone}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Patient 360 Lifecycle View */}
        {selectedPatient ? (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            {/* Profile Overview */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-xl shadow-sm">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">{selectedPatient.name}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1"><Phone className="w-3.5 h-3.5 text-slate-400" /><span>{selectedPatient.phone}</span></span>
                    <span>•</span>
                    <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 text-slate-400" /><span>{selectedPatient.email}</span></span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Total Practice Value</span>
                <p className="text-2xl font-extrabold text-emerald-600 font-display">
                  ${(selectedPatient.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* LIFECYCLE TIMELINE (Section 29) */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Patient Acquisition & Recovery Timeline
              </h4>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                
                {/* Step 1: Inquiry */}
                <div className="relative flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    1
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Initial Inbound Inquiry Received</span>
                      <span className="text-[10px] text-slate-400 font-normal">Website Chat Widget</span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Patient initiated after-hours chat asking about treatment pricing and doctor availability.
                    </p>
                  </div>
                </div>

                {/* Step 2: AI Response */}
                <div className="relative flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    2
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>24/7 AI Receptionist Response</span>
                      <span className="text-[10px] text-emerald-600 font-bold">1.4s response time</span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      AI greeted patient, quoted starting fee schedule, and provided open slots.
                    </p>
                  </div>
                </div>

                {/* Step 3: Qualified Lead */}
                <div className="relative flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    3
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Lead Scored as HOT (88/100)</span>
                      <span className="text-[10px] text-amber-600 font-bold">High Intent</span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Identified high readiness for restorative dental procedure.
                    </p>
                  </div>
                </div>

                {/* Step 4: Appointment */}
                <div className="relative flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    4
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Appointment Booked & Verified</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Chair Reserved</span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Appointment scheduled on calendar. Clinical completion confirmed and billed.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Notes Section */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Practice Clinical Notes</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {selectedPatient.notes}
              </p>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-7 flex items-center justify-center text-slate-400 text-xs">
            Select a patient to inspect their 360 lifecycle.
          </div>
        )}

      </div>

    </div>
  );
};
