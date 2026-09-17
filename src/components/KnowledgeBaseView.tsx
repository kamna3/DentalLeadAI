import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, DollarSign, Clock, HelpCircle, Lock, ShieldAlert } from 'lucide-react';
import { DentalService, ClinicFAQ, UserRole } from '../types.ts';

interface KnowledgeBaseViewProps {
  services: DentalService[];
  faqs: ClinicFAQ[];
  onAddService: (srv: Omit<DentalService, 'id'>) => void;
  onUpdateServicePrice: (id: string, newPrice: number) => void;
  userRole?: UserRole;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  services,
  faqs,
  onAddService,
  onUpdateServicePrice,
  userRole = 'OWNER',
}) => {
  const canEdit = userRole === 'OWNER' || userRole === 'ADMIN';
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(150);
  const [newServiceCategory, setNewServiceCategory] = useState('Cosmetic');
  const [newServiceDescription, setNewServiceDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    onAddService({
      name: newServiceName.trim(),
      category: newServiceCategory,
      startingPrice: newServicePrice,
      durationMinutes: 60,
      description: newServiceDescription || 'Professional dental procedure administered by certified clinicians.',
    });

    setIsAddServiceOpen(false);
    setNewServiceName('');
    setNewServiceDescription('');
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Practice Knowledge Base
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            The single source of truth used by DentalLead AI to answer patient inquiries and quote accurate starting fees.
          </p>
        </div>

        <button
          onClick={() => canEdit && setIsAddServiceOpen(true)}
          disabled={!canEdit}
          className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors ${
            canEdit
              ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
          }`}
          title={canEdit ? 'Add Procedure' : 'Only Practice Admins and Owners can add procedures'}
        >
          {canEdit ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{canEdit ? 'Add Procedure' : 'Add Procedure (Locked)'}</span>
        </button>
      </div>

      {!canEdit && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>You are viewing in <strong>{userRole} Mode</strong>. Editing clinic procedures, fee schedules, and insurance details requires Practice Admin or Owner permissions.</span>
        </div>
      )}

      {/* Services & Fee Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Dental Services & Fee Schedule</h3>
            <p className="text-[11px] text-slate-500">AI quotes these starting prices to inquiring patients</p>
          </div>
          <span className="text-xs font-semibold text-slate-600">{services.length} Active Procedures</span>
        </div>

        <div className="divide-y divide-slate-100">
          {services.map((srv) => (
            <div key={srv.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{srv.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {srv.category}
                  </span>
                  <span className="text-[10px] text-slate-400">~{srv.durationMinutes} min</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{srv.description}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Starting Fee</span>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      value={srv.startingPrice}
                      disabled={!canEdit}
                      onChange={(e) => canEdit && onUpdateServicePrice(srv.id, Number(e.target.value))}
                      className={`w-full text-xs pl-6 pr-2 py-1.5 border rounded-lg font-bold ${
                        canEdit
                          ? 'border-slate-300 text-slate-900 bg-white'
                          : 'border-slate-200 text-slate-500 bg-slate-100 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance & Financing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Accepted Insurance Plans</h3>
          <p className="text-xs text-slate-500">The AI confirms these insurance carriers during patient chats:</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Delta Dental PPO', 'MetLife Dental', 'Cigna DPPO', 'Aetna Dental', 'Guardian', 'Humana', 'United Healthcare'].map((ins) => (
              <span key={ins} className="px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-semibold">
                {ins}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Patient Financing Options</h3>
          <p className="text-xs text-slate-500">Helps overcome price hesitations for high-ticket implants and aligners:</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['CareCredit (0% APR for 12 mos)', 'Sunbit Flexible Monthly Payments', 'In-House Dental Membership Plan'].map((fin) => (
              <span key={fin} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                {fin}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Clinic FAQs Answered by AI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{faq.question}</p>
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Service Modal */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Add Dental Service</h4>
              <button onClick={() => setIsAddServiceOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bone Grafting for Implants"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Cosmetic">Cosmetic</option>
                    <option value="Implants">Implants</option>
                    <option value="Orthodontics">Orthodontics</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Starting Price ($)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  placeholder="Clinical procedure description..."
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2 -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Add Procedure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
