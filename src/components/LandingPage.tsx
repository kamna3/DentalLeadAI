import React, { useState } from 'react';
import {
  Stethoscope,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Calendar,
  ShieldAlert,
  Bot,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LandingPageProps {
  onStartFree: () => void;
  onTryLiveDemo: () => void;
  onOpenCalculator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onTryLiveDemo,
}) => {
  // ROI Calculator State
  const [monthlyInquiries, setMonthlyInquiries] = useState<number>(120);
  const [avgPatientValue, setAvgPatientValue] = useState<number>(1400);
  const [currentBookingRate, setCurrentBookingRate] = useState<number>(20);
  const [missedCalls, setMissedCalls] = useState<number>(35);

  // Pricing Interval Toggle
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  // Live Interactive Demo Chat State on Hero
  const [heroChatMessages, setHeroChatMessages] = useState<Array<{ sender: 'ai' | 'patient'; text: string; time: string }>>([
    { sender: 'patient', text: 'Hi, how much is teeth whitening?', time: '09:14 AM' },
    { sender: 'ai', text: 'Our professional in-office teeth whitening starts at $299 and takes just 60 minutes! Would you like me to check open appointment times?', time: '09:14 AM' },
    { sender: 'patient', text: 'Yes, what do you have this Wednesday afternoon?', time: '09:15 AM' },
    { sender: 'ai', text: 'We have Wednesday at 2:00 PM or 3:30 PM with Dr. Michael Chen. Which works best for you?', time: '09:15 AM' },
  ]);
  const [heroInputText, setHeroInputText] = useState('');
  const [isHeroTyping, setIsHeroTyping] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // ROI Calculations
  // Estimated missed inquiries = inquiries * (1 - bookingRate%) + missedCalls
  const missedOpportunities = Math.round(monthlyInquiries * ((100 - currentBookingRate) / 100) + missedCalls);
  // With DentalLead AI, recovering ~25% of missed inquiries
  const potentialRecoveredPatients = Math.max(1, Math.round(missedOpportunities * 0.25));
  const potentialRecoveredRevenue = potentialRecoveredPatients * avgPatientValue;

  const handleSendHeroMessage = async (textToSend?: string) => {
    const query = textToSend || heroInputText;
    if (!query.trim()) return;

    const newPatientMsg = {
      sender: 'patient' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHeroChatMessages(prev => [...prev, newPatientMsg]);
    setHeroInputText('');
    setIsHeroTyping(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          customerName: 'Demo Visitor',
          source: 'landing_hero',
        }),
      });
      const data = await res.json();
      if (data.aiResponse) {
        setHeroChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.aiResponse.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e) {
      setTimeout(() => {
        setHeroChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: "Great! May I have your name and best mobile number so I can lock in this appointment reservation for you right now?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 700);
    } finally {
      setIsHeroTyping(false);
    }
  };

  const faqs = [
    {
      q: 'How does DentalLead AI differ from a generic AI chatbot?',
      a: 'Generic chatbots merely chat. DentalLead AI is specifically built for dental practices to recover missed inquiries, calculate lead scores (0–100), schedule confirmed appointments, detect cancellations or abandoned bookings, and directly attribute recovered practice revenue.',
    },
    {
      q: 'Will the AI make medical or clinical claims?',
      a: 'Never. DentalLead AI operates under strict clinical boundaries: it never diagnoses oral pathologies, never prescribes pharmaceuticals, and immediately redirects acute emergency cases to your emergency line or emergency care facilities.',
    },
    {
      q: 'Can staff take over live conversations at any moment?',
      a: 'Yes! With our 1-click "Take Over" toggle, the AI pauses instantly, allowing front-desk staff to step in. You can also return the conversation to the AI at any time with complete context preserved.',
    },
    {
      q: 'How do you calculate recovered revenue?',
      a: 'We strictly distinguish between Estimated Revenue (based on procedure fee schedules) and Verified Revenue (confirmed when patient completes the appointment and billing is finalized). We never make unsubstantiated revenue claims.',
    },
    {
      q: 'What payment methods do you support for practice subscriptions?',
      a: 'We offer a flexible PaymentProvider architecture supporting Payoneer (including payment links and payment request workflows suitable for international and Pakistani business accounts) as well as major credit/debit cards.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white text-xs py-2 px-4 text-center font-medium border-b border-sky-800">
        <span className="inline-flex items-center space-x-2">
          <span className="bg-sky-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">NEW</span>
          <span>DentalLead AI 2.0: Instant 24/7 Patient Lead Recovery & Revenue Attribution Engine</span>
          <span className="text-sky-300 underline cursor-pointer font-semibold ml-2" onClick={onTryLiveDemo}>Try Live Demo →</span>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Positioning & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Specialized Dental Patient Acquisition SaaS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-display">
                Recover the Dental Patients <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                  You're Already Losing.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                DentalLead AI responds to inquiries, recovers missed leads, and books appointments for your dental practice 24/7. Turn every website visitor into a confirmed patient.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={onStartFree}
                  className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>Start Free 7-Day Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onTryLiveDemo}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <Bot className="w-4 h-4 text-sky-600" />
                  <span>Try Live Demo</span>
                </button>
              </div>

              {/* Proof Metric Chips */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">47</p>
                  <p className="text-xs text-slate-500 font-medium">Missed Opportunities Caught</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-sky-600">$12,840</p>
                  <p className="text-xs text-slate-500 font-medium">Estimated Recoverable Revenue</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-600">14</p>
                  <p className="text-xs text-slate-500 font-medium">Patients Recovered This Month</p>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Demo Chat Simulator */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden flex flex-col h-[480px]">
                
                {/* Simulator Header */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Smile Dental • AI Receptionist</h4>
                      <p className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Online 24/7 • Instant Lead Capture</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    Interactive
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
                  {heroChatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                          msg.sender === 'patient'
                            ? 'bg-sky-600 text-white rounded-br-none shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <span
                          className={`text-[9px] mt-1 block ${
                            msg.sender === 'patient' ? 'text-sky-200 text-right' : 'text-slate-400'
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isHeroTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
                  <span className="text-slate-400 font-semibold text-[10px] shrink-0">Try:</span>
                  <button
                    onClick={() => handleSendHeroMessage('How much do dental implants cost?')}
                    className="px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-sky-50 hover:text-sky-700 shrink-0 cursor-pointer font-medium"
                  >
                    Implants price?
                  </button>
                  <button
                    onClick={() => handleSendHeroMessage('I have a toothache emergency today')}
                    className="px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 shrink-0 cursor-pointer font-medium"
                  >
                    Emergency slot?
                  </button>
                  <button
                    onClick={() => handleSendHeroMessage('Wednesday at 2:00 PM works!')}
                    className="px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 shrink-0 cursor-pointer font-medium"
                  >
                    Confirm Wednesday 2pm
                  </button>
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendHeroMessage();
                  }}
                  className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    placeholder="Ask pricing, emergency slots, insurance..."
                    value={heroInputText}
                    onChange={(e) => setHeroInputText(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-500 cursor-pointer"
                  >
                    Send
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Dental Clinic Problem Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">The Hidden Practice Leak</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Dental clinics lose 35% of patient revenue to administrative friction
            </p>
            <p className="mt-3 text-sm text-slate-600">
              You invest thousands in Google Ads, Instagram, and local SEO, but patients slip through the cracks when your front desk is busy or closed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">After-Hours Inquiries</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                68% of cosmetic, implant, and emergency inquiries arrive between 6 PM and 8 AM when your office is closed. If no one answers within 5 minutes, they book with your competitor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Abandoned Booking Attempts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients ask about veneer pricing or root canal recovery, get distracted, and never finish scheduling. Traditional clinics lack automated personalized follow-up.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Unrescheduled Cancellations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a high-value implant or aligner consultation cancels, front desk staff rarely has time to follow up multiple times, leaving thousands in open chair time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* The Solution Workflow */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">Autonomous Workflow</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight font-display">
              Inquiry → AI Conversation → Lead Qualified → Appointment → Verified Revenue
            </p>
            <p className="mt-3 text-sm text-slate-400">
              A closed-loop system specifically calibrated for high-margin dental treatments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold mb-3">
                01
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Instant Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures web inquiries, ads clicks, and after-hours chat within 1.8 seconds using clinic-approved pricing and hours.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold mb-3">
                02
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Lead Scoring & Intent</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ranks leads 0–100 (HOT / WARM / COLD) based on treatment urgency and budget readiness (Implants vs Cleanings).
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold mb-3">
                03
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Autonomous Recovery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If a patient hesitates, AI generates compassionate, personalized follow-ups with instant slot reservations.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-3">
                04
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Revenue Attribution</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks appointments from initial inquiry to clinical completion, verifying exact dollars recovered for the practice.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="py-20 bg-slate-50" id="roi-calculator">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Practice Revenue Impact</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Calculate Your Practice's Recoverable Revenue
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Adjust the sliders below to estimate the monthly income your clinic can recover with automated 24/7 AI booking.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sliders Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Monthly Website & Ad Inquiries</span>
                  <span className="text-sky-600">{monthlyInquiries} inquiries</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={monthlyInquiries}
                  onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Average Patient Treatment Value</span>
                  <span className="text-sky-600">${(avgPatientValue || 0).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="4000"
                  step="100"
                  value={avgPatientValue}
                  onChange={(e) => setAvgPatientValue(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Current Booking Rate (%)</span>
                  <span className="text-sky-600">{currentBookingRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={currentBookingRate}
                  onChange={(e) => setCurrentBookingRate(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Missed Calls / After-Hours Contacts</span>
                  <span className="text-sky-600">{missedCalls} calls/mo</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={missedCalls}
                  onChange={(e) => setMissedCalls(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-6 flex flex-col justify-between">
              
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800">
                  Estimated Monthly Opportunity
                </span>
                
                <div className="mt-4">
                  <p className="text-xs text-slate-400">Potential Recovered Revenue</p>
                  <p className="text-4xl font-extrabold text-white font-display mt-1">
                    ${(potentialRecoveredRevenue || 0).toLocaleString()}
                    <span className="text-xs text-slate-400 font-normal"> /mo</span>
                  </p>
                  <p className="text-[11px] text-teal-400 mt-1">
                    ~${((potentialRecoveredRevenue || 0) * 12).toLocaleString()} annualized recovered income
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 text-[11px]">Recoverable Patients</p>
                    <p className="text-xl font-bold text-white">+{potentialRecoveredPatients} patients/mo</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Missed Inquiries</p>
                    <p className="text-xl font-bold text-amber-400">{missedOpportunities} leads</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onStartFree}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Claim Your Free 7-Day Trial
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  *Estimates based on typical dental clinic recovery rates.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Dental Specialties / Use Cases */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Specialized For Every Practice</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Calibrated for High-Value Dental Procedures
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-700">Dental Implants</span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-1">High-Ticket Consultations</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Answers bone-graft questions, qualifies budget, and books 3D CBCT consultation appointments before patients leave your site.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-700">Orthodontics & Invisalign</span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-1">Clear Aligner Conversions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explains monthly installment terms, insurance coverage, and schedules digital iTero smile scans seamlessly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">Cosmetic Dentistry</span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-1">Veneers & Whitening</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Educates patients on veneer longevity and in-office whitening promotions, turning browsing into confirmed chair time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Emergency Dental Care</span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-1">Urgent Same-Day Pain Relief</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detects urgent pain signals and reserves same-day emergency buffer slots with clinical safety disclaimers.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SaaS Pricing Plans */}
      <section className="py-20 bg-slate-50 border-t border-slate-200" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Transparent Pricing</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Plans That Pay for Themselves with a Single Recovered Patient
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Every plan includes full lead recovery, 24/7 AI Receptionist, and appointment booking.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center bg-slate-200/80 p-1 rounded-xl mt-6">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isAnnual ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isAnnual ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-300 text-amber-950 font-extrabold">SAVE 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* STARTER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">STARTER</h3>
                <p className="text-xs text-slate-500 mt-1">For single solo dental practices</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    ${isAnnual ? 39 : 49}
                  </span>
                  <span className="text-xs text-slate-500"> /month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>1 Dental Clinic</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>24/7 AI Receptionist</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>500 conversations/mo</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Lead capture & basic calendar</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Standard analytics</span></li>
                </ul>
              </div>
              <button
                onClick={onStartFree}
                className="w-full mt-8 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Start Free Trial
              </button>
            </div>

            {/* GROWTH (Popular) */}
            <div className="bg-white rounded-2xl border-2 border-sky-600 p-6 flex flex-col justify-between relative shadow-lg shadow-sky-600/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">GROWTH</h3>
                <p className="text-xs text-slate-500 mt-1">For growing cosmetic & implant clinics</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    ${isAnnual ? 119 : 149}
                  </span>
                  <span className="text-xs text-slate-500"> /month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2 font-semibold text-slate-900"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Everything in Starter</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Lead Scoring Engine (0-100)</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Missed-Lead Recovery Automation</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Personalized AI Follow-Ups</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Revenue Leak Scanner</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Unlimited team members</span></li>
                </ul>
              </div>
              <button
                onClick={onStartFree}
                className="w-full mt-8 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm cursor-pointer transition-all"
              >
                Start Free 7-Day Trial
              </button>
            </div>

            {/* PRO */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">PRO</h3>
                <p className="text-xs text-slate-500 mt-1">For multi-operatory dental practices</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    ${isAnnual ? 239 : 299}
                  </span>
                  <span className="text-xs text-slate-500"> /month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2 font-semibold text-slate-900"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Everything in Growth</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Up to 3 clinic locations</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Verified Revenue Attribution</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Advanced follow-up sequences</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>API access & webhook events</span></li>
                </ul>
              </div>
              <button
                onClick={onStartFree}
                className="w-full mt-8 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Start Free Trial
              </button>
            </div>

            {/* DENTAL GROUP */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">DENTAL GROUP</h3>
                <p className="text-xs text-slate-500 mt-1">For DSOs & dental chains</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    ${isAnnual ? 639 : 799}+
                  </span>
                  <span className="text-xs text-slate-500"> /month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2 font-semibold text-slate-900"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Everything in Pro</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Unlimited dental clinics</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Centralized DSO dashboard</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Multi-location routing</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span>Dedicated account manager</span></li>
                </ul>
              </div>
              <button
                onClick={onStartFree}
                className="w-full mt-8 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Contact Enterprise
              </button>
            </div>

          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <span>Supported payment methods: Payoneer Checkout, Payoneer Payment Links, and Major Credit Cards.</span>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Got Questions?</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left font-bold text-sm text-slate-900 flex justify-between items-center bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-sky-900 via-slate-900 to-sky-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
            Start Recovering Lost Dental Patients Today.
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop losing $10,000+ every month to unanswered questions and missed after-hours leads. Launch your 24/7 AI Dental Receptionist in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={onStartFree}
              className="px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
            >
              Start Free 7-Day Trial
            </button>
            <button
              onClick={onTryLiveDemo}
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-sm cursor-pointer transition-all"
            >
              Explore Live Demo Clinic
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-500 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-sky-500" />
            <span className="font-bold text-slate-300">DentalLead AI</span>
            <span>• Patient Acquisition & Revenue Recovery SaaS</span>
          </div>
          <p>© 2026 DentalLead AI Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
