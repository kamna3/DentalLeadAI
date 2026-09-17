export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
}

export type SubscriptionPlanId = 'starter' | 'growth' | 'pro' | 'dental_group' | 'STARTER' | 'GROWTH' | 'PRO' | 'DENTAL_GROUP';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'payment_pending' | 'payment_failed' | 'cancelled' | 'expired';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  timezone: string;
  plan: SubscriptionPlanId;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string;
  trialDaysLeft: number;
  createdAt: string;
  currency: string;
}

export interface DentalService {
  id: string;
  orgId: string;
  name: string;
  description: string;
  startingPrice: number;
  durationMinutes: number;
  category: 'General' | 'Cosmetic' | 'Orthodontics' | 'Implants' | 'Surgical' | 'Emergency';
  isPopular?: boolean;
}

export interface BusinessHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface ClinicFAQ {
  id: string;
  orgId: string;
  question: string;
  answer: string;
  category: string;
}

export interface AISettings {
  clinicName: string;
  receptionistName: string;
  greetingMessage: string;
  tone: 'professional' | 'warm_friendly' | 'concierge';
  autoBookingEnabled: boolean;
  leadScoreThreshold: number;
  emergencyPhone: string;
  disclaimerText: string;
  systemPromptOverrides?: string;
}

export interface WidgetConfig {
  primaryColor: string;
  headerTitle: string;
  headerSubtitle: string;
  position: 'bottom-right' | 'bottom-left';
  welcomePrompt: string;
  showServicesList: boolean;
}

export type LeadIntent =
  | 'pricing'
  | 'appointment'
  | 'rescheduling'
  | 'cancellation'
  | 'opening_hours'
  | 'location'
  | 'services'
  | 'insurance'
  | 'emergency'
  | 'general_question'
  | 'complaint'
  | 'human_support'
  | 'treatment_inquiry'
  | 'high_value_lead';

export type LeadStatus =
  | 'new'
  | 'hot'
  | 'warm'
  | 'cold'
  | 'contacted'
  | 'booked'
  | 'converted'
  | 'lost';

export interface Lead {
  id: string;
  orgId: string;
  patientId?: string;
  name: string;
  phone: string;
  email?: string;
  intent: LeadIntent;
  serviceInterest: string;
  leadScore: number; // 0-100
  status: LeadStatus;
  source: 'website_widget' | 'google_ads' | 'phone_inquiry' | 'referral' | 'instagram';
  lastInteraction: string;
  estimatedValue: number;
  verifiedRevenue?: number;
  aiSummary: string;
  notes?: string;
  appointmentId?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'inquiry' | 'ai_reply' | 'qualified' | 'appointment' | 'followup' | 'payment';
  actor?: string;
}

export interface Patient {
  id: string;
  orgId: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'in_treatment' | 'recalled' | 'lost';
  serviceInterest: string;
  leadScore: number;
  source: string;
  totalAppointments: number;
  estimatedValue: number;
  verifiedRevenue: number;
  lastVisit?: string;
  nextAppointment?: string;
  createdAt: string;
  timeline: TimelineEvent[];
  notes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'patient' | 'ai' | 'staff';
  text: string;
  timestamp: string;
  senderName?: string;
  intentDetected?: LeadIntent;
  metadata?: {
    slotsOffered?: string[];
    selectedSlot?: string;
    collectedPhone?: string;
    collectedName?: string;
    bookingCreated?: boolean;
    appointmentId?: string;
  };
}

export interface Conversation {
  id: string;
  orgId?: string;
  leadId?: string;
  patientId?: string;
  customerName?: string;
  patientName?: string;
  customerContact?: string;
  patientPhone?: string;
  customerEmail?: string;
  intent: LeadIntent;
  serviceInterest?: string;
  leadScore: number;
  status: 'open' | 'waiting_patient' | 'handed_off' | 'booked' | 'resolved' | string;
  isHumanTakeover?: boolean;
  isAiHandling?: boolean;
  assignedStaffId?: string;
  lastMessageText?: string;
  lastMessageTime?: string;
  messages: Message[];
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Appointment {
  id: string;
  orgId?: string;
  organizationId?: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (e.g. 14:30)
  durationMinutes?: number;
  dentist: string;
  status: AppointmentStatus;
  notes?: string;
  estimatedValue: number;
  verifiedRevenue?: number;
  source?: string;
  createdVia?: 'ai_receptionist' | 'staff_booking' | 'followup_link' | string;
  createdAt?: string;
}

export type OpportunityType =
  | 'unanswered_inquiry'
  | 'unbooked_lead'
  | 'cancelled_appointment'
  | 'dormant_lead'
  | 'abandoned_booking';

export interface MissedOpportunity {
  id: string;
  orgId?: string;
  type: OpportunityType;
  patientName: string;
  patientContact: string;
  patientPhone?: string;
  service: string;
  serviceInterest?: string;
  estimatedValue: number;
  reason: string;
  detectedAt: string;
  lastInteraction?: string;
  status: 'detected' | 'followup_generated' | 'recovered' | 'dismissed';
  suggestedFollowUp: string;
  aiConfidence: number;
  conversationId?: string;
  recoveredAppointmentId?: string;
}

export interface RevenueEvent {
  id: string;
  orgId: string;
  leadId?: string;
  patientId?: string;
  appointmentId?: string;
  type: 'estimated' | 'verified';
  amount: number;
  description: string;
  timestamp: string;
  attributionChannel: string;
}

export interface AuditLog {
  id: string;
  orgId?: string;
  userId: string;
  userName?: string;
  action: string;
  details: any;
  entityType?: string;
  entityId?: string;
  category?: 'auth' | 'ai' | 'lead' | 'appointment' | 'billing' | 'team';
  timestamp: string;
  ipAddress?: string;
}

export type AuditLogEntry = AuditLog;

export interface PlatformMetrics {
  totalMrr: number;
  activeClinicsCount: number;
  totalRecoveredRevenueAcrossAllClinics: number;
  churnRatePercent: number;
}

export interface RevenueScanResult {
  conversationsScanned: number;
  inquiriesFound: number;
  missedOpportunitiesCount: number;
  unbookedLeadsCount: number;
  cancelledCount: number;
  totalRecoverableValue: number;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  maxConversations: number | 'Unlimited';
  maxLocations: number | 'Unlimited';
  features: string[];
  isPopular?: boolean;
}

export type PaymentProviderType = 'payoneer' | 'stripe_mock' | 'direct_bank';

export interface PaymentProviderConfig {
  provider: PaymentProviderType;
  status: 'connected' | 'not_connected' | 'configuration_required';
  environment: 'sandbox' | 'production';
  payoneerPayeeId?: string;
  payoneerClientId?: string;
  payoneerPaymentLinkEnabled: boolean;
  payoneerPaymentRequestEnabled: boolean;
  demoMode: boolean;
}

export interface Invoice {
  id: string;
  orgId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  planName: string;
  billingPeriod: string;
  provider: PaymentProviderType;
  paymentMethod: string;
  pdfUrl?: string;
}

export interface DashboardMetrics {
  patientsRecovered: number;
  revenueRecovered: number; // total verified + high probability
  verifiedRevenue: number;
  estimatedRevenue: number;
  newLeads: number;
  appointmentsBooked: number;
  conversionRate: number; // e.g. 31
  missedOpportunitiesCount: number;
  totalOpportunityValue: number;
  aiResponseTimeSeconds: number;
}
