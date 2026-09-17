import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  Send,
  MessageSquare,
  Calendar,
  X,
  Bot,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { MissedOpportunity, Lead } from '../types.ts';

interface MissedOpportunitiesViewProps {
  opportunities: MissedOpportunity[];
  onRecover: (opportunity: MissedOpportunity) => void;
  onOpenScanner: () => void;
}

export const MissedOpportunitiesView: React.FC<MissedOpportunitiesViewProps> = ({
  opportunities,
  onRecover,
  onOpenScanner,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedOppForFollowUp, setSelectedOppForFollowUp] = useState<MissedOpportunity | null>(null);
  const [generatedFollowUpText, setGeneratedFollowUpText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [followUpChannel, setFollowUpChannel] = useState<'sms' | 'email'>('sms');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filterType === 'all') return true;
    return opp.type === filterType;
  });

  const totalLostRevenue = (opportunities || []).reduce((acc, curr) => acc + (curr.status !== 'recovered' ? (curr.estimatedValue || 0) : 0), 0);
  const totalRecoveredCount = (opportunities || []).filter(o => o.status === 'recovered').length;

  const handleOpenFollowUpModal = async (opp: MissedOpportunity) => {
    setSelectedOppForFollowUp(opp);
    setIsGenerating(true);
    setGeneratedFollowUpText('Analyzing patient inquiry and drafting personalized message...');

    const firstName = opp.patientName ? opp.patientName.split(' ')[0] : 'there';
    try {
      const res = await fetch('/api/ai/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: opp.patientName || 'Patient',
          service: opp.serviceInterest || 'Dental Care',
          reason: opp.reason,
          channel: followUpChannel,
        }),
      });
      const data = await res.json();
      if (data.followUpMessage) {
        setGeneratedFollowUpText(data.followUpMessage);
      } else {
        setGeneratedFollowUpText(
          `Hi ${firstName}, this is Sarah from Smile Dental Clinic! We noticed you were interested in ${opp.serviceInterest || 'dental care'}. We have a couple of priority slots opening up this week—would you like me to hold one for you?`
        );
      }
    } catch (e) {
      setGeneratedFollowUpText(
        `Hi ${firstName}, this is Sarah from Smile Dental Clinic! We noticed you were interested in ${opp.serviceInterest || 'dental care'}. We have a couple of priority slots opening up this week—would you like me to hold one for you?`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendFollowUp = (opp: MissedOpportunity) => {
    onRecover(opp);
    setStatusMessage(`Follow-up sent to ${opp.patientName}! Opportunity marked as recovered.`);
    setSelectedOppForFollowUp(null);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-rose-800/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Revenue Recovery Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Missed Patient Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              DentalLead AI automatically isolates after-hours inquiries, abandoned bookings, and unrescheduled cancellations, letting you recover high-value patients with one click.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-right shrink-0">
            <p className="text-xs text-rose-200">Active Unrecovered Value</p>
            <p className="text-3xl font-extrabold text-white font-display mt-0.5">
              ${(totalLostRevenue || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">
              ✓ {totalRecoveredCount} patients recovered this month
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'unanswered_inquiry', label: 'Unanswered Inquiries' },
            { id: 'unbooked_lead', label: 'Unbooked Leads' },
            { id: 'cancelled_appointment', label: 'Cancelled Visits' },
            { id: 'dormant_lead', label: 'Dormant Leads' },
            { id: 'abandoned_booking', label: 'Abandoned Bookings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenScanner}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scan Practice Leaks</span>
        </button>
      </div>

      {/* Opportunities List */}
      <div className="space-y-3">
        {filteredOpportunities.map((opp) => (
          <div
            key={opp.id}
            className={`p-5 rounded-2xl border transition-all ${
              opp.status === 'recovered'
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-sm text-slate-900">{opp.patientName}</span>
                  <span className="text-xs text-slate-400">• {opp.patientPhone}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    opp.type === 'cancelled_appointment' ? 'bg-rose-100 text-rose-800' :
                    opp.type === 'unbooked_lead' ? 'bg-amber-100 text-amber-800' :
                    opp.type === 'unanswered_inquiry' ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {opp.type.replace('_', ' ')}
                  </span>
                  {opp.status === 'recovered' && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ RECOVERED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{opp.serviceInterest}: </span>
                  {opp.reason}
                </p>

                <div className="flex items-center space-x-4 text-[11px] text-slate-400">
                  <span>Last inquiry: {opp.lastInteraction ? new Date(opp.lastInteraction).toLocaleDateString() : 'Recent'}</span>
                  <span>AI Confidence: <strong className="text-slate-600">{opp.aiConfidence || 90}%</strong></span>
                </div>
              </div>

              {/* Estimated Value & Action */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right pr-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Value</span>
                  <span className="text-lg font-extrabold text-slate-900">${(opp.estimatedValue || 0).toLocaleString()}</span>
                </div>

                {opp.status !== 'recovered' ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenFollowUpModal(opp)}
                      className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5 text-sky-600" />
                      <span>AI Follow-Up</span>
                    </button>
                    <button
                      onClick={() => onRecover(opp)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recover Patient</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Appointment Recovered</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* AI Personalized Follow-Up Modal */}
      {selectedOppForFollowUp && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Personalized Patient Follow-Up</h4>
                  <p className="text-[10px] text-slate-400">Targeting {selectedOppForFollowUp.patientName} • {selectedOppForFollowUp.serviceInterest}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOppForFollowUp(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Communication Channel:</span>
                <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setFollowUpChannel('sms')}
                    className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                      followUpChannel === 'sms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    SMS Text
                  </button>
                  <button
                    onClick={() => setFollowUpChannel('email')}
                    className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                      followUpChannel === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Drafted Message (Review & Edit):
                </label>
                <textarea
                  rows={4}
                  value={generatedFollowUpText}
                  onChange={(e) => setGeneratedFollowUpText(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500 bg-slate-50 leading-relaxed font-sans"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-[11px] text-sky-800 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  Once sent, this opportunity converts directly to a scheduled chair reservation and logs to Verified Recovered Revenue.
                </span>
              </div>

            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedOppForFollowUp(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendFollowUp(selectedOppForFollowUp)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send & Recover Patient (${selectedOppForFollowUp.estimatedValue})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
