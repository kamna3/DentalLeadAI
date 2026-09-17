import React from 'react';
import { ShieldAlert, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types.ts';
import { getRoleBadgeStyle } from '../utils/permissions.ts';

interface RoleRestrictedPanelProps {
  requiredRole: 'OWNER' | 'ADMIN' | 'STAFF';
  currentRole: UserRole;
  title: string;
  description: string;
  onSwitchRole?: (role: UserRole) => void;
  onNavigate?: (view: string) => void;
}

export const RoleRestrictedPanel: React.FC<RoleRestrictedPanelProps> = ({
  requiredRole,
  currentRole,
  title,
  description,
  onSwitchRole,
  onNavigate,
}) => {
  const currentBadge = getRoleBadgeStyle(currentRole);
  const requiredBadge = getRoleBadgeStyle(requiredRole);

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm mb-6">
        <Lock className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-4">
        <span>Current Role:</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentBadge.bg} ${currentBadge.text} border ${currentBadge.border}`}>
          {currentBadge.label}
        </span>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-600 max-w-lg mb-6 leading-relaxed">
        {description}
      </p>

      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-xs text-left max-w-md w-full mb-8">
        <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Security & Access Policy</span>
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
          This section contains sensitive practice configurations. To modify these settings, your session must have <strong className="text-slate-900">{requiredBadge.label}</strong> permissions or higher.
        </p>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Required Role:</span>
          <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${requiredBadge.bg} ${requiredBadge.text} border ${requiredBadge.border}`}>
            {requiredRole}
          </span>
        </div>
      </div>

      {onSwitchRole && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 font-medium">Testing & Demonstration Sandbox</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => onSwitchRole(requiredRole)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <span>Switch to {requiredBadge.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
