import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarDays,
  Bot,
  BookOpen,
  AlertTriangle,
  BarChart3,
  CreditCard,
  Settings,
  ShieldCheck,
  Building2,
  FileCode,
  Globe,
  Sparkles,
  HeartPulse,
  Lock,
} from 'lucide-react';
import { UserRole } from '../types.ts';
import { getRoleBadgeStyle } from '../utils/permissions.ts';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  unreadConversationsCount: number;
  missedOpportunitiesCount: number;
  hotLeadsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  userRole,
  unreadConversationsCount,
  missedOpportunitiesCount,
  hotLeadsCount,
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'conversations',
      label: 'Inbox & Chat',
      icon: MessageSquare,
      badge: unreadConversationsCount > 0 ? unreadConversationsCount : undefined,
      badgeColor: 'bg-sky-500 text-white',
    },
    {
      id: 'leads',
      label: 'Leads & Pipeline',
      icon: Users,
      badge: hotLeadsCount > 0 ? `${hotLeadsCount} HOT` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'patients', label: 'Patient 360', icon: HeartPulse },
    { id: 'appointments', label: 'Appointments & Calendar', icon: CalendarDays },
    {
      id: 'missed-opportunities',
      label: 'Missed Opportunities',
      icon: AlertTriangle,
      badge: missedOpportunitiesCount > 0 ? missedOpportunitiesCount : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
  ];

  const aiAndTools = [
    { id: 'ai-receptionist', label: 'AI Receptionist', icon: Bot },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'widget-embed', label: 'Channels & Integrations', icon: Globe },
    { id: 'analytics', label: 'Revenue & Conversion', icon: BarChart3 },
  ];

  const roleBadge = getRoleBadgeStyle(userRole);

  const adminNavItems = [
    {
      id: 'billing',
      label: 'Billing & Plans',
      icon: CreditCard,
      requiredRole: 'OWNER' as const,
      isLocked: userRole !== 'OWNER',
      lockLabel: 'Owner',
    },
    {
      id: 'team',
      label: 'Team & Roles',
      icon: Settings,
      requiredRole: 'ADMIN' as const,
      isLocked: userRole === 'STAFF' || userRole === 'VIEWER',
      lockLabel: 'Admin',
    },
    {
      id: 'audit-logs',
      label: 'Audit Log',
      icon: ShieldCheck,
      requiredRole: 'ADMIN' as const,
      isLocked: userRole === 'STAFF' || userRole === 'VIEWER',
      lockLabel: 'Admin',
    },
    {
      id: 'platform-admin',
      label: 'Platform Metrics',
      icon: Building2,
      requiredRole: 'OWNER' as const,
      isLocked: userRole !== 'OWNER',
      lockLabel: 'Owner',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
      
      {/* Workspace Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="truncate">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Practice Workspace</h3>
            <p className="text-xs font-bold text-white truncate mt-0.5">Smile Dental Clinic</p>
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
            userRole === 'OWNER' ? 'bg-purple-950 text-purple-300 border-purple-800' :
            userRole === 'ADMIN' ? 'bg-sky-950 text-sky-300 border-sky-800' :
            userRole === 'STAFF' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
            'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {userRole}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        
        {/* Core Acquisition & Booking */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Acquisition</p>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI & Automation */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">AI & Receptionist</p>
          <div className="space-y-1">
            {aiAndTools.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice Administration */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Administration</p>
          <div className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.isLocked && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      <Lock className="w-2.5 h-2.5" />
                      <span>{item.lockLabel}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Banner */}
      <div className="p-3 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
        <div className="flex items-center space-x-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-white text-[11px]">24/7 AI Reception Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Zero missed inquiries. Recovering after-hours patient demand automatically.
        </p>
      </div>

    </aside>
  );
};
