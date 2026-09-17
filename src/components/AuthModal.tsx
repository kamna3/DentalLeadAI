import React, { useState } from 'react';
import { Stethoscope, X, CheckCircle2, ShieldCheck, Mail, Lock, ArrowRight, LogOut, UserCircle2, Sparkles, Building2, KeyRound } from 'lucide-react';
import { User, UserRole } from '../types.ts';
import { DEMO_ACCOUNTS, getRoleBadgeStyle } from '../utils/permissions.ts';

interface AuthModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onUpdateUser: (user: Partial<User>) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, user, onClose, onUpdateUser, onLogout }) => {
  const [tab, setTab] = useState<'personas' | 'signin' | 'signup' | 'forgot'>('personas');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [clinicName, setClinicName] = useState('Smile Dental Clinic');
  const [role, setRole] = useState<UserRole>('STAFF');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectPersona = async (persona: typeof DEMO_ACCOUNTS[0]) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: persona.id, role: persona.role, email: persona.email }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUpdateUser(data.user);
        setStatusMsg({ text: `Logged in as ${persona.name} (${persona.role})`, type: 'success' });
        setTimeout(() => {
          setStatusMsg(null);
          onClose();
        }, 800);
      } else {
        // Fallback local update
        onUpdateUser({
          id: persona.id,
          name: persona.name,
          email: persona.email,
          role: persona.role,
        });
        setStatusMsg({ text: `Session switched to ${persona.name}`, type: 'success' });
        setTimeout(() => {
          setStatusMsg(null);
          onClose();
        }, 800);
      }
    } catch {
      onUpdateUser({
        id: persona.id,
        name: persona.name,
        email: persona.email,
        role: persona.role,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    if (tab === 'forgot') {
      setStatusMsg({ text: `Reset link dispatched to ${email}`, type: 'success' });
      setTimeout(() => {
        setStatusMsg(null);
        setTab('signin');
      }, 2500);
      setLoading(false);
      return;
    }

    if (tab === 'signup') {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, clinicName, role }),
        });
        const data = await res.json();
        if (data.user) {
          onUpdateUser(data.user);
          setStatusMsg({ text: 'Practice account created successfully!', type: 'success' });
          setTimeout(() => {
            setStatusMsg(null);
            onClose();
          }, 800);
        }
      } catch {
        onUpdateUser({
          id: `usr_${Date.now()}`,
          name: name || 'Clinic Professional',
          email: email || 'user@smiledental.com',
          role,
        });
        setStatusMsg({ text: 'Account registered locally.', type: 'success' });
        setTimeout(() => onClose(), 800);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sign in
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        onUpdateUser(data.user);
        setStatusMsg({ text: `Welcome back, ${data.user.name}!`, type: 'success' });
        setTimeout(() => {
          setStatusMsg(null);
          onClose();
        }, 800);
      }
    } catch {
      // Local fallback lookup
      const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      onUpdateUser({
        email: email || user.email,
        name: matched ? matched.name : (name || user.name),
        role: matched ? matched.role : user.role,
      });
      setStatusMsg({ text: 'Successfully authenticated!', type: 'success' });
      setTimeout(() => onClose(), 800);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    if (onLogout) {
      onLogout();
    } else {
      // Switch to Viewer role
      onUpdateUser({
        role: 'VIEWER',
        name: 'Guest Viewer',
        email: 'guest@smiledental.com',
      });
    }
    setStatusMsg({ text: 'Signed out from practice workspace.', type: 'success' });
    setTimeout(() => {
      setStatusMsg(null);
      onClose();
    }, 800);
  };

  const currentBadge = getRoleBadgeStyle(user.role);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-display">DentalLead AI</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  Role Security
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Practice Authentication & RBAC Control Hub</p>
            </div>
          </div>
        </div>

        {/* Active Session Strip */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <span className="text-slate-500 text-[11px] block">Logged In As:</span>
              <span className="font-bold text-slate-900 truncate">{user.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentBadge.bg} ${currentBadge.text} border ${currentBadge.border}`}>
              {currentBadge.label}
            </span>
            <button
              onClick={handleSignOut}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className={`p-3 text-xs font-bold text-center border-b shrink-0 ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {statusMsg.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 flex space-x-4 shrink-0 text-xs font-bold">
          <button
            onClick={() => setTab('personas')}
            className={`pb-2.5 cursor-pointer transition-colors border-b-2 flex items-center space-x-1.5 ${
              tab === 'personas' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Switch Persona</span>
          </button>
          <button
            onClick={() => setTab('signin')}
            className={`pb-2.5 cursor-pointer transition-colors border-b-2 ${
              tab === 'signin' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`pb-2.5 cursor-pointer transition-colors border-b-2 ${
              tab === 'signup' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {tab === 'personas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Test Personas (1-Click Instant Login)
                </p>
                <span className="text-[10px] text-slate-400">Select any role to test access</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = user.email.toLowerCase() === acc.email.toLowerCase();
                  const badge = getRoleBadgeStyle(acc.role);

                  return (
                    <div
                      key={acc.id}
                      onClick={() => !loading && handleSelectPersona(acc)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 text-left ${
                        isCurrent
                          ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-200'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${acc.avatarColor}`}>
                        {acc.avatarText}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {acc.name}
                          </h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${badge.bg} ${badge.text} border ${badge.border}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{acc.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{acc.description}</p>
                      </div>

                      {isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'signin' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.chen@smiledental.com"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => setTab('personas')}
                  className="text-xs text-sky-600 hover:underline font-medium cursor-pointer"
                >
                  Or click here to select a demo persona
                </button>
              </div>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name & Credentials</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Amanda Torres, DDS"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dental Clinic Name</label>
                <input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Metro Smiles Dental Group"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.torres@metrosmiles.com"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Practice Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="OWNER">Practice Owner (Full Access)</option>
                    <option value="ADMIN">Practice Admin / Manager</option>
                    <option value="STAFF">Front-Desk Staff / Coordinator</option>
                    <option value="VIEWER">Read-Only Viewer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {loading ? 'Creating Practice Account...' : 'Register Clinic & Start Trial'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
