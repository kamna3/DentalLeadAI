import React, { useState } from 'react';
import { Users, UserPlus, ShieldCheck, Mail, CheckCircle2, X, AlertCircle, Trash2, Check, Lock, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types.ts';
import { ROLE_PERMISSIONS, getRoleBadgeStyle, DEMO_ACCOUNTS } from '../utils/permissions.ts';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  status: 'active' | 'invited';
  lastActive: string;
}

interface TeamRolesViewProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onSwitchUser?: (persona: typeof DEMO_ACCOUNTS[0]) => void;
}

export const TeamRolesView: React.FC<TeamRolesViewProps> = ({ currentRole, onSwitchRole, onSwitchUser }) => {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 'usr_owner_01', name: 'Dr. Michael Chen, DDS', email: 'dr.chen@smiledental.com', role: 'OWNER', title: 'Principal Dentist & Practice Owner', status: 'active', lastActive: 'Now' },
    { id: 'usr_admin_01', name: 'Sarah Jenkins', email: 'sarah@smiledental.com', role: 'ADMIN', title: 'Clinic Operations Director', status: 'active', lastActive: '12m ago' },
    { id: 'usr_staff_01', name: 'Emily Davis', email: 'emily@smiledental.com', role: 'STAFF', title: 'Lead Treatment Coordinator', status: 'active', lastActive: '1h ago' },
    { id: 'usr_viewer_01', name: 'David Lee', email: 'david@smiledental.com', role: 'VIEWER', title: 'Associate Practice Auditor', status: 'active', lastActive: 'Yesterday' },
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteTitle, setInviteTitle] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('STAFF');
  const [notification, setNotification] = useState<string | null>(null);

  const isOwner = currentRole === 'OWNER';
  const isAdmin = currentRole === 'ADMIN';
  const canManageRoles = isOwner;
  const canInvite = isOwner || isAdmin;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      title: inviteTitle.trim() || 'Dental Team Member',
      role: inviteRole,
      status: 'invited',
      lastActive: 'Pending invite acceptance',
    };

    setMembers(prev => [...prev, newMember]);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteTitle('');
    setNotification(`Invitation sent to ${newMember.email} as ${newMember.role}`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateRole = (memberId: string, newRole: UserRole) => {
    if (!canManageRoles) {
      setNotification('Only Practice Owners have permission to modify team roles.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, role: newRole };
      }
      return m;
    }));

    setNotification('Role permission updated successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (!canManageRoles) {
      setNotification('Only Practice Owners have permission to remove team members.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (window.confirm(`Are you sure you want to remove ${memberName} from this practice?`)) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      setNotification(`${memberName} has been removed.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const currentBadge = getRoleBadgeStyle(currentRole);

  const permissionMatrix = [
    { label: 'Practice Billing & Payoneer Keys', owner: true, admin: false, staff: false, viewer: false, hint: 'Payment settlements, plan upgrades, bank wiring' },
    { label: 'Manage Team & Assign Roles', owner: true, admin: 'Invite only', staff: false, viewer: false, hint: 'Role modifications, staff onboarding' },
    { label: 'Edit Clinic Services & Fees', owner: true, admin: true, staff: false, viewer: false, hint: 'Procedure catalog and starting prices' },
    { label: 'AI Receptionist Custom Prompting', owner: true, admin: true, staff: false, viewer: false, hint: 'Custom triage rules and tone engineering' },
    { label: 'Live Patient Chat Takeover', owner: true, admin: true, staff: true, viewer: false, hint: 'Real-time patient messaging & intervention' },
    { label: 'Schedule & Book Appointments', owner: true, admin: true, staff: true, viewer: false, hint: 'Calendar slot reservation & treatment creation' },
    { label: 'Revenue Leak Scanner & Recovery', owner: true, admin: true, staff: true, viewer: false, hint: 'Execute automated SMS & email re-engagement' },
    { label: 'View Pipeline & Revenue Analytics', owner: true, admin: true, staff: true, viewer: true, hint: 'Real-time dashboards and conversion reports' },
    { label: 'Practice Audit & Security Logs', owner: true, admin: true, staff: false, viewer: false, hint: 'HIPAA & access history records' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              Role-Based Access Control & Team Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
              RBAC Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Strict dental practice role governance protecting patient communications, schedule alterations, fee schedules, and financial credentials.
          </p>
        </div>

        <button
          onClick={() => {
            if (!canInvite) {
              setNotification('Your current role does not have permission to invite new members.');
              setTimeout(() => setNotification(null), 3000);
              return;
            }
            setIsInviteOpen(true);
          }}
          disabled={!canInvite}
          className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors ${
            canInvite
              ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs font-semibold text-sky-800 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Role Switcher & Live Simulator Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white">
                Active Session Role: <span className="text-sky-300 font-extrabold">{currentRole}</span>
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${currentBadge.bg} ${currentBadge.text}`}>
                {currentBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Switch role simulation to test UI permissions, button lockdowns, and restricted views in real time.
            </p>
          </div>

          {/* Quick Role Simulator Pills */}
          <div className="inline-flex bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
            {(['OWNER', 'ADMIN', 'STAFF', 'VIEWER'] as UserRole[]).map((r) => {
              const isActive = currentRole === r;
              return (
                <button
                  key={r}
                  onClick={() => onSwitchRole(r)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Demo Persona Shortcuts */}
        {onSwitchUser && (
          <div className="pt-3 border-t border-slate-700/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Quick Persona Sign-in:</span>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => onSwitchUser(acc)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center space-x-1.5 cursor-pointer border ${
                  currentRole === acc.role
                    ? 'bg-sky-900/60 border-sky-400 text-sky-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span className="font-bold">{acc.name}</span>
                <span className="text-[10px] opacity-75">({acc.role})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Access Permission Warning for Non-Owners */}
      {!canManageRoles && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Role Management Gated ({currentRole}):</span>
            <p className="mt-0.5 text-amber-700">
              Only users with the <strong className="text-amber-900">OWNER</strong> role can alter team member access levels or terminate practice accounts. As an {currentRole}, your view of member roles is read-only.
            </p>
          </div>
        </div>
      )}

      {/* Team Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Practice Team Roster</h2>
            <p className="text-xs text-slate-500">Currently active dentists, front-desk staff, and coordinators.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Members: <strong className="text-slate-800">{members.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Team Member</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Active</th>
                {canManageRoles && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => {
                const badge = getRoleBadgeStyle(m.role);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{m.name}</span>
                        <span className="text-[11px] font-normal text-slate-500 block">{m.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">{m.email}</td>
                    <td className="px-4 py-3.5">
                      {canManageRoles ? (
                        <select
                          value={m.role}
                          onChange={(e) => handleUpdateRole(m.id, e.target.value as UserRole)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-hidden ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <option value="OWNER">OWNER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="STAFF">STAFF</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {m.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 w-fit ${
                        m.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="capitalize">{m.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">{m.lastActive}</td>
                    {canManageRoles && (
                      <td className="px-4 py-3.5 text-right">
                        {m.role !== 'OWNER' && (
                          <button
                            onClick={() => handleRemoveMember(m.id, m.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Control Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Role Permissions & Governance Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicit mapping of functional capabilities across practice hierarchy.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold text-[11px]">
                <th className="py-3 px-4">Capability / Access Scope</th>
                <th className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-extrabold text-[10px]">OWNER</span>
                </th>
                <th className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-extrabold text-[10px]">ADMIN</span>
                </th>
                <th className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">STAFF</span>
                </th>
                <th className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-extrabold text-[10px]">VIEWER</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{row.label}</span>
                    <span className="text-[11px] text-slate-500">{row.hint}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.admin === true ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 text-sky-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : row.admin === 'Invite only' ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        Invite
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.staff ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.viewer ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-bold text-white">Invite Practice Team Member</h4>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica White, RDH"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Registered Dental Hygienist"
                  value={inviteTitle}
                  onChange={(e) => setInviteTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jessica@smiledental.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  <option value="STAFF">STAFF (Live Inbox, Bookings, Follow-ups)</option>
                  <option value="ADMIN">ADMIN (Practice Management, AI Rules, Team Invites)</option>
                  <option value="VIEWER">VIEWER (Read-Only Analytics & Schedule)</option>
                  {isOwner && <option value="OWNER">OWNER (Co-Owner with Full Billing Privileges)</option>}
                </select>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2 -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Send Practice Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
