import React, { useState } from 'react';
import {
  Search,
  Bot,
  User,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Flame,
  Send,
  Sparkles,
  Pause,
  Play,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { Conversation, Message, Lead, UserRole } from '../types.ts';

interface ConversationInboxViewProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string, sender: 'staff' | 'patient') => void;
  onToggleAiTakeover: (conversationId: string, takeOver: boolean) => void;
  onBookAppointment: (conversation: Conversation) => void;
  onResolveConversation: (conversationId: string) => void;
  userRole?: UserRole;
}

export const ConversationInboxView: React.FC<ConversationInboxViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onToggleAiTakeover,
  onBookAppointment,
  onResolveConversation,
  userRole = 'OWNER',
}) => {
  const isViewer = userRole === 'VIEWER';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'ai' | 'staff' | 'hot'>('all');
  const [inputMessage, setInputMessage] = useState('');

  const activeConv = (conversations && conversations.length > 0)
    ? (conversations.find((c) => c.id === activeConversationId) || conversations[0])
    : null;

  const getPatientName = (c?: Conversation | null) => c?.patientName || c?.customerName || 'Patient';
  const getPatientPhone = (c?: Conversation | null) => c?.patientPhone || c?.customerContact || 'Phone not provided';
  const getPatientEmail = (c?: Conversation | null) => c?.customerEmail || `${(getPatientName(c)).toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
  const getServiceInterest = (c?: Conversation | null) => c?.serviceInterest || 'General Dental Care';
  const getIsAiHandling = (c?: Conversation | null) => c?.isAiHandling ?? !c?.isHumanTakeover;

  const formatMsgTime = (ts?: string) => {
    if (!ts) return '';
    if (ts.includes('AM') || ts.includes('PM') || ts.includes('ago') || ts.toLowerCase() === 'just now' || ts.includes('Yesterday')) {
      return ts;
    }
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return ts;
    }
  };

  const filteredConversations = (conversations || []).filter((c) => {
    const pName = getPatientName(c).toLowerCase();
    const sInterest = getServiceInterest(c).toLowerCase();
    const query = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !query || pName.includes(query) || sInterest.includes(query);
    if (!matchesSearch) return false;

    const isAi = getIsAiHandling(c);
    if (filterTab === 'ai') return isAi;
    if (filterTab === 'staff') return !isAi;
    if (filterTab === 'hot') return (c.leadScore || 0) >= 80;
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputMessage.trim(), 'staff');
    setInputMessage('');
  };

  const handleSimulatePatientMessage = (text: string) => {
    if (!activeConv) return;
    onSendMessage(activeConv.id, text, 'patient');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-white">
      
      {/* LEFT COLUMN: Conversation List */}
      <div className="w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations, patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
            {[
              { id: 'all', label: 'All' },
              { id: 'ai', label: 'AI Handling' },
              { id: 'staff', label: 'Staff' },
              { id: 'hot', label: 'HOT (80+)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterTab(t.id as any)}
                className={`flex-1 py-1 rounded-md text-center cursor-pointer transition-colors ${
                  filterTab === t.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.map((c) => {
            const isSelected = activeConv?.id === c.id;
            const lastMsg = c.messages[c.messages.length - 1];
            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-sky-50/70 border-l-4 border-sky-600' : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate">{getPatientName(c)}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatMsgTime(c.lastMessageTime || c.updatedAt || c.lastUpdated)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                    {getServiceInterest(c)}
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                    (c.leadScore || 0) >= 80 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.leadScore || 0} pts
                  </span>
                  {getIsAiHandling(c) ? (
                    <span className="text-[9px] font-bold text-sky-700 flex items-center">
                      <Bot className="w-3 h-3 mr-0.5" /> AI
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-emerald-700 flex items-center">
                      <User className="w-3 h-3 mr-0.5" /> Staff
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 truncate mt-1.5">
                  {lastMsg ? lastMsg.text : c.lastMessageText || 'New inquiry started'}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* CENTER COLUMN: Active Message History */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          
          {/* Header Bar with Take Over / Return to AI */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                {getPatientName(activeConv).charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900">{getPatientName(activeConv)}</h3>
                  <span className="text-xs text-slate-500 font-normal">{getPatientPhone(activeConv)}</span>
                </div>
                <div className="flex items-center space-x-2 mt-0.5 text-xs">
                  {getIsAiHandling(activeConv) ? (
                    <span className="text-sky-700 font-bold flex items-center space-x-1">
                      <Bot className="w-3.5 h-3.5" />
                      <span>AI Receptionist Active</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span>Staff In Control (AI Paused)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Take Over / Resume AI Button */}
              {isViewer ? (
                <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 text-xs font-semibold flex items-center space-x-1.5 cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Takeover Locked (Viewer)</span>
                </div>
              ) : getIsAiHandling(activeConv) ? (
                <button
                  onClick={() => onToggleAiTakeover(activeConv.id, true)}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Take Over</span>
                </button>
              ) : (
                <button
                  onClick={() => onToggleAiTakeover(activeConv.id, false)}
                  className="px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Return to AI</span>
                </button>
              )}

              {/* Book Appointment Action */}
              <button
                onClick={() => !isViewer && onBookAppointment(activeConv)}
                disabled={isViewer}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  isViewer
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-xs'
                }`}
                title={isViewer ? 'Read-only access: Staff or Admin role required to book' : 'Book Chair Slot'}
              >
                {isViewer ? <Lock className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                <span>Book Chair Slot</span>
              </button>

              {/* Mark Resolved */}
              <button
                onClick={() => onResolveConversation(activeConv.id)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
                title="Mark conversation as resolved"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {(activeConv.messages || []).map((m) => {
              const isPatient = m.sender === 'patient';
              const isAi = m.sender === 'ai';

              return (
                <div key={m.id} className={`flex ${isPatient ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 text-xs ${
                      isPatient
                        ? 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-none shadow-xs'
                        : isAi
                        ? 'bg-sky-600 text-white rounded-br-none shadow-xs'
                        : 'bg-emerald-700 text-white rounded-br-none shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between space-x-3 mb-1">
                      <span className={`text-[10px] font-bold ${isPatient ? 'text-slate-500' : 'text-white/80'}`}>
                        {isPatient ? getPatientName(activeConv) : isAi ? 'AI Receptionist' : 'Practice Staff'}
                      </span>
                      <span className={`text-[9px] ${isPatient ? 'text-slate-400' : 'text-white/60'}`}>
                        {formatMsgTime(m.timestamp)}
                      </span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Patient Simulation Bar (Allows testing patient replies live) */}
          <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center space-x-2 text-[11px] overflow-x-auto">
            <span className="text-slate-500 font-bold text-[10px] shrink-0">Simulate Patient:</span>
            <button
              onClick={() => handleSimulatePatientMessage('Can I schedule for Tuesday afternoon at 3:00 PM?')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-sky-50 hover:text-sky-700 text-slate-700 shrink-0 cursor-pointer font-medium"
            >
              "Tuesday at 3:00 PM?"
            </button>
            <button
              onClick={() => handleSimulatePatientMessage('How much do dental implants cost with insurance?')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-sky-50 hover:text-sky-700 text-slate-700 shrink-0 cursor-pointer font-medium"
            >
              "Implant cost with insurance?"
            </button>
            <button
              onClick={() => handleSimulatePatientMessage('I woke up with severe throbbing tooth pain, do you have walk-ins?')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-rose-50 hover:text-rose-700 text-slate-700 shrink-0 cursor-pointer font-medium"
            >
              "Severe tooth pain emergency"
            </button>
          </div>

          {/* Staff Composer Input */}
          {isViewer ? (
            <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>Read-Only Mode:</strong> Messaging and patient intervention are restricted to Staff, Admin, and Owner roles.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
              <input
                type="text"
                placeholder={
                  getIsAiHandling(activeConv)
                    ? 'Type to respond as staff (will automatically notify the patient)...'
                    : 'Type staff response...'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a conversation to view chat history
        </div>
      )}

      {/* RIGHT COLUMN: Lead & Patient 360 Summary */}
      {activeConv && (
        <div className="w-72 border-l border-slate-200 p-5 bg-white overflow-y-auto space-y-6 shrink-0 hidden xl:block">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Profile</h4>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">{getPatientName(activeConv)}</p>
              <p className="text-xs text-slate-600 flex items-center space-x-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{getPatientPhone(activeConv)}</span>
              </p>
              <p className="text-xs text-slate-600 flex items-center space-x-1.5">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{getPatientEmail(activeConv)}</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Intent & Lead Score</h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Treatment Interest:</span>
                <span className="font-bold text-slate-900">{getServiceInterest(activeConv)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Detected Intent:</span>
                <span className="font-bold text-sky-700 capitalize">{activeConv.intent ? activeConv.intent.replace('_', ' ') : 'General Inquiry'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">AI Lead Score:</span>
                <span className="font-extrabold text-amber-600">{activeConv.leadScore || 0} / 100</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => onBookAppointment(activeConv)}
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Schedule Appointment
              </button>
              <button
                onClick={() => onResolveConversation(activeConv.id)}
                className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
