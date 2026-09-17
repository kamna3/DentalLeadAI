import { UserRole, User } from '../types.ts';

export interface RolePermissions {
  canManageBilling: boolean;
  canManageTeam: boolean;
  canEditClinicProfile: boolean;
  canEditKnowledgeBase: boolean;
  canConfigureAI: boolean;
  canTakeoverChat: boolean;
  canSendMessage: boolean;
  canBookAppointments: boolean;
  canVerifyRevenue: boolean;
  canRecoverOpportunities: boolean;
  canScanRevenueLeaks: boolean;
  canViewAuditLogs: boolean;
  canViewAnalytics: boolean;
  canViewPlatformMetrics: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  OWNER: {
    canManageBilling: true,
    canManageTeam: true,
    canEditClinicProfile: true,
    canEditKnowledgeBase: true,
    canConfigureAI: true,
    canTakeoverChat: true,
    canSendMessage: true,
    canBookAppointments: true,
    canVerifyRevenue: true,
    canRecoverOpportunities: true,
    canScanRevenueLeaks: true,
    canViewAuditLogs: true,
    canViewAnalytics: true,
    canViewPlatformMetrics: true,
  },
  ADMIN: {
    canManageBilling: false,
    canManageTeam: true,
    canEditClinicProfile: true,
    canEditKnowledgeBase: true,
    canConfigureAI: true,
    canTakeoverChat: true,
    canSendMessage: true,
    canBookAppointments: true,
    canVerifyRevenue: true,
    canRecoverOpportunities: true,
    canScanRevenueLeaks: true,
    canViewAuditLogs: true,
    canViewAnalytics: true,
    canViewPlatformMetrics: false,
  },
  STAFF: {
    canManageBilling: false,
    canManageTeam: false,
    canEditClinicProfile: false,
    canEditKnowledgeBase: false,
    canConfigureAI: false,
    canTakeoverChat: true,
    canSendMessage: true,
    canBookAppointments: true,
    canVerifyRevenue: true,
    canRecoverOpportunities: true,
    canScanRevenueLeaks: true,
    canViewAuditLogs: false,
    canViewAnalytics: true,
    canViewPlatformMetrics: false,
  },
  VIEWER: {
    canManageBilling: false,
    canManageTeam: false,
    canEditClinicProfile: false,
    canEditKnowledgeBase: false,
    canConfigureAI: false,
    canTakeoverChat: false,
    canSendMessage: false,
    canBookAppointments: false,
    canVerifyRevenue: false,
    canRecoverOpportunities: false,
    canScanRevenueLeaks: false,
    canViewAuditLogs: false,
    canViewAnalytics: true,
    canViewPlatformMetrics: false,
  },
};

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return !!ROLE_PERMISSIONS[role]?.[permission];
}

export function getRoleBadgeStyle(role: UserRole): { bg: string; text: string; border: string; label: string } {
  switch (role) {
    case 'OWNER':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Practice Owner' };
    case 'ADMIN':
      return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', label: 'Practice Admin' };
    case 'STAFF':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Front-Desk Staff' };
    case 'VIEWER':
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', label: 'Read-Only Viewer' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: role };
  }
}

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarText: string;
  description: string;
  avatarColor: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'usr_owner_01',
    name: 'Dr. Michael Chen, DDS',
    email: 'owner@smiledental.com',
    role: 'OWNER',
    title: 'Practice Owner & Principal Dentist',
    avatarText: 'MC',
    avatarColor: 'bg-purple-600 text-white',
    description: 'Full administrative access: Billing, Payoneer keys, team roles, clinic profile, AI customization.',
  },
  {
    id: 'usr_admin_01',
    name: 'Sarah Jenkins',
    email: 'sarah@smiledental.com',
    role: 'ADMIN',
    title: 'Operations Director & Clinic Manager',
    avatarText: 'SJ',
    avatarColor: 'bg-sky-600 text-white',
    description: 'Operations management: Team invitations, service pricing, knowledge base, and AI receptionist rules.',
  },
  {
    id: 'usr_staff_01',
    name: 'Emily Davis',
    email: 'emily@smiledental.com',
    role: 'STAFF',
    title: 'Lead Treatment Coordinator',
    avatarText: 'ED',
    avatarColor: 'bg-emerald-600 text-white',
    description: 'Front-office actions: Live patient chat takeover, scheduling appointments, sending recovery follow-ups.',
  },
  {
    id: 'usr_viewer_01',
    name: 'David Lee',
    email: 'david@smiledental.com',
    role: 'VIEWER',
    title: 'Associate Auditor & Financial Observer',
    avatarText: 'DL',
    avatarColor: 'bg-slate-600 text-white',
    description: 'Read-only access: Monitor patient pipelines, revenue analytics, and calendars without write permissions.',
  },
];
