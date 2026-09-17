import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, X, ShieldAlert, DollarSign, Download } from 'lucide-react';
import { RevenueScanResult } from '../types.ts';

interface RevenueLeakScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchBatchRecovery: () => void;
  onReviewOpportunities: () => void;
}

export const RevenueLeakScannerModal: React.FC<RevenueLeakScannerModalProps> = ({
  isOpen,
  onClose,
  onLaunchBatchRecovery,
  onReviewOpportunities,
}) => {
  const [scanningStage, setScanningStage] = useState<number>(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setScanningStage(0);
      setIsDone(false);
      return;
    }

    // Sequence the audit steps
    const timer1 = setTimeout(() => setScanningStage(1), 400);
    const timer2 = setTimeout(() => setScanningStage(2), 1000);
    const timer3 = setTimeout(() => setScanningStage(3), 1600);
    const timer4 = setTimeout(() => setScanningStage(4), 2200);
    const timer5 = setTimeout(() => {
      setScanningStage(5);
      setIsDone(true);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-amber-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Practice Revenue Leak Scanner</h3>
              <p className="text-xs text-amber-100">Deep AI Diagnostic of Patient Conversations & Unbooked Leads</p>
            </div>
          </div>
        </div>

        {/* Scan Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Progress Sequence */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
            <div className="flex items-center space-x-2 text-slate-700 font-semibold">
              {scanningStage >= 1 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 animate-spin shrink-0" />
              )}
              <span>1,284 Patient conversations & after-hours messages analyzed</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700 font-semibold">
              {scanningStage >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span>346 Inbound treatment inquiries identified</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700 font-semibold">
              {scanningStage >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span>82 Missed opportunities detected (slow response & unanswered questions)</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700 font-semibold">
              {scanningStage >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span>47 High-intent unbooked leads & 21 unrescheduled cancellations isolated</span>
            </div>
          </div>

          {/* Revelation Banner (Section 4) */}
          {isDone && (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/20 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                  DIAGNOSTIC COMPLETE
                </span>
                <h4 className="text-3xl sm:text-4xl font-extrabold font-display mt-3 tracking-tight">
                  $12,840
                </h4>
                <p className="text-xs font-semibold text-amber-100 mt-1">
                  in Recoverable Dental Revenue Opportunities Found
                </p>
              </div>

              {/* Categorized Leak Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800">Missed Leads</span>
                    <span className="text-rose-600 font-bold">$7,800</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">32 after-hours inquiries never called back</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800">Unbooked Inquiries</span>
                    <span className="text-amber-600 font-bold">$4,200</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">24 patients asked prices and hesitated</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800">Cancelled Visits</span>
                    <span className="text-sky-600 font-bold">$2,100</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">12 cancellations not rebooked</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800">Dormant High-Value</span>
                    <span className="text-purple-600 font-bold">$4,320</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">14 implant & veneer patients pending</p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Dismiss
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onReviewOpportunities();
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              Review Opportunities
            </button>
            <button
              onClick={() => {
                onClose();
                onLaunchBatchRecovery();
              }}
              className="flex-1 sm:flex-none px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Recover All Patients</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
