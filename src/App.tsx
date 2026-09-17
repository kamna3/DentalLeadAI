import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ConversationInboxView } from './components/ConversationInboxView.tsx';
import { LeadsView } from './components/LeadsView.tsx';
import { PatientsView } from './components/PatientsView.tsx';
import { AppointmentsView } from './components/AppointmentsView.tsx';
import { MissedOpportunitiesView } from './components/MissedOpportunitiesView.tsx';
import { RevenueLeakScannerModal } from './components/RevenueLeakScannerModal.tsx';
import { AIReceptionistView } from './components/AIReceptionistView.tsx';
import { KnowledgeBaseView } from './components/KnowledgeBaseView.tsx';
import { WidgetEmbedView } from './components/WidgetEmbedView.tsx';
import { BillingView } from './components/BillingView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { TeamRolesView } from './components/TeamRolesView.tsx';
import { AuditLogView } from './components/AuditLogView.tsx';
import { PlatformAdminView } from './components/PlatformAdminView.tsx';
import { OnboardingWizard } from './components/OnboardingWizard.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { RoleRestrictedPanel } from './components/RoleRestrictedPanel.tsx';
import { DEMO_ACCOUNTS } from './utils/permissions.ts';

import {
  User,
  Organization,
  DashboardMetrics,
  Lead,
  Patient,
  Conversation,
  Appointment,
  MissedOpportunity,
  DentalService,
  ClinicFAQ,
  AISettings,
  AuditLogEntry,
  PlatformMetrics,
  UserRole,
  SubscriptionPlan,
} from './types.ts';

export default function App() {
  // Navigation & Modal State
  const [isLandingPage, setIsLandingPage] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Core App State
  const [user, setUser] = useState<User>({
    id: 'usr-1',
    organizationId: 'org-smile-dental',
    email: 'dr.chen@smiledental.com',
    name: 'Dr. Michael Chen',
    role: 'OWNER',
    createdAt: new Date().toISOString(),
  });

  const [organization, setOrganization] = useState<Organization>({
    id: 'org-smile-dental',
    name: 'Smile Dental Clinic',
    plan: 'GROWTH',
    trialDaysLeft: 6,
    isTrialActive: true,
    address: '1420 N Michigan Ave, Suite 300, Chicago, IL 60611',
    phone: '(312) 555-0199',
    website: 'https://smiledentalchicago.com',
    timezone: 'America/Chicago',
  });

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    patientsRecovered: 14,
    revenueRecovered: 18420,
    verifiedRevenue: 11200,
    estimatedRevenue: 7220,
    newLeads: 47,
    appointmentsBooked: 27,
    conversionRate: 31,
    missedOpportunitiesCount: 82,
    totalOpportunityValue: 12840,
    averageResponseTimeSeconds: 1.8,
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [missedOpportunities, setMissedOpportunities] = useState<MissedOpportunity[]>([]);
  const [services, setServices] = useState<DentalService[]>([]);
  const [faqs, setFaqs] = useState<ClinicFAQ[]>([]);
  const [aiSettings, setAiSettings] = useState<AISettings>({
    tone: 'warm_friendly',
    greetingMessage: 'Hello! Welcome to Smile Dental Clinic. I can answer questions about treatment pricing, accepted insurance, or check open appointment times. How can I help you today?',
    fallbackMessage: 'I will have our patient coordinator reach out to you directly.',
    emergencyProtocol: 'For severe swelling, trauma, or bleeding, call our emergency hotline at (312) 555-0199.',
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>({
    totalMrr: 48900,
    activeClinicsCount: 142,
    totalRecoveredRevenueAcrossAllClinics: 2840000,
    churnRatePercent: 1.2,
  });

  // Fetch initial data from server
  const loadData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        if (data.organization) setOrganization(data.organization);
        if (data.metrics) setMetrics(data.metrics);
        if (data.leads) setLeads(data.leads);
        if (data.patients) setPatients(data.patients);
        if (data.conversations) {
          setConversations(data.conversations);
          if (data.conversations.length > 0 && !activeConversationId) {
            setActiveConversationId(data.conversations[0].id);
          }
        }
        if (data.appointments) setAppointments(data.appointments);
        if (data.missedOpportunities) setMissedOpportunities(data.missedOpportunities);
        if (data.services) setServices(data.services);
        if (data.faqs) setFaqs(data.faqs);
        if (data.aiSettings) setAiSettings(data.aiSettings);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.platformMetrics) setPlatformMetrics(data.platformMetrics);
      }
    } catch (e) {
      console.warn('Backend loading, using memory defaults', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleResetDemo = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
      await loadData();
    } catch (e) {
      // Fallback
    }
  };

  const handleSwitchRole = async (role: UserRole) => {
    try {
      await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
    } catch (e) {
      console.warn('Switch role sync failed', e);
    }
    setUser((prev) => ({ ...prev, role }));
  };

  const handleSwitchUser = async (persona: typeof DEMO_ACCOUNTS[0]) => {
    try {
      await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: persona.id,
          role: persona.role,
          email: persona.email,
        }),
      });
    } catch (e) {
      console.warn('Switch persona sync failed', e);
    }
    setUser((prev) => ({
      ...prev,
      id: persona.id,
      name: persona.name,
      email: persona.email,
      role: persona.role,
    }));
  };

  const handleSendMessage = async (conversationId: string, text: string, sender: 'staff' | 'patient') => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    // Update local state first
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastUpdated: new Date().toISOString(),
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // If sent as patient and AI is handling, trigger AI response
    const currentConv = conversations.find((c) => c.id === conversationId);
    if (sender === 'patient' && currentConv?.isAiHandling) {
      try {
        const res = await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            text,
            customerName: currentConv.patientName,
            source: 'dashboard_inbox',
          }),
        });
        const data = await res.json();
        if (data.aiResponse) {
          const aiMsg = {
            id: `msg-ai-${Date.now()}`,
            conversationId,
            sender: 'ai' as const,
            text: data.aiResponse.text,
            timestamp: new Date().toISOString(),
          };
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === conversationId) {
                return {
                  ...c,
                  leadScore: data.leadScore || c.leadScore,
                  intent: data.intent || c.intent,
                  messages: [...c.messages, aiMsg],
                };
              }
              return c;
            })
          );
        }
      } catch (e) {
        // Fallback response
      }
    }
  };

  const handleToggleAiTakeover = (conversationId: string, takeOver: boolean) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return { ...c, isAiHandling: !takeOver };
        }
        return c;
      })
    );
  };

  // Recover Patient action from Missed Opportunities
  const handleRecoverOpportunity = (opp: MissedOpportunity) => {
    // 1. Mark opportunity as recovered
    setMissedOpportunities((prev) =>
      prev.map((o) => (o.id === opp.id ? { ...o, status: 'recovered' } : o))
    );

    // 2. Add confirmed appointment with globally unique ID
    const uniqueId = `apt-rec-${opp.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newApt: Appointment = {
      id: uniqueId,
      organizationId: organization.id,
      patientId: `pat-${opp.id}-${Date.now()}`,
      patientName: opp.patientName,
      patientPhone: opp.patientPhone,
      dentist: 'Dr. Michael Chen, DDS',
      service: opp.serviceInterest,
      date: '2026-09-18',
      time: '02:30 PM',
      status: 'confirmed',
      estimatedValue: opp.estimatedValue,
      verifiedRevenue: 0,
      source: 'missed_lead_recovery',
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);

    // 3. Update top metrics
    setMetrics((prev) => ({
      ...prev,
      patientsRecovered: prev.patientsRecovered + 1,
      revenueRecovered: prev.revenueRecovered + opp.estimatedValue,
      estimatedRevenue: prev.estimatedRevenue + opp.estimatedValue,
      appointmentsBooked: prev.appointmentsBooked + 1,
    }));
  };

  // Batch recover all unrecovered missed opportunities atomically
  const handleBatchRecoverAll = () => {
    const unrecovered = missedOpportunities.filter((o) => o.status !== 'recovered');
    if (unrecovered.length === 0) return;

    const newApts: Appointment[] = unrecovered.map((opp, idx) => ({
      id: `apt-rec-${opp.id}-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      organizationId: organization.id,
      patientId: `pat-${opp.id}-${idx}`,
      patientName: opp.patientName,
      patientPhone: opp.patientPhone,
      dentist: 'Dr. Michael Chen, DDS',
      service: opp.serviceInterest,
      date: '2026-09-18',
      time: '02:30 PM',
      status: 'confirmed',
      estimatedValue: opp.estimatedValue,
      verifiedRevenue: 0,
      source: 'missed_lead_recovery',
      createdAt: new Date().toISOString(),
    }));

    const totalRecoveredValue = unrecovered.reduce((acc, o) => acc + (o.estimatedValue || 0), 0);

    setMissedOpportunities((prev) =>
      prev.map((o) => ({ ...o, status: 'recovered' }))
    );

    setAppointments((prev) => [...newApts, ...prev]);

    setMetrics((prev) => ({
      ...prev,
      patientsRecovered: prev.patientsRecovered + unrecovered.length,
      revenueRecovered: prev.revenueRecovered + totalRecoveredValue,
      estimatedRevenue: prev.estimatedRevenue + totalRecoveredValue,
      appointmentsBooked: prev.appointmentsBooked + unrecovered.length,
    }));
  };

  // Verify completed appointment revenue
  const handleVerifyCompletedRevenue = (appointmentId: string, verifiedAmount: number) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === appointmentId) {
          return {
            ...a,
            status: 'completed',
            verifiedRevenue: verifiedAmount,
          };
        }
        return a;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      verifiedRevenue: prev.verifiedRevenue + verifiedAmount,
    }));
  };

  const handleBookNewAppointment = (aptData: Partial<Appointment>) => {
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      organizationId: organization.id,
      patientId: `pat-${Date.now()}`,
      patientName: aptData.patientName || 'New Patient',
      patientPhone: aptData.patientPhone || '(555) 000-0000',
      dentist: aptData.dentist || 'Dr. Michael Chen, DDS',
      service: aptData.service || 'Comprehensive Exam',
      date: aptData.date || '2026-09-18',
      time: aptData.time || '11:00 AM',
      status: aptData.status || 'confirmed',
      estimatedValue: aptData.estimatedValue || 200,
      verifiedRevenue: 0,
      source: 'staff_entry',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      appointmentsBooked: prev.appointmentsBooked + 1,
    }));
  };

  const handleUpgradePlan = (newPlan: SubscriptionPlan) => {
    setOrganization((prev) => ({ ...prev, plan: newPlan }));
  };

  const handleAddService = (srv: Omit<DentalService, 'id'>) => {
    const newSrv: DentalService = {
      ...srv,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newSrv]);
  };

  const handleUpdateServicePrice = (id: string, newPrice: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, startingPrice: newPrice } : s))
    );
  };

  const unreadConversations = conversations.filter((c) => c.isAiHandling).length;
  const hotLeadsCount = leads.filter((l) => l.leadScore >= 80).length;
  const unrecoveredOppsCount = missedOpportunities.filter((o) => o.status !== 'recovered').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-sky-100 selection:text-sky-900 font-sans">
      
      {/* Top Application Navbar */}
      <Navbar
        user={user}
        organization={organization}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenDemoChat={() => {
          setCurrentView('ai-receptionist');
          setIsLandingPage(false);
        }}
        onSwitchRole={handleSwitchRole}
        onResetDemo={handleResetDemo}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsLandingPage(false);
        }}
        isLandingPage={isLandingPage}
        onToggleLandingPage={() => setIsLandingPage(!isLandingPage)}
      />

      {/* Main Viewport */}
      {isLandingPage ? (
        <LandingPage
          onStartFree={() => setIsOnboardingOpen(true)}
          onTryLiveDemo={() => {
            setIsLandingPage(false);
            setCurrentView('dashboard');
          }}
          onOpenCalculator={() => {
            const el = document.getElementById('roi-calculator');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            userRole={user.role}
            unreadConversationsCount={unreadConversations}
            missedOpportunitiesCount={unrecoveredOppsCount}
            hotLeadsCount={hotLeadsCount}
          />

          {/* Active Center Area */}
          <main className="flex-1 overflow-y-auto bg-slate-100">
            {currentView === 'dashboard' && (
              <DashboardView
                metrics={metrics}
                leads={leads}
                appointments={appointments}
                missedOpportunities={missedOpportunities}
                clinicName={organization.name}
                onOpenScanner={() => setIsScannerOpen(true)}
                onNavigate={(v) => setCurrentView(v)}
                onSelectLead={(lead) => {
                  setCurrentView('leads');
                }}
                onRecoverOpportunity={(opp) => handleRecoverOpportunity(opp)}
              />
            )}

            {currentView === 'conversations' && (
              <ConversationInboxView
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={(id) => setActiveConversationId(id)}
                onSendMessage={handleSendMessage}
                onToggleAiTakeover={handleToggleAiTakeover}
                userRole={user.role}
                onBookAppointment={(conv) => {
                  handleBookNewAppointment({
                    patientName: conv.patientName,
                    patientPhone: conv.patientPhone,
                    service: conv.serviceInterest,
                    estimatedValue: 1500,
                  });
                  setCurrentView('appointments');
                }}
                onResolveConversation={(id) => {
                  setConversations((prev) => prev.filter((c) => c.id !== id));
                }}
              />
            )}

            {currentView === 'leads' && (
              <LeadsView
                leads={leads}
                onSelectLead={(l) => {}}
                onBookLead={(l) => {
                  handleBookNewAppointment({
                    patientName: l.name,
                    patientPhone: l.phone,
                    service: l.serviceInterest,
                    estimatedValue: l.estimatedValue,
                  });
                  setCurrentView('appointments');
                }}
              />
            )}

            {currentView === 'patients' && <PatientsView patients={patients} />}

            {currentView === 'appointments' && (
              <AppointmentsView
                appointments={appointments}
                userRole={user.role}
                onBookNewAppointment={handleBookNewAppointment}
                onVerifyCompletedRevenue={handleVerifyCompletedRevenue}
              />
            )}

            {currentView === 'missed-opportunities' && (
              <MissedOpportunitiesView
                opportunities={missedOpportunities}
                onRecover={handleRecoverOpportunity}
                onOpenScanner={() => setIsScannerOpen(true)}
              />
            )}

            {currentView === 'ai-receptionist' && (
              <AIReceptionistView
                aiSettings={aiSettings}
                userRole={user.role}
                onUpdateSettings={(s) => setAiSettings((prev) => ({ ...prev, ...s }))}
              />
            )}

            {currentView === 'knowledge-base' && (
              <KnowledgeBaseView
                services={services}
                faqs={faqs}
                userRole={user.role}
                onAddService={handleAddService}
                onUpdateServicePrice={handleUpdateServicePrice}
              />
            )}

            {currentView === 'widget-embed' && <WidgetEmbedView />}

            {currentView === 'analytics' && <AnalyticsView metrics={metrics} />}

            {currentView === 'billing' && (
              user.role === 'OWNER' ? (
                <BillingView
                  organization={organization}
                  onUpgradePlan={handleUpgradePlan}
                />
              ) : (
                <RoleRestrictedPanel
                  requiredRole="OWNER"
                  currentRole={user.role}
                  title="Practice Billing & Subscription Management"
                  description="Access to subscription plans, payment methods, clinic seat quotas, and invoices is restricted to Practice Owners."
                  onSwitchRole={handleSwitchRole}
                  onNavigate={(v) => setCurrentView(v)}
                />
              )
            )}

            {currentView === 'team' && (
              <TeamRolesView
                currentRole={user.role}
                onSwitchRole={handleSwitchRole}
                onSwitchUser={handleSwitchUser}
              />
            )}

            {currentView === 'audit-logs' && (
              user.role === 'OWNER' || user.role === 'ADMIN' ? (
                <AuditLogView logs={auditLogs} />
              ) : (
                <RoleRestrictedPanel
                  requiredRole="ADMIN"
                  currentRole={user.role}
                  title="Security & Compliance Audit Logs"
                  description="Access to staff activity logs, security trails, and role modifications is restricted to Practice Administrators and Practice Owners."
                  onSwitchRole={handleSwitchRole}
                  onNavigate={(v) => setCurrentView(v)}
                />
              )
            )}

            {currentView === 'platform-admin' && (
              user.role === 'OWNER' ? (
                <PlatformAdminView platformMetrics={platformMetrics} />
              ) : (
                <RoleRestrictedPanel
                  requiredRole="OWNER"
                  currentRole={user.role}
                  title="Platform Admin & Multi-Clinic DSO Diagnostics"
                  description="Aggregate multi-tenant metrics, enterprise MRR, and platform health telemetry are restricted to Practice Owners."
                  onSwitchRole={handleSwitchRole}
                  onNavigate={(v) => setCurrentView(v)}
                />
              )
            )}
          </main>

        </div>
      )}

      {/* Global Modals */}
      <RevenueLeakScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onLaunchBatchRecovery={() => {
          handleBatchRecoverAll();
          setCurrentView('dashboard');
        }}
        onReviewOpportunities={() => {
          setCurrentView('missed-opportunities');
        }}
      />

      {isOnboardingOpen && (
        <OnboardingWizard
          onComplete={() => {
            setIsOnboardingOpen(false);
            setIsLandingPage(false);
            setCurrentView('dashboard');
          }}
          onCancel={() => setIsOnboardingOpen(false)}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        user={user}
        onClose={() => setIsAuthOpen(false)}
        onUpdateUser={(u) => setUser((prev) => ({ ...prev, ...u }))}
      />

    </div>
  );
}
