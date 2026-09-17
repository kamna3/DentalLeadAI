import React from 'react';
import { Sparkles, Bot, ShieldCheck, UserCheck, Stethoscope, RefreshCw, Calendar, Flame } from 'lucide-react';
import { User, Organization, UserRole } from '../types.ts';

interface NavbarProps {
  user: User;
  organization: Organization;
  onOpenScanner: () => void;
  onOpenDemoChat: () => void;
  onSwitchRole: (role: UserRole) => void;
  onResetDemo: () => void;
  onOpenAuth: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  isLandingPage: boolean;
  onToggleLandingPage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  organization,
  onOpenScanner,
  onOpenDemoChat,
  onSwitchRole,
  onResetDemo,
  onOpenAuth,
  onNavigate,
  isLandingPage,
  onToggleLandingPage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Clinic Info */}
        <div className="flex items-center space-x-3">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-sky-200 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-display">DentalLead</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Patient Lead Recovery & Booking</p>
            </div>
          </div>

          {!isLandingPage && (
            <div className="hidden md:flex items-center pl-4 border-l border-slate-200 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-slate-800">{organization.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[10px]">
                  {organization.trialDaysLeft} days left in trial
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center Actions / Quick Tools */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Revenue Leak Scanner Trigger */}
          <button
            onClick={onOpenScanner}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border border-amber-300 hover:shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
            title="Scan conversations for lost revenue"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
            <span className="hidden sm:inline">Revenue Leak Scanner</span>
            <span className="sm:hidden">Scan Leaks</span>
          </button>

          {/* Test Live AI Receptionist */}
          <button
            onClick={onOpenDemoChat}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer"
            title="Open live patient chat test"
          >
            <Bot className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden md:inline">Test AI Receptionist</span>
            <span className="md:hidden">Test AI</span>
          </button>

          {/* Role Switcher for Testing */}
          {!isLandingPage && (
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
              {(['OWNER', 'ADMIN', 'STAFF', 'VIEWER'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onSwitchRole(r)}
                  className={`px-2 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    user.role === r
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Landing / Dashboard Toggle */}
          <button
            onClick={onToggleLandingPage}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            {isLandingPage ? 'Open Dashboard' : 'View Landing Page'}
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={onResetDemo}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Reset to fresh demo clinic data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Profile & Role Indicator */}
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Click to switch account or manage role permissions"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">{user.name}</p>
              <span className="text-[10px] font-semibold text-slate-500 capitalize">{user.role.toLowerCase()}</span>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};
