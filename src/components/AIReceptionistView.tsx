import React, { useState } from 'react';
import { Bot, Sparkles, ShieldCheck, CheckCircle2, MessageSquare, Send, RefreshCw, Phone, AlertTriangle, Lock, ShieldAlert } from 'lucide-react';
import { AISettings, UserRole } from '../types.ts';

interface AIReceptionistViewProps {
  aiSettings: AISettings;
  onUpdateSettings: (settings: Partial<AISettings>) => void;
  userRole?: UserRole;
}

export const AIReceptionistView: React.FC<AIReceptionistViewProps> = ({
  aiSettings,
  onUpdateSettings,
  userRole = 'OWNER',
}) => {
  const canEdit = userRole === 'OWNER' || userRole === 'ADMIN';
  const [tone, setTone] = useState(aiSettings.tone);
  const [greeting, setGreeting] = useState(aiSettings.greetingMessage);
  const [emergencyProtocol, setEmergencyProtocol] = useState(aiSettings.emergencyProtocol);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simulator State
  const [testMessages, setTestMessages] = useState<Array<{ sender: 'ai' | 'patient'; text: string }>>([
    { sender: 'ai', text: greeting },
  ]);
  const [testInput, setTestInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSave = () => {
    onUpdateSettings({
      tone,
      greetingMessage: greeting,
      emergencyProtocol,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendTest = async (overrideText?: string) => {
    const text = overrideText || testInput;
    if (!text.trim()) return;

    setTestMessages(prev => [...prev, { sender: 'patient', text }]);
    setTestInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          customerName: 'Practice Staff Tester',
          source: 'receptionist_tester',
        }),
      });
      const data = await res.json();
      if (data.aiResponse) {
        setTestMessages(prev => [...prev, { sender: 'ai', text: data.aiResponse.text }]);
      }
    } catch (e) {
      setTestMessages(prev => [
        ...prev,
        { sender: 'ai', text: "Thank you for reaching out to Smile Dental Clinic! How may I assist you with scheduling today?" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          AI Dental Receptionist Configuration & Simulator
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Customized specifically for dental practices to qualify patient leads, quote starting fees, and reserve operatory slots 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Configuration Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Persona & Interaction Settings</h3>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings Updated!</span>
              </span>
            )}
          </div>

          {!canEdit && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You are viewing in <strong>{userRole} Mode</strong>. AI personality customization and emergency triage prompts are managed by Practice Admins and Owners.</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Conversation Tone</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'warm_friendly', title: 'Warm & Friendly', desc: 'Reassuring, empathetic' },
                  { id: 'professional', title: 'Professional', desc: 'Direct, clinical' },
                  { id: 'concierge', title: 'Concierge', desc: 'High-end aesthetic' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => canEdit && setTone(t.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'
                    } ${
                      tone === t.id
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold ring-1 ring-sky-600'
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
                rows={3}
                value={greeting}
                disabled={!canEdit}
                onChange={(e) => canEdit && setGreeting(e.target.value)}
                className={`w-full text-xs p-3 border rounded-xl font-sans leading-relaxed ${
                  canEdit
                    ? 'border-slate-300 focus:ring-1 focus:ring-sky-500 bg-white'
                    : 'border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Care Protocol Text</label>
              <textarea
                rows={2}
                value={emergencyProtocol}
                disabled={!canEdit}
                onChange={(e) => canEdit && setEmergencyProtocol(e.target.value)}
                className={`w-full text-xs p-3 border rounded-xl font-sans leading-relaxed ${
                  canEdit
                    ? 'border-slate-300 focus:ring-1 focus:ring-sky-500 bg-white'
                    : 'border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Strict Clinical Safety Badge */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Clinical Guardrails Enforced</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                DentalLead AI automatically adheres to regulatory requirements: it never diagnoses oral pathologies, never prescribes pharmaceuticals, and immediately redirects severe dental trauma to your clinic emergency line.
              </p>
            </div>

            <button
              onClick={() => canEdit && handleSave()}
              disabled={!canEdit}
              className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-all ${
                canEdit
                  ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              {!canEdit && <Lock className="w-3.5 h-3.5" />}
              <span>{canEdit ? 'Save AI Settings' : 'Settings Locked (Admin/Owner Only)'}</span>
            </button>
          </div>

        </div>

        {/* Right: Live Interactive AI Simulator */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
          
          {/* Simulator Bar */}
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
                AI
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Live AI Receptionist Simulator</h4>
                <p className="text-[10px] text-emerald-400">Powered by Gemini AI with practice context</p>
              </div>
            </div>

            <button
              onClick={() => setTestMessages([{ sender: 'ai', text: greeting }])}
              className="text-slate-400 hover:text-white text-xs flex items-center space-x-1 cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Test Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {testMessages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 ${
                    m.sender === 'patient'
                      ? 'bg-sky-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Dental Test Questions */}
          <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center space-x-2 text-[11px] overflow-x-auto">
            <span className="text-slate-400 font-bold text-[10px] shrink-0">Test Prompts:</span>
            <button
              onClick={() => handleSendTest('How much do dental implants cost?')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-sky-50 text-slate-700 shrink-0 cursor-pointer font-medium"
            >
              "Implants cost?"
            </button>
            <button
              onClick={() => handleSendTest('Do you take Delta Dental or MetLife?')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-sky-50 text-slate-700 shrink-0 cursor-pointer font-medium"
            >
              "Insurance accepted?"
            </button>
            <button
              onClick={() => handleSendTest('I broke a tooth eating dinner and it hurts badly')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-rose-50 hover:text-rose-700 text-slate-700 shrink-0 cursor-pointer font-medium"
            >
              "Emergency broken tooth"
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendTest();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask anything as a potential dental patient..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
