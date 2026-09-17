import React, { useState } from 'react';
import { ShieldCheck, Filter, Search, Clock, Bot, User, CreditCard, Calendar, Download, FileText } from 'lucide-react';
import { AuditLogEntry } from '../types.ts';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    const headers = ['ID,Timestamp,Actor,Action,TargetEntity,Metadata'];
    const rows = (logs || []).map(l => 
      `"${l.id}","${l.timestamp}","${l.actor || l.userName || 'System'}","${l.action}","${l.targetEntity || l.category || ''}","${(l.details || '').replace(/"/g, '""')}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `security_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const filteredLogs = (logs || []).filter((l) => {
    if (filterAction === 'all') return true;
    return (l.action || '').toLowerCase().includes((filterAction || '').toLowerCase());
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              Practice Audit & Security Log
            </h1>
            <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <ShieldCheck className="w-3 h-3" />
              <span>SOC-2 Type II & HIPAA</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable event log tracking AI Receptionist actions, staff appointments, and payment transactions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors shrink-0"
          title="Export immutable audit trail for compliance review"
        >
          <Download className="w-3.5 h-3.5 text-sky-600" />
          <span>{downloadSuccess ? 'Exported CSV!' : 'Export Audit Log (.CSV)'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200 text-xs">
        <span className="text-slate-400 font-semibold px-2">Filter Action:</span>
        {['all', 'appointment', 'ai', 'revenue', 'payment'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterAction(f)}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize cursor-pointer transition-colors ${
              filterAction === f ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f === 'all' ? 'All Events' : f}
          </button>
        ))}
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Target Entity</th>
              <th className="px-5 py-3">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80">
                <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-800 flex items-center space-x-1.5">
                  {log.userId === 'system_ai' ? (
                    <Bot className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span>{log.userId === 'system_ai' ? 'AI Receptionist' : log.userId}</span>
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-900">
                  {log.action}
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                  {log.entityType} • {log.entityId}
                </td>
                <td className="px-5 py-3.5 text-slate-500 font-mono text-[10px]">
                  {JSON.stringify(log.details)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
