import React from 'react';
import {
  Users,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { DashboardMetrics, Lead, Appointment, MissedOpportunity } from '../types.ts';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  leads: Lead[];
  appointments: Appointment[];
  missedOpportunities: MissedOpportunity[];
  clinicName: string;
  onOpenScanner: () => void;
  onNavigate: (view: string) => void;
  onSelectLead: (lead: Lead) => void;
  onRecoverOpportunity: (opp: MissedOpportunity) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  leads,
  appointments,
  missedOpportunities,
  clinicName,
  onOpenScanner,
  onNavigate,
  onSelectLead,
  onRecoverOpportunity,
}) => {
  const hotLeads = leads.filter(l => l.leadScore >= 80).slice(0, 5);
  const todaysAppointments = appointments.slice(0, 4);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Good morning, {clinicName}
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            DentalLead AI is active 24/7. Turn every dental inquiry into a booked appointment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Practice Leak Scanner</span>
          </button>
        </div>
      </div>

      {/* TOP CORE OUTCOME METRICS (Section 2 & 24) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Patients Recovered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Patients Recovered</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 font-display">{metrics.patientsRecovered}</p>
            <p className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              <span>+4 this week</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Revenue Recovered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Revenue Recovered</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-emerald-600 font-display">
              ${(metrics?.revenueRecovered || 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              <span className="font-bold text-slate-800">${(metrics?.verifiedRevenue || 0).toLocaleString()}</span> verified • ${(metrics?.estimatedRevenue || 0).toLocaleString()} in pipeline
            </p>
          </div>
        </div>

        {/* Metric 3: New Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">New Leads</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 font-display">{metrics.newLeads}</p>
            <p className="text-[11px] text-sky-600 font-semibold mt-1">
              <span>92% qualified by AI</span>
            </p>
          </div>
        </div>

        {/* Metric 4: Appointments Booked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Appointments Booked</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 font-display">{metrics.appointmentsBooked}</p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">
              <span>7 booked after-hours</span>
            </p>
          </div>
        </div>

        {/* Metric 5: Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Booking Conversion</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-purple-600 font-display">{metrics.conversionRate}%</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">
              <span>+14% vs industry avg</span>
            </p>
          </div>
        </div>

      </div>

      {/* REVENUE OPPORTUNITIES SECTION (Section 24) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>Revenue Opportunities Detected</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-extrabold text-xs border border-rose-200">
                ${(metrics?.totalOpportunityValue || 0).toLocaleString()} Potential
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified by DentalLead AI's Missed Opportunity Engine. Click any card to launch recovery.
            </p>
          </div>
          <button
            onClick={() => onNavigate('missed-opportunities')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer flex items-center"
          >
            <span>View All ({missedOpportunities.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Opportunity Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-700 uppercase">
                  Missed Leads
                </span>
                <span className="text-xs font-bold text-slate-400">92% AI Conf.</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 mt-3">$7,800</p>
              <p className="text-xs text-slate-500 mt-0.5">12 after-hours inquiries not booked</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('missed-opportunities')}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Recover Patients</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Opportunity Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-700 uppercase">
                  Unbooked Inquiries
                </span>
                <span className="text-xs font-bold text-slate-400">88% AI Conf.</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 mt-3">$4,200</p>
              <p className="text-xs text-slate-500 mt-0.5">8 patients asked pricing & left</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('missed-opportunities')}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Recover Patients</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Opportunity Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500"></div>
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-50 text-sky-700 uppercase">
                  Cancelled Visits
                </span>
                <span className="text-xs font-bold text-slate-400">95% AI Conf.</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 mt-3">$2,100</p>
              <p className="text-xs text-slate-500 mt-0.5">4 cancellations never rescheduled</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('missed-opportunities')}
                className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Recover Patients</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Opportunity Card 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-50 text-purple-700 uppercase">
                  Dormant Leads
                </span>
                <span className="text-xs font-bold text-slate-400">84% AI Conf.</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 mt-3">$4,320</p>
              <p className="text-xs text-slate-500 mt-0.5">High-ticket implant & aligner leads</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('missed-opportunities')}
                className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Recover Patients</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Hot Leads In Queue */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>High-Value Patient Leads</span>
              </h3>
              <p className="text-[11px] text-slate-500">Sorted by AI Lead Score & treatment value</p>
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
            >
              All Leads ({leads.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {hotLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 rounded-xl px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{lead.name}</p>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        lead.leadScore >= 90
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {lead.leadScore}/100 HOT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{lead.serviceInterest}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-slate-900">${(lead.estimatedValue || 0).toLocaleString()}</p>
                  <span className={`text-[10px] font-semibold capitalize ${
                    lead.status === 'converted' ? 'text-emerald-600' :
                    lead.status === 'booked' ? 'text-sky-600' : 'text-amber-600'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Appointments & Chair Schedule */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <CalendarCheck className="w-4 h-4 text-sky-600" />
                  <span>Upcoming Appointments</span>
                </h3>
                <p className="text-[11px] text-slate-500">Confirmed chair times for this week</p>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
              >
                Calendar →
              </button>
            </div>

            <div className="space-y-3">
              {todaysAppointments.map((apt, idx) => (
                <div key={`${apt.id || 'today-apt'}-${idx}`} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{apt.patientName}</p>
                    <p className="text-[11px] text-slate-500">{apt.service}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{apt.date} at {apt.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'confirmed' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status}
                    </span>
                    <p className="text-xs font-extrabold text-slate-800 mt-1">${apt.estimatedValue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('appointments')}
              className="w-full py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Open Full Practice Calendar
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
