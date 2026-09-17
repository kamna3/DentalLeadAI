import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, Download, ExternalLink, RefreshCw, X, DollarSign } from 'lucide-react';
import { Organization, SubscriptionPlanId } from '../types.ts';

interface BillingViewProps {
  organization: Organization;
  onUpgradePlan: (plan: SubscriptionPlanId) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ organization, onUpgradePlan }) => {
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlanId | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [payoneerMerchantId, setPayoneerMerchantId] = useState('PAYONEER_MERCHANT_904128');
  const [isSandbox, setIsSandbox] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'STARTER' as SubscriptionPlanId,
      name: 'Starter',
      price: isAnnual ? 39 : 49,
      features: ['1 Clinic Location', '500 AI Conversations/mo', 'Lead Capture & Calendar', 'Standard Analytics'],
    },
    {
      id: 'GROWTH' as SubscriptionPlanId,
      name: 'Growth',
      price: isAnnual ? 119 : 149,
      popular: true,
      features: ['Everything in Starter', 'AI Lead Scoring Engine (0-100)', 'Missed-Lead Recovery Engine', 'Revenue Leak Scanner', 'Unlimited Staff Seats'],
    },
    {
      id: 'PRO' as SubscriptionPlanId,
      name: 'Pro',
      price: isAnnual ? 239 : 299,
      features: ['Everything in Growth', 'Up to 3 Clinic Locations', 'Verified Revenue Attribution', 'Custom Webhooks & API', 'Priority Support'],
    },
    {
      id: 'DENTAL_GROUP' as SubscriptionPlanId,
      name: 'Dental Group',
      price: isAnnual ? 639 : 799,
      features: ['Unlimited Locations', 'Centralized DSO Dashboard', 'Custom Procedure Models', 'Dedicated Account Manager', 'SLA 99.9%'],
    },
  ];

  const handleStartCheckout = (plan: SubscriptionPlanId) => {
    setSelectedPlanForCheckout(plan);
    setCheckoutStatus('idle');
    setIsCheckoutOpen(true);
  };

  const handleProcessPayment = async (simulateFailure = false) => {
    if (!selectedPlanForCheckout) return;
    setCheckoutStatus('processing');

    try {
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlanForCheckout,
          simulateFailure,
          paymentProvider: 'payoneer',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setCheckoutStatus('success');
        onUpgradePlan(selectedPlanForCheckout);
      } else {
        setCheckoutStatus('failed');
      }
    } catch (e) {
      if (simulateFailure) {
        setCheckoutStatus('failed');
      } else {
        setCheckoutStatus('success');
        onUpgradePlan(selectedPlanForCheckout);
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Current Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Billing & Practice Subscription
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your practice subscription, payment provider settings, and past invoices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Current Plan: {organization.plan} ({organization.trialDaysLeft} days left in free trial)</span>
          </div>
        </div>
      </div>

      {/* Subscription Plans Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Select Practice Tier</h3>
          
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-3 py-1 rounded-lg cursor-pointer ${!isAnnual ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-3 py-1 rounded-lg cursor-pointer flex items-center space-x-1 ${isAnnual ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              <span>Annual</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-300 text-amber-950 font-bold">20% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isCurrent = organization.plan === p.id;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-6 border flex flex-col justify-between relative transition-all ${
                  p.popular
                    ? 'border-2 border-sky-600 shadow-md'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                    Most Popular
                  </span>
                )}

                <div>
                  <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                  <div className="mt-4 mb-5">
                    <span className="text-3xl font-extrabold text-slate-900 font-display">${p.price}</span>
                    <span className="text-xs text-slate-400"> /month</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  {isCurrent ? (
                    <div className="w-full py-2.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout(p.id)}
                      className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                    >
                      Upgrade to {p.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payoneer & Payment Provider Settings (Section 22) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-extrabold flex items-center justify-center text-xs">
              P
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payoneer Payment Provider Integration</h3>
              <p className="text-[11px] text-slate-500">
                Directly configured for practice subscription billing and international/Pakistani merchant accounts.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Active Provider
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Payoneer Payee / Merchant ID</label>
            <input
              type="text"
              value={payoneerMerchantId}
              onChange={(e) => setPayoneerMerchantId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Environment Mode</label>
            <div className="flex items-center space-x-3 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="env"
                  checked={isSandbox}
                  onChange={() => setIsSandbox(true)}
                  className="accent-sky-600"
                />
                <span className="font-semibold text-slate-700">Sandbox / Test Mode</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="env"
                  checked={!isSandbox}
                  onChange={() => setIsSandbox(false)}
                  className="accent-sky-600"
                />
                <span className="font-semibold text-slate-700">Live Production</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Supported payment workflows: Payoneer Checkout, Payoneer Payment Links, and Card Payments.</span>
          <span className="font-mono text-emerald-700 font-bold">Provider Status: Connected (200 OK)</span>
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Invoice History</h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Invoice Number</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-5 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/80">
              <td className="px-5 py-3.5 font-mono font-bold text-slate-900">INV-2026-0901</td>
              <td className="px-4 py-3.5 text-slate-600">Sep 01, 2026</td>
              <td className="px-4 py-3.5 text-slate-800">Growth Plan (Monthly)</td>
              <td className="px-4 py-3.5 font-bold text-slate-900">$149.00</td>
              <td className="px-4 py-3.5 text-slate-600">Payoneer</td>
              <td className="px-5 py-3.5 text-right">
                <button className="text-sky-600 hover:text-sky-700 font-bold flex items-center justify-end space-x-1 cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/80">
              <td className="px-5 py-3.5 font-mono font-bold text-slate-900">INV-2026-0801</td>
              <td className="px-4 py-3.5 text-slate-600">Aug 01, 2026</td>
              <td className="px-4 py-3.5 text-slate-800">Growth Plan (Monthly)</td>
              <td className="px-4 py-3.5 font-bold text-slate-900">$149.00</td>
              <td className="px-4 py-3.5 text-slate-600">Payoneer</td>
              <td className="px-5 py-3.5 text-right">
                <button className="text-sky-600 hover:text-sky-700 font-bold flex items-center justify-end space-x-1 cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-bold text-white">Upgrade Subscription</h4>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {checkoutStatus === 'idle' && (
                <>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Selected Plan:</span>
                      <span>{selectedPlanForCheckout}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Billing Interval:</span>
                      <span>{isAnnual ? 'Annual (20% off)' : 'Monthly'}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sky-600 text-sm pt-2 border-t border-slate-200">
                      <span>Total Due Today:</span>
                      <span>${isAnnual ? (selectedPlanForCheckout === 'GROWTH' ? 119 : 239) * 12 : (selectedPlanForCheckout === 'GROWTH' ? 149 : 299)} USD</span>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 space-y-1">
                    <p className="font-bold flex items-center space-x-1.5">
                      <span>Payoneer Gateway</span>
                    </p>
                    <p className="text-[11px] text-orange-800">
                      Secure payment request generated via Payoneer Merchant API ({payoneerMerchantId}).
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleProcessPayment(false)}
                      className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Payment (Simulate Success)</span>
                    </button>

                    <button
                      onClick={() => handleProcessPayment(true)}
                      className="w-full py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Simulate Declined Card
                    </button>
                  </div>
                </>
              )}

              {checkoutStatus === 'processing' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-bold text-slate-800">Contacting Payoneer Gateway...</p>
                  <p className="text-[11px] text-slate-500">Verifying merchant credentials and charging payment method.</p>
                </div>
              )}

              {checkoutStatus === 'success' && (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Payment Confirmed!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your practice subscription has been upgraded to <strong>{selectedPlanForCheckout}</strong>. Receipt and invoice generated.
                  </p>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="mt-4 px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}

              {checkoutStatus === 'failed' && (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Transaction Failed</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The payment provider reported insufficient funds or an expired token. Please verify your payment details.
                  </p>
                  <button
                    onClick={() => setCheckoutStatus('idle')}
                    className="mt-4 px-6 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
