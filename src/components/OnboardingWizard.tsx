import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, Bot, Sparkles, Stethoscope, Building, Clock, DollarSign, HelpCircle, ShieldCheck } from 'lucide-react';
import { DentalService, BusinessHours, ClinicFAQ, AISettings } from '../types.ts';

interface OnboardingWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [clinicName, setClinicName] = useState('Apex Dental & Implant Center');
  const [phone, setPhone] = useState('(555) 489-2100');
  const [email, setEmail] = useState('appointments@apexdental.com');
  const [website, setWebsite] = useState('https://apexdental.com');
  const [address, setAddress] = useState('100 Main Medical Plaza, Suite 400');
  const [city, setCity] = useState('Chicago');
  const [state, setState] = useState('IL');
  const [timezone, setTimezone] = useState('America/Chicago');

  const [selectedServices, setSelectedServices] = useState<Array<{ name: string; price: number; category: string }>>([
    { name: 'Comprehensive Exam & Cleaning', price: 120, category: 'General' },
    { name: 'Laser Teeth Whitening', price: 299, category: 'Cosmetic' },
    { name: 'Dental Implants (Single Tooth)', price: 2500, category: 'Implants' },
    { name: 'Invisalign Clear Aligners', price: 3800, category: 'Orthodontics' },
    { name: 'Emergency Pain & Tooth Relief', price: 150, category: 'Emergency' },
    { name: 'Porcelain Veneers', price: 1100, category: 'Cosmetic' },
  ]);

  const [aiTone, setAiTone] = useState<'warm_friendly' | 'professional' | 'concierge'>('warm_friendly');
  const [greeting, setGreeting] = useState('Hello! Welcome to Apex Dental. How can I assist you with your dental care today?');
  const [emergencyPhone, setEmergencyPhone] = useState('(555) 489-2100');

  const steps = [
    { num: 1, title: 'Clinic Details' },
    { num: 2, title: 'Services & Fees' },
    { num: 3, title: 'Hours & Policies' },
    { num: 4, title: 'AI Receptionist' },
    { num: 5, title: 'Ready to Launch' },
  ];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else onComplete();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        
        {/* Progress Bar Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Dental Clinic Onboarding</h3>
                <p className="text-xs text-slate-400">Step {currentStep} of 5: {steps[currentStep - 1].title}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip Setup
            </button>
          </div>

          {/* Stepper Dots */}
          <div className="grid grid-cols-5 gap-2">
            {steps.map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    s.num <= currentStep ? 'bg-sky-400' : 'bg-slate-700'
                  }`}
                />
                <p className={`text-[10px] hidden sm:block truncate ${
                  s.num === currentStep ? 'text-sky-300 font-bold' : 'text-slate-500'
                }`}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          
          {/* STEP 1: Clinic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-display">Tell us about your dental practice</h4>
                <p className="text-xs text-slate-500">Your AI receptionist will use this official information to greet patients and answer questions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Name</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500"
                    placeholder="e.g. Apex Dental & Implant Center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry / Booking Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Physical Clinic Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City & State</label>
                  <input
                    type="text"
                    value={`${city}, ${state}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setCity(parts[0]?.trim() || city);
                      setState(parts[1]?.trim() || state);
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500 bg-white"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dental Services & Fees */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-display">Configure your dental services & starting fees</h4>
                <p className="text-xs text-slate-500">The AI quotes starting prices accurately and schedules consultations accordingly.</p>
              </div>

              <div className="space-y-2.5 pt-2">
                {selectedServices.map((srv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900">{srv.name}</span>
                        <span className="text-[10px] text-slate-500 ml-2">({srv.category})</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Starting from:</span>
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          value={srv.price}
                          onChange={(e) => {
                            const newArr = [...selectedServices];
                            newArr[idx].price = Number(e.target.value);
                            setSelectedServices(newArr);
                          }}
                          className="w-full text-xs pl-6 pr-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Hours & Policies */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-display">Business hours & practice policies</h4>
                <p className="text-xs text-slate-500">Ensures the AI never schedules outside open operatory hours.</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Monday – Thursday:</span>
                  <span className="font-bold text-slate-900">8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Friday:</span>
                  <span className="font-bold text-slate-900">8:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Saturday:</span>
                  <span className="font-bold text-slate-900">9:00 AM – 2:00 PM (Emergency & Consults)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Sunday:</span>
                  <span className="font-bold text-rose-600">Closed (AI Receptionist handles inquiries 24/7)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Accepted Insurance Providers</label>
                <input
                  type="text"
                  defaultValue="Delta Dental, MetLife, Cigna, Aetna, Guardian, Humana PPO"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Financing Partners</label>
                <input
                  type="text"
                  defaultValue="CareCredit (0% APR for 12 mos), Sunbit flexible installment plans"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* STEP 4: AI Receptionist Settings */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-display">AI Receptionist Persona & Safety</h4>
                <p className="text-xs text-slate-500">Configures how the AI talks to patients and enforces strict clinical boundaries.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Conversation Tone</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'warm_friendly', title: 'Warm & Friendly', desc: 'Approachable, empathetic, reassuring' },
                    { id: 'professional', title: 'Professional', desc: 'Crisp, clinical, polite' },
                    { id: 'concierge', title: 'Luxury Concierge', desc: 'High-end cosmetic aesthetic' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAiTone(t.id as any)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        aiTone === t.id
                          ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-1 ring-sky-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{t.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opening Greeting Message</label>
                <textarea
                  rows={2}
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-2 text-rose-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Strict Clinical Safety Active</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  DentalLead AI is pre-configured never to diagnose diseases, never prescribe drugs, and strictly redirect acute pain/swelling emergencies to your hotline at <span className="font-semibold">{phone}</span>.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Ready to Launch */}
          {currentStep === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-200">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 font-display">
                Your AI Dental Receptionist is Ready!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                We have calibrated your knowledge base, services, pricing, and clinical safety filters. DentalLead AI is ready to turn inquiries into confirmed dental appointments.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>{clinicName}</strong> workspace provisioned</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{selectedServices.length} Dental services & starting fees loaded</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Autonomous Lead Recovery & Scoring enabled</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Navigation Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-2 cursor-pointer transition-all"
          >
            <span>{currentStep === 5 ? 'Enter Practice Dashboard' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
