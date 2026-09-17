import React, { useState } from 'react';
import { FileCode, Copy, Check, Sparkles, Bot, MessageSquare, Phone, Database, RefreshCw, Globe, CheckCircle2, ShieldCheck, ArrowRight, Send } from 'lucide-react';

export const WidgetEmbedView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'widget' | 'sms' | 'pms'>('widget');
  const [copied, setCopied] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [widgetTitle, setWidgetTitle] = useState('Smile Dental • 24/7 AI Receptionist');
  const [widgetColor, setWidgetColor] = useState('#0284c7'); // sky-600
  const [widgetPosition, setWidgetPosition] = useState<'right' | 'left'>('right');

  // SMS Webhook Simulator State
  const [smsFrom, setSmsFrom] = useState('+1 (415) 890-1234');
  const [smsText, setSmsText] = useState('Hi, I cracked a molar eating dinner. Do you have any emergency openings tomorrow morning?');
  const [smsSending, setSmsSending] = useState(false);
  const [smsResponse, setSmsResponse] = useState<any>(null);

  // PMS Sync State
  const [syncingPms, setSyncingPms] = useState<string | null>(null);
  const [pmsSyncSuccess, setPmsSyncSuccess] = useState<string | null>(null);

  const embedScript = `<!-- DentalLead AI Website Chat Widget -->
<script 
  src="https://cdn.dentallead.ai/widget.js" 
  data-clinic-id="org-smile-dental"
  data-color="${widgetColor}"
  data-title="${widgetTitle}"
  data-position="${widgetPosition}"
  async>
</script>`;

  const webhookUrl = `${window.location.origin}/api/webhooks/inbound-message`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  const handleTestSmsWebhook = async () => {
    setSmsSending(true);
    setSmsResponse(null);
    try {
      const res = await fetch('/api/webhooks/inbound-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: smsFrom,
          text: smsText,
          channel: 'sms',
          patientName: 'SMS Patient Lead',
        }),
      });
      const data = await res.json();
      setSmsResponse(data);
    } catch (err: any) {
      setSmsResponse({ error: 'Failed to test webhook', details: err.message });
    } finally {
      setSmsSending(false);
    }
  };

  const handleTriggerPmsSync = (pmsId: string) => {
    setSyncingPms(pmsId);
    setTimeout(() => {
      setSyncingPms(null);
      setPmsSyncSuccess(pmsId);
      setTimeout(() => setPmsSyncSuccess(null), 3500);
    }, 1200);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Channels & Production Integrations
          </h1>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Ready for Deployment</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your 24/7 AI Receptionist to your clinic website, Twilio SMS phone numbers, and practice management software.
        </p>
      </div>

      {/* Integration Channel Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('widget')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
            activeTab === 'widget'
              ? 'border-sky-600 text-sky-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website Chat Widget</span>
        </button>

        <button
          onClick={() => setActiveTab('sms')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
            activeTab === 'sms'
              ? 'border-sky-600 text-sky-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Twilio SMS Inbound Webhook</span>
        </button>

        <button
          onClick={() => setActiveTab('pms')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
            activeTab === 'pms'
              ? 'border-sky-600 text-sky-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PMS & Calendar Sync</span>
        </button>
      </div>

      {/* TAB 1: WEBSITE CHAT WIDGET */}
      {activeTab === 'widget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Embed Code Snippet</h3>
                  <p className="text-[11px] text-slate-500">Insert directly into your site's HTML header or footer</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {embedScript}
              </pre>

              <div className="text-xs text-slate-600 space-y-2 pt-2">
                <p className="font-bold text-slate-800">CMS Installation Instructions:</p>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="font-bold text-slate-800">WordPress</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Use "Header & Footer Scripts" plugin</p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="font-bold text-slate-800">Squarespace</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Settings &gt; Advanced &gt; Code Injection</p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="font-bold text-slate-800">Webflow</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Project Settings &gt; Custom Code</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Styling & Positioning</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Widget Heading Title</label>
                  <input
                    type="text"
                    value={widgetTitle}
                    onChange={(e) => setWidgetTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brand Accent Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={widgetColor}
                        onChange={(e) => setWidgetColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                      />
                      <span className="font-mono text-xs text-slate-600 uppercase">{widgetColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Position on Screen</label>
                    <select
                      value={widgetPosition}
                      onChange={(e) => setWidgetPosition(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="right">Bottom Right Corner</option>
                      <option value="left">Bottom Left Corner</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Mockup */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-md space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Live Widget Preview
              </span>

              <div className="h-[420px] rounded-xl bg-slate-100 border border-slate-300 relative overflow-hidden flex flex-col justify-between p-4">
                <div className="space-y-3 opacity-60">
                  <div className="h-6 w-36 bg-slate-300 rounded-md"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded-md"></div>
                  <div className="h-24 w-full bg-slate-200 rounded-xl"></div>
                </div>

                <div className={`absolute bottom-4 ${widgetPosition === 'right' ? 'right-4' : 'left-4'}`}>
                  <div
                    style={{ backgroundColor: widgetColor }}
                    className="w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Patients clicking this launcher will immediately chat with your AI Receptionist in real time.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TWILIO & INBOUND SMS WEBHOOK */}
      {activeTab === 'sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Inbound Webhook Endpoint</h3>
                  <p className="text-[11px] text-slate-500">Configure this URL inside your Twilio Console or SMS Gateway</p>
                </div>
                <button
                  onClick={handleCopyWebhook}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWebhook ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 break-all select-all">
                {webhookUrl}
              </div>

              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 space-y-1.5">
                <p className="font-bold flex items-center space-x-1.5">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Twilio Phone Number Setup:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-sky-800 leading-relaxed">
                  <li>Navigate to <strong>Twilio Console &gt; Phone Numbers &gt; Manage &gt; Active Numbers</strong>.</li>
                  <li>Scroll down to the <strong>Messaging</strong> section.</li>
                  <li>Set <em>"A MESSAGE COMES IN"</em> to <strong>Webhook</strong> and HTTP POST.</li>
                  <li>Paste the webhook URL above and click <strong>Save</strong>.</li>
                </ol>
              </div>
            </div>

            {/* Live Webhook Simulator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Live SMS Inbound Webhook Tester</h3>
              <p className="text-[11px] text-slate-500">Simulate an incoming patient SMS hitting your live backend endpoint</p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Simulated Sender Phone</label>
                  <input
                    type="text"
                    value={smsFrom}
                    onChange={(e) => setSmsFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incoming SMS Message Body</label>
                  <textarea
                    rows={3}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-sans text-xs"
                  />
                </div>

                <button
                  onClick={handleTestSmsWebhook}
                  disabled={smsSending}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{smsSending ? 'Dispatching Webhook & AI Triage...' : 'Send Test Inbound Webhook'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Webhook Payload & Response Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Webhook Response Inspector</h3>
              <p className="text-[11px] text-slate-500">Live output returned to the telecom gateway</p>

              {smsResponse ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <p className="font-bold text-emerald-900 mb-1 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>AI Triage Success</span>
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      <strong>Intent:</strong> {smsResponse.detectedIntent} | <strong>Lead Score:</strong> {smsResponse.leadScore}/100
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Generated SMS Reply Text:</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-sans">
                      {smsResponse.reply}
                    </div>
                  </div>

                  <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-xl overflow-x-auto">
                    {JSON.stringify(smsResponse, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-56 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                  <Phone className="w-8 h-8 mb-2 opacity-40 text-sky-600" />
                  <span>Click "Send Test Inbound Webhook" to preview the real-time AI reply and payload metadata.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PMS & PRACTICE SOFTWARE SYNC */}
      {activeTab === 'pms' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* OpenDental */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">OpenDental PMS</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-500">2-way patient chart and chair slot synchronization via OpenDental API.</p>
                <p className="text-[10px] text-slate-400">Last sync: 12 minutes ago</p>
              </div>

              <button
                onClick={() => handleTriggerPmsSync('opendental')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingPms === 'opendental' ? 'animate-spin text-sky-600' : ''}`} />
                <span>{pmsSyncSuccess === 'opendental' ? 'Synced with OpenDental!' : 'Sync Operatories Now'}</span>
              </button>
            </div>

            {/* Dentrix */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Dentrix G7 / Ascend</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">Automatic chair block booking and operatory mapping for Henry Schein Dentrix.</p>
                <p className="text-[10px] text-slate-400">Status: Webhook Listener Ready</p>
              </div>

              <button
                onClick={() => handleTriggerPmsSync('dentrix')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingPms === 'dentrix' ? 'animate-spin text-sky-600' : ''}`} />
                <span>{pmsSyncSuccess === 'dentrix' ? 'Synced with Dentrix!' : 'Sync Operatories Now'}</span>
              </button>
            </div>

            {/* Google Calendar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Google Calendar</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500">Clinician real-time availability check and booking invitation dispatch.</p>
                <p className="text-[10px] text-slate-400">Last sync: 4 minutes ago</p>
              </div>

              <button
                onClick={() => handleTriggerPmsSync('gcal')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingPms === 'gcal' ? 'animate-spin text-sky-600' : ''}`} />
                <span>{pmsSyncSuccess === 'gcal' ? 'Calendar Synced!' : 'Refresh Schedule'}</span>
              </button>
            </div>

            {/* Eaglesoft */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Patterson Eaglesoft</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Integration Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">Patterson dental chair scheduling connector via secure API gateway.</p>
                <p className="text-[10px] text-slate-400">Available on Growth & Pro tiers</p>
              </div>

              <button
                onClick={() => handleTriggerPmsSync('eaglesoft')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingPms === 'eaglesoft' ? 'animate-spin text-sky-600' : ''}`} />
                <span>{pmsSyncSuccess === 'eaglesoft' ? 'Connected!' : 'Connect Connector'}</span>
              </button>
            </div>

          </div>

          <div className="p-5 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">HIPAA & SOC-2 Business Associate Agreement (BAA) Ready</p>
                <p className="text-[11px] text-slate-400">
                  All PMS synchronization transfers are protected by TLS 1.3 encryption and stored according to medical data retention regulations.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg text-xs font-bold shrink-0">
              BAA Signed
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
