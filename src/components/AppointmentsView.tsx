import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, X, Plus, DollarSign, Filter, Stethoscope, Lock, ShieldAlert } from 'lucide-react';
import { Appointment, UserRole } from '../types.ts';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onBookNewAppointment: (apt: Partial<Appointment>) => void;
  onVerifyCompletedRevenue: (appointmentId: string, verifiedAmount: number) => void;
  userRole?: UserRole;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onBookNewAppointment,
  onVerifyCompletedRevenue,
  userRole = 'OWNER',
}) => {
  const isViewer = userRole === 'VIEWER';
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [completingApt, setCompletingApt] = useState<Appointment | null>(null);
  const [verifiedRevenueInput, setVerifiedRevenueInput] = useState<number>(0);

  // New Appointment Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [dentist, setDentist] = useState('Dr. Michael Chen, DDS');
  const [service, setService] = useState('Dental Implants (Single Tooth)');
  const [date, setDate] = useState('2026-09-17');
  const [time, setTime] = useState('10:00 AM');
  const [estimatedValue, setEstimatedValue] = useState<number>(2500);

  const handleOpenCompleteModal = (apt: Appointment) => {
    setCompletingApt(apt);
    setVerifiedRevenueInput(apt.estimatedValue);
  };

  const handleConfirmCompletion = () => {
    if (!completingApt) return;
    onVerifyCompletedRevenue(completingApt.id, verifiedRevenueInput);
    setCompletingApt(null);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    onBookNewAppointment({
      patientName,
      patientPhone,
      dentist,
      service,
      date,
      time,
      status: 'confirmed',
      estimatedValue,
      verifiedRevenue: 0,
      source: 'staff_entry',
    });

    setIsBookModalOpen(false);
    setPatientName('');
    setPatientPhone('');
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Appointments & Practice Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed operatory chair slots scheduled by 24/7 AI Receptionist and practice staff.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {(['month', 'week', 'day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-colors ${
                  viewMode === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {m} View
              </button>
            ))}
          </div>

          <button
            onClick={() => !isViewer && setIsBookModalOpen(true)}
            disabled={isViewer}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors ${
              isViewer
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                : 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
            }`}
            title={isViewer ? 'Read-only access: Staff or Admin role required to book appointments' : 'Book Chair Slot'}
          >
            {isViewer ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isViewer ? 'Read-Only (Viewer)' : 'Book Chair Slot'}</span>
          </button>
        </div>
      </div>

      {isViewer && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>You are logged in as a <strong>Read-Only Viewer</strong>. Scheduling changes, revenue verification, and calendar modifications are disabled.</span>
        </div>
      )}

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Scheduled Dental Appointments ({appointments.length})</span>
          <span className="text-[11px] text-slate-500">Timezone: America/Chicago (CT)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {appointments.map((apt, idx) => (
            <div key={`${apt.id || 'apt'}-${idx}`} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-900">{apt.patientName}</h3>
                    <span className="text-xs text-slate-400">({apt.patientPhone})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      apt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'confirmed' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">{apt.service}</span>
                    <span>•</span>
                    <span>{apt.dentist}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-800">{apt.date} at {apt.time}</span>
                  </div>
                </div>
              </div>

              {/* Value & Completion Attribution */}
              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Value</span>
                  <span className="text-base font-extrabold text-slate-900">${(apt.estimatedValue || 0).toLocaleString()}</span>
                </div>

                {apt.status !== 'completed' ? (
                  isViewer ? (
                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold flex items-center space-x-1 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pending (View Only)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenCompleteModal(apt)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Mark appointment as completed and verify recovered revenue"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Complete & Verify Revenue</span>
                    </button>
                  )
                ) : (
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>${(apt.verifiedRevenue ?? apt.estimatedValue ?? 0).toLocaleString()} Verified</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Book Chair Slot Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-bold text-white">Schedule New Dental Appointment</h4>
              </div>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Miller"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. (555) 304-9912"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dental Procedure</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Dental Implants (Single Tooth)">Dental Implants (Single Tooth) - $2,500</option>
                  <option value="Invisalign Clear Aligners">Invisalign Clear Aligners - $3,800</option>
                  <option value="Laser Teeth Whitening">Laser Teeth Whitening - $299</option>
                  <option value="Comprehensive Exam & Cleaning">Comprehensive Exam & Cleaning - $120</option>
                  <option value="Emergency Pain Relief">Emergency Pain Relief - $150</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2 -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete & Verify Revenue Modal */}
      {completingApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <h4 className="text-sm font-bold text-white">Verify Recovered Practice Revenue</h4>
              </div>
              <button onClick={() => setCompletingApt(null)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                Confirm clinical completion for <strong>{completingApt.patientName}</strong> ({completingApt.service}).
                Enter the final billed amount to attribute to <strong>Verified Recovered Revenue</strong>.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Final Billed Revenue ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    value={verifiedRevenueInput}
                    onChange={(e) => setVerifiedRevenueInput(Number(e.target.value))}
                    className="w-full text-base pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                This will officially increase your practice's Verified Recovered Revenue on your dashboard.
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                onClick={() => setCompletingApt(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Verify & Attribute Revenue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
