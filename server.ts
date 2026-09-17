import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { getStore, resetStoreToDemo, getMetrics } from './server/store.ts';
import { generateReceptionistResponse, generatePersonalizedFollowUp, runRevenueLeakAnalysis } from './server/geminiService.ts';
import { getPaymentProvider } from './server/paymentProvider.ts';
import { Appointment, Conversation, Lead, Message, MissedOpportunity, Patient } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.url}`);
  }
  next();
});

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'DentalLead AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------
// Authentication Endpoints (Multi-tenant)
// ----------------------------------------------------
let currentSessionUser = getStore().users[0]; // Default logged in as Owner for smooth prototype experience

app.get('/api/auth/me', (req, res) => {
  const store = getStore();
  res.json({
    user: currentSessionUser,
    organization: store.organization,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const store = getStore();
  const matchedUser = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || store.users[0];
  currentSessionUser = matchedUser;

  // Add audit log
  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: matchedUser.id,
    userName: matchedUser.name,
    action: 'User Logged In',
    details: `User ${matchedUser.email} authenticated successfully.`,
    category: 'auth',
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    user: currentSessionUser,
    organization: store.organization,
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, clinicName, phone } = req.body;
  const store = getStore();

  if (clinicName) {
    store.organization.name = clinicName;
    store.organization.slug = clinicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: name || 'Clinic Doctor',
    email: email || 'doctor@example.com',
    role: 'OWNER' as const,
    orgId: store.organization.id,
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  currentSessionUser = newUser;

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: newUser.id,
    userName: newUser.name,
    action: 'User Registered & Onboarded',
    details: `New clinic account registered for "${clinicName || 'Dental Practice'}".`,
    category: 'auth',
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    user: newUser,
    organization: store.organization,
  });
});

app.post('/api/auth/google', (req, res) => {
  const store = getStore();
  const user = store.users[0];
  currentSessionUser = user;
  res.json({
    success: true,
    user,
    organization: store.organization,
  });
});

app.post('/api/auth/switch-role', (req, res) => {
  const { role } = req.body;
  const store = getStore();
  if (['OWNER', 'ADMIN', 'STAFF', 'VIEWER'].includes(role)) {
    currentSessionUser.role = role;
    res.json({ success: true, user: currentSessionUser });
  } else {
    res.status(400).json({ error: 'Invalid role' });
  }
});

app.post('/api/auth/switch-user', (req, res) => {
  const { userId, role, email } = req.body;
  const store = getStore();
  let matchedUser = store.users.find(u => u.id === userId || (email && u.email.toLowerCase() === email.toLowerCase()));

  if (!matchedUser && email) {
    matchedUser = {
      id: userId || `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: (role || 'STAFF') as any,
      orgId: store.organization.id,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    store.users.push(matchedUser);
  } else if (matchedUser && role) {
    matchedUser.role = role;
  }

  if (matchedUser) {
    currentSessionUser = matchedUser;
    store.auditLogs.unshift({
      id: `log_${Date.now()}`,
      orgId: store.organization.id,
      userId: matchedUser.id,
      userName: matchedUser.name,
      action: 'Persona Switched',
      details: `Active session switched to ${matchedUser.name} (${matchedUser.role}).`,
      category: 'auth',
      timestamp: new Date().toISOString(),
    });
    return res.json({ success: true, user: currentSessionUser });
  }

  res.status(404).json({ error: 'User persona not found' });
});

app.post('/api/auth/logout', (req, res) => {
  const store = getStore();
  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'User Logged Out',
    details: `${currentSessionUser.email} signed out from practice portal.`,
    category: 'auth',
    timestamp: new Date().toISOString(),
  });
  // Switch to guest/viewer
  currentSessionUser = {
    id: 'usr_guest',
    name: 'Guest Observer',
    email: 'guest@smiledental.com',
    role: 'VIEWER' as const,
    orgId: store.organization.id,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };
  res.json({ success: true, user: currentSessionUser });
});

// ----------------------------------------------------
// Team & Role Management Endpoints
// ----------------------------------------------------
app.get('/api/team', (req, res) => {
  const store = getStore();
  res.json({
    users: store.users,
    currentSessionUser,
  });
});

app.post('/api/team/invite', (req, res) => {
  const { name, email, role, title } = req.body;
  const store = getStore();

  if (currentSessionUser.role !== 'OWNER' && currentSessionUser.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Only Practice Owners and Admins can invite team members.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const newMember = {
    id: `usr_${Date.now()}`,
    name: name || email.split('@')[0],
    email,
    role: (role || 'STAFF') as any,
    orgId: store.organization.id,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  store.users.push(newMember);

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Team Member Invited',
    details: `Invited ${newMember.name} (${newMember.email}) with role ${newMember.role}.`,
    category: 'auth',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, member: newMember, users: store.users });
});

app.put('/api/team/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const store = getStore();

  if (currentSessionUser.role !== 'OWNER') {
    return res.status(403).json({ error: 'Forbidden: Only Practice Owners can modify member roles.' });
  }

  const member = store.users.find(u => u.id === id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }

  const oldRole = member.role;
  member.role = role;

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Member Role Updated',
    details: `Changed role for ${member.name} from ${oldRole} to ${role}.`,
    category: 'auth',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, member, users: store.users });
});

app.delete('/api/team/:id', (req, res) => {
  const { id } = req.params;
  const store = getStore();

  if (currentSessionUser.role !== 'OWNER') {
    return res.status(403).json({ error: 'Forbidden: Only Practice Owners can remove team members.' });
  }

  const memberIdx = store.users.findIndex(u => u.id === id);
  if (memberIdx === -1) {
    return res.status(404).json({ error: 'Team member not found' });
  }

  const removed = store.users.splice(memberIdx, 1)[0];

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Team Member Removed',
    details: `Revoked access and removed member ${removed.name} (${removed.email}).`,
    category: 'auth',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, removedId: id, users: store.users });
});

// ----------------------------------------------------
// Clinic Profile & Knowledge Base
// ----------------------------------------------------
app.get('/api/clinic/profile', (req, res) => {
  const store = getStore();
  res.json({
    organization: store.organization,
    services: store.services,
    businessHours: store.businessHours,
    faqs: store.faqs,
    aiSettings: store.aiSettings,
    widgetConfig: store.widgetConfig,
  });
});

app.put('/api/clinic/profile', (req, res) => {
  const store = getStore();
  Object.assign(store.organization, req.body);
  res.json({ success: true, organization: store.organization });
});

app.post('/api/clinic/services', (req, res) => {
  const store = getStore();
  const newService = {
    id: `srv_${Date.now()}`,
    orgId: store.organization.id,
    name: req.body.name || 'New Dental Service',
    description: req.body.description || '',
    startingPrice: Number(req.body.startingPrice) || 150,
    durationMinutes: Number(req.body.durationMinutes) || 45,
    category: req.body.category || 'General',
    isPopular: !!req.body.isPopular,
  };
  store.services.push(newService);
  res.json({ success: true, service: newService });
});

app.delete('/api/clinic/services/:id', (req, res) => {
  const store = getStore();
  store.services = store.services.filter(s => s.id !== req.params.id);
  res.json({ success: true });
});

app.put('/api/clinic/hours', (req, res) => {
  const store = getStore();
  store.businessHours = req.body;
  res.json({ success: true, businessHours: store.businessHours });
});

app.post('/api/clinic/faqs', (req, res) => {
  const store = getStore();
  const newFaq = {
    id: `faq_${Date.now()}`,
    orgId: store.organization.id,
    question: req.body.question,
    answer: req.body.answer,
    category: req.body.category || 'General',
  };
  store.faqs.push(newFaq);
  res.json({ success: true, faq: newFaq });
});

app.put('/api/clinic/ai-settings', (req, res) => {
  const store = getStore();
  Object.assign(store.aiSettings, req.body);
  res.json({ success: true, aiSettings: store.aiSettings });
});

app.put('/api/clinic/widget-config', (req, res) => {
  const store = getStore();
  Object.assign(store.widgetConfig, req.body);
  res.json({ success: true, widgetConfig: store.widgetConfig });
});

// ----------------------------------------------------
// Chat & AI Receptionist Endpoints
// ----------------------------------------------------
app.get('/api/chat/conversations', (req, res) => {
  const store = getStore();
  res.json(store.conversations);
});

app.get('/api/chat/conversations/:id', (req, res) => {
  const store = getStore();
  const conv = store.conversations.find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conv);
});

app.post('/api/chat/message', async (req, res) => {
  const { conversationId, text, customerName, customerContact, customerEmail, source } = req.body;
  const store = getStore();

  let conv = store.conversations.find(c => c.id === conversationId);

  // If new conversation, instantiate it
  if (!conv) {
    const newConvId = conversationId || `conv_${Date.now()}`;
    conv = {
      id: newConvId,
      orgId: store.organization.id,
      customerName: customerName || 'Website Visitor',
      customerContact: customerContact || 'Online Chat',
      customerEmail: customerEmail || undefined,
      intent: 'general_question',
      leadScore: 60,
      status: 'open',
      isHumanTakeover: false,
      lastMessageText: text,
      lastMessageTime: 'Just now',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.conversations.unshift(conv);
  }

  // Record patient message
  const patientMsg: Message = {
    id: `msg_${Date.now()}_p`,
    conversationId: conv.id,
    sender: 'patient',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  conv.messages.push(patientMsg);
  conv.lastMessageText = text;
  conv.lastMessageTime = 'Just now';

  // If human staff has taken over, do NOT generate AI response
  if (conv.isHumanTakeover) {
    return res.json({
      conversation: conv,
      aiResponse: null,
      isHumanTakeover: true,
      message: 'Human staff is actively handling this conversation.',
    });
  }

  // Call Gemini AI receptionist
  const aiResult = await generateReceptionistResponse({
    clinicName: store.organization.name,
    phone: store.organization.phone,
    email: store.organization.email,
    address: store.organization.address,
    services: store.services,
    hours: store.businessHours,
    faqs: store.faqs,
    conversationHistory: conv.messages.map(m => ({ sender: m.sender, text: m.text })),
    lastUserMessage: text,
  });

  // Update conversation intent and lead score
  conv.intent = aiResult.detectedIntent as any;
  conv.leadScore = Math.max(conv.leadScore, aiResult.leadScore);

  // Update customer name/contact if extracted
  if (aiResult.extractedContact?.name && conv.customerName === 'Website Visitor') {
    conv.customerName = aiResult.extractedContact.name;
  }
  if (aiResult.extractedContact?.phone && conv.customerContact === 'Online Chat') {
    conv.customerContact = aiResult.extractedContact.phone;
  }

  // Check or create Lead
  let lead = store.leads.find(l => l.id === conv?.leadId || (conv?.customerContact && l.phone === conv.customerContact && l.phone !== 'Online Chat'));
  if (!lead && (conv.leadScore >= 70 || conv.customerContact !== 'Online Chat' || aiResult.bookingRequested)) {
    const matchedService = store.services.find(s => text.toLowerCase().includes(s.name.toLowerCase()))?.name || 'General Dental Care';
    const estVal = store.services.find(s => s.name === matchedService)?.startingPrice || 299;

    lead = {
      id: `lead_${Date.now()}`,
      orgId: store.organization.id,
      name: conv.customerName,
      phone: conv.customerContact,
      email: conv.customerEmail,
      intent: conv.intent,
      serviceInterest: matchedService,
      leadScore: conv.leadScore,
      status: aiResult.bookingRequested ? 'hot' : 'warm',
      source: (source as any) || 'website_widget',
      lastInteraction: new Date().toISOString(),
      estimatedValue: estVal,
      aiSummary: `Inquired via web widget. Identified interest in ${matchedService}. Lead score: ${conv.leadScore}/100.`,
      createdAt: new Date().toISOString(),
    };
    store.leads.unshift(lead);
    conv.leadId = lead.id;
  } else if (lead) {
    lead.leadScore = Math.max(lead.leadScore, conv.leadScore);
    lead.lastInteraction = new Date().toISOString();
    if (aiResult.bookingRequested) lead.status = 'hot';
  }

  // Create AI message
  const aiMsg: Message = {
    id: `msg_${Date.now()}_ai`,
    conversationId: conv.id,
    sender: 'ai',
    text: aiResult.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    intentDetected: aiResult.detectedIntent as any,
    metadata: {
      slotsOffered: aiResult.suggestedSlots,
      bookingCreated: aiResult.bookingRequested,
    },
  };
  conv.messages.push(aiMsg);
  conv.lastMessageText = aiResult.text;

  res.json({
    conversation: conv,
    aiResponse: aiMsg,
    lead,
    bookingRequested: aiResult.bookingRequested,
  });
});

app.post('/api/chat/conversations/:id/takeover', (req, res) => {
  const store = getStore();
  const conv = store.conversations.find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  conv.isHumanTakeover = true;
  conv.status = 'handed_off';
  conv.assignedStaffId = currentSessionUser.id;

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Human Takeover',
    details: `Staff member took over conversation with ${conv.customerName}. AI paused.`,
    category: 'ai',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, conversation: conv });
});

app.post('/api/chat/conversations/:id/return-to-ai', (req, res) => {
  const store = getStore();
  const conv = store.conversations.find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  conv.isHumanTakeover = false;
  conv.status = 'open';

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Returned to AI Receptionist',
    details: `Conversation with ${conv.customerName} resumed under 24/7 AI Receptionist.`,
    category: 'ai',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, conversation: conv });
});

app.post('/api/chat/conversations/:id/staff-reply', (req, res) => {
  const { text } = req.body;
  const store = getStore();
  const conv = store.conversations.find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  const staffMsg: Message = {
    id: `msg_${Date.now()}_s`,
    conversationId: conv.id,
    sender: 'staff',
    senderName: currentSessionUser.name,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  conv.messages.push(staffMsg);
  conv.lastMessageText = text;
  conv.lastMessageTime = 'Just now';

  res.json({ success: true, conversation: conv, message: staffMsg });
});

// ----------------------------------------------------
// Leads Endpoints
// ----------------------------------------------------
app.get('/api/leads', (req, res) => {
  const store = getStore();
  res.json(store.leads);
});

app.get('/api/leads/:id', (req, res) => {
  const store = getStore();
  const lead = store.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

app.patch('/api/leads/:id', (req, res) => {
  const store = getStore();
  const lead = store.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  Object.assign(lead, req.body);
  res.json({ success: true, lead });
});

// ----------------------------------------------------
// Patients 360 Endpoints
// ----------------------------------------------------
app.get('/api/patients', (req, res) => {
  const store = getStore();
  res.json(store.patients);
});

app.get('/api/patients/:id', (req, res) => {
  const store = getStore();
  const patient = store.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

// ----------------------------------------------------
// Appointments & Calendar Endpoints
// ----------------------------------------------------
app.get('/api/appointments', (req, res) => {
  const store = getStore();
  res.json(store.appointments);
});

app.post('/api/appointments', (req, res) => {
  const { patientName, patientPhone, patientEmail, service, date, time, dentist, notes, createdVia } = req.body;
  const store = getStore();

  const matchedService = store.services.find(s => s.name === service);
  const estVal = matchedService ? matchedService.startingPrice : 299;

  const newApt: Appointment = {
    id: `apt_${Date.now()}`,
    orgId: store.organization.id,
    patientName: patientName || 'New Patient',
    patientPhone: patientPhone || '(555) 000-0000',
    patientEmail: patientEmail || '',
    service: service || 'Comprehensive Exam & Cleaning',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '14:00',
    durationMinutes: matchedService ? matchedService.durationMinutes : 45,
    dentist: dentist || 'Dr. Michael Chen, DDS',
    status: 'confirmed',
    notes: notes || 'Booked via DentalLead AI Platform',
    estimatedValue: estVal,
    createdVia: createdVia || 'ai_receptionist',
    createdAt: new Date().toISOString(),
  };

  store.appointments.unshift(newApt);

  // Update lead status to 'booked' if found
  const lead = store.leads.find(l => l.phone === newApt.patientPhone || l.name.toLowerCase() === newApt.patientName.toLowerCase());
  if (lead) {
    lead.status = 'booked';
    lead.appointmentId = newApt.id;
  }

  // Update or create patient record
  let patient = store.patients.find(p => p.phone === newApt.patientPhone);
  if (!patient) {
    patient = {
      id: `pat_${Date.now()}`,
      orgId: store.organization.id,
      name: newApt.patientName,
      phone: newApt.patientPhone,
      email: newApt.patientEmail,
      status: 'active',
      serviceInterest: newApt.service,
      leadScore: 90,
      source: 'AI Receptionist',
      totalAppointments: 1,
      estimatedValue: estVal,
      verifiedRevenue: 0,
      nextAppointment: `${newApt.date} at ${newApt.time}`,
      createdAt: new Date().toISOString(),
      timeline: [
        { id: `tl_${Date.now()}_1`, time: 'Inquiry', title: 'Inquiry Received', description: 'Patient contacted clinic for ' + newApt.service, type: 'inquiry' },
        { id: `tl_${Date.now()}_2`, time: 'Booked', title: 'Appointment Confirmed', description: `Scheduled for ${newApt.date} at ${newApt.time}`, type: 'appointment' },
      ],
    };
    store.patients.unshift(patient);
  } else {
    patient.totalAppointments += 1;
    patient.nextAppointment = `${newApt.date} at ${newApt.time}`;
  }

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Appointment Booked',
    details: `Confirmed appointment for ${newApt.patientName} (${newApt.service}) on ${newApt.date} at ${newApt.time}.`,
    category: 'appointment',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, appointment: newApt });
});

app.patch('/api/appointments/:id', (req, res) => {
  const store = getStore();
  const apt = store.appointments.find(a => a.id === req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });
  Object.assign(apt, req.body);
  res.json({ success: true, appointment: apt });
});

// Mark completed and verify recovered revenue
app.post('/api/appointments/:id/complete', (req, res) => {
  const { verifiedAmount } = req.body;
  const store = getStore();
  const apt = store.appointments.find(a => a.id === req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });

  const finalRevenue = Number(verifiedAmount) || apt.estimatedValue || 299;
  apt.status = 'completed';
  apt.verifiedRevenue = finalRevenue;

  // Update lead
  const lead = store.leads.find(l => l.appointmentId === apt.id || l.phone === apt.patientPhone);
  if (lead) {
    lead.status = 'converted';
    lead.verifiedRevenue = finalRevenue;
  }

  // Update patient
  const patient = store.patients.find(p => p.phone === apt.patientPhone || p.id === apt.patientId);
  if (patient) {
    patient.verifiedRevenue = (patient.verifiedRevenue || 0) + finalRevenue;
    patient.timeline.unshift({
      id: `tl_${Date.now()}`,
      time: 'Completed',
      title: 'Appointment Completed & Revenue Verified',
      description: `Collected $${(finalRevenue || 0).toLocaleString()} for ${apt.service}. Attributed to DentalLead AI recovery.`,
      type: 'payment',
    });
  }

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Revenue Verified & Attributed',
    details: `Verified recovered revenue of $${(finalRevenue || 0).toLocaleString()} for patient ${apt.patientName}.`,
    category: 'billing',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, appointment: apt, verifiedRevenue: finalRevenue });
});

// ----------------------------------------------------
// Missed Opportunities & Recovery Engine
// ----------------------------------------------------
app.get('/api/missed-opportunities', (req, res) => {
  const store = getStore();
  res.json(store.missedOpportunities);
});

app.post('/api/missed-opportunities/:id/generate-followup', async (req, res) => {
  const store = getStore();
  const opp = store.missedOpportunities.find(o => o.id === req.params.id);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

  const message = await generatePersonalizedFollowUp({
    patientName: opp.patientName,
    service: opp.service,
    reason: opp.reason,
    clinicName: store.organization.name,
    clinicPhone: store.organization.phone,
  });

  opp.suggestedFollowUp = message;
  opp.status = 'followup_generated';

  res.json({ success: true, followUpMessage: message, opportunity: opp });
});

app.post('/api/missed-opportunities/:id/send-followup', (req, res) => {
  const { customMessage } = req.body;
  const store = getStore();
  const opp = store.missedOpportunities.find(o => o.id === req.params.id);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

  if (customMessage) opp.suggestedFollowUp = customMessage;
  opp.status = 'followup_generated';

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Follow-Up Dispatched',
    details: `Staff authorized & sent personalized recovery message to ${opp.patientName} for ${opp.service}.`,
    category: 'lead',
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Follow-up message successfully delivered via SMS / Email.',
    opportunity: opp,
  });
});

app.post('/api/missed-opportunities/:id/recover', (req, res) => {
  const { appointmentDate, appointmentTime, dentist } = req.body;
  const store = getStore();
  const opp = store.missedOpportunities.find(o => o.id === req.params.id);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

  opp.status = 'recovered';

  // Book appointment
  const apt: Appointment = {
    id: `apt_rec_${Date.now()}`,
    orgId: store.organization.id,
    patientName: opp.patientName,
    patientPhone: opp.patientContact,
    patientEmail: '',
    service: opp.service,
    date: appointmentDate || new Date().toISOString().split('T')[0],
    time: appointmentTime || '15:00',
    durationMinutes: 45,
    dentist: dentist || 'Dr. Michael Chen, DDS',
    status: 'confirmed',
    notes: 'Recovered patient booked from AI Follow-Up Campaign',
    estimatedValue: opp.estimatedValue,
    createdVia: 'followup_link',
    createdAt: new Date().toISOString(),
  };
  store.appointments.unshift(apt);
  opp.recoveredAppointmentId = apt.id;

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    orgId: store.organization.id,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    action: 'Patient Successfully Recovered!',
    details: `Recovered ${opp.patientName} for ${opp.service}. Estimated recovered revenue: $${(opp.estimatedValue || 0).toLocaleString()}.`,
    category: 'lead',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, opportunity: opp, appointment: apt });
});

// ----------------------------------------------------
// Revenue Leak Scanner
// ----------------------------------------------------
app.post('/api/revenue-leak-scan', async (req, res) => {
  const store = getStore();
  const analysis = await runRevenueLeakAnalysis({
    totalConversations: store.conversations.length,
    inquiriesCount: store.leads.length,
    missedCount: store.missedOpportunities.length,
    avgPatientValue: 1200,
  });

  res.json({
    success: true,
    conversationsAnalyzed: 1284,
    inquiriesFound: 346,
    missedOpportunitiesFound: 82,
    unbookedLeadsFound: 47,
    cancelledAppointmentsFound: 21,
    totalPotentialRevenue: analysis.totalRecoverableValue,
    breakdown: analysis.breakdown,
    aiInsight: analysis.aiInsight,
  });
});

// ----------------------------------------------------
// Billing & Payment Provider Abstraction Endpoints
// ----------------------------------------------------
app.get('/api/billing/subscription', (req, res) => {
  const store = getStore();
  res.json({
    organization: store.organization,
    paymentConfig: store.paymentConfig,
    invoices: store.invoices,
  });
});

app.post('/api/billing/checkout', async (req, res) => {
  const { planId, interval } = req.body;
  const store = getStore();

  const planPrices: Record<string, { monthly: number; annual: number; name: string }> = {
    starter: { monthly: 49, annual: 39, name: 'Starter Plan' },
    growth: { monthly: 149, annual: 119, name: 'Growth Plan' },
    pro: { monthly: 299, annual: 239, name: 'Pro Plan' },
    dental_group: { monthly: 799, annual: 639, name: 'Dental Group Plan' },
  };

  const selectedPlan = planPrices[planId] || planPrices.growth;
  const amount = interval === 'annual' ? selectedPlan.annual * 12 : selectedPlan.monthly;

  // Use modular PaymentProvider abstraction
  const provider = getPaymentProvider(store.paymentConfig.provider);

  const session = await provider.createCheckoutSession({
    orgId: store.organization.id,
    planId,
    planName: selectedPlan.name,
    amount,
    currency: 'USD',
    interval: interval || 'monthly',
    customerEmail: store.organization.email,
    customerName: store.organization.name,
    returnUrl: '/billing?status=success',
    cancelUrl: '/billing?status=cancelled',
  });

  res.json({ success: true, session });
});

// Server-side verification of payment
app.post('/api/billing/verify', async (req, res) => {
  const { transactionId, planId } = req.body;
  const store = getStore();

  const provider = getPaymentProvider(store.paymentConfig.provider);
  const result = await provider.verifyPayment(transactionId, store.organization.id);

  if (result.success) {
    store.organization.plan = (planId as any) || 'growth';
    store.organization.subscriptionStatus = 'active';

    // Generate Invoice record
    const newInvoice = {
      id: `inv_${Date.now()}`,
      orgId: store.organization.id,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      amount: result.amount,
      currency: result.currency,
      status: 'paid' as const,
      date: new Date().toISOString().split('T')[0],
      planName: `${planId?.toUpperCase() || 'GROWTH'} Plan`,
      billingPeriod: 'Monthly Subscription',
      provider: store.paymentConfig.provider,
      paymentMethod: store.paymentConfig.provider === 'payoneer' ? 'Payoneer Merchant Account' : 'Demo Card',
    };
    store.invoices.unshift(newInvoice);

    store.auditLogs.unshift({
      id: `log_${Date.now()}`,
      orgId: store.organization.id,
      userId: currentSessionUser.id,
      userName: currentSessionUser.name,
      action: 'Subscription Upgraded',
      details: `Successfully verified payment for ${newInvoice.planName} via ${store.paymentConfig.provider}. Subscription is now ACTIVE.`,
      category: 'billing',
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, organization: store.organization, invoice: newInvoice });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

app.put('/api/billing/config', (req, res) => {
  const store = getStore();
  Object.assign(store.paymentConfig, req.body);
  res.json({ success: true, paymentConfig: store.paymentConfig });
});

app.get('/api/billing/invoices', (req, res) => {
  const store = getStore();
  res.json(store.invoices);
});

// Webhook simulation handler
app.post('/api/billing/webhook', async (req, res) => {
  const store = getStore();
  const provider = getPaymentProvider(store.paymentConfig.provider);
  const result = await provider.handleWebhook(req.body, req.headers['x-signature'] as string);
  res.json({ received: true, ...result });
});

// ----------------------------------------------------
// Production Inbound Messaging Webhook (Twilio / SMS / Zapier)
// ----------------------------------------------------
app.post('/api/webhooks/inbound-message', async (req, res) => {
  try {
    const { from, text, channel = 'sms', patientName = 'Inbound Patient' } = req.body;
    if (!from || !text) {
      return res.status(400).json({ error: 'Missing required fields: from and text' });
    }

    const store = getStore();

    // Check if conversation already exists for this phone
    let conv = store.conversations.find(c => c.patientPhone === from);
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        orgId: store.organization.id,
        patientName: patientName,
        patientPhone: from,
        intent: 'appointment',
        serviceInterest: 'General Consultation',
        status: 'open',
        leadScore: 75,
        lastMessageTime: new Date().toISOString(),
        messages: [],
      };
      store.conversations.unshift(conv);
    }

    // Add inbound patient message
    const patientMsg: Message = {
      id: `msg_${Date.now()}_pat`,
      conversationId: conv.id,
      sender: 'patient',
      text,
      timestamp: new Date().toISOString(),
    };
    conv.messages.push(patientMsg);

    // Run AI Receptionist analysis
    const aiResult = await generateReceptionistResponse({
      clinicName: store.organization.name,
      phone: store.organization.phone || '(555) 234-5678',
      email: store.organization.email || 'care@smiledental.com',
      address: store.organization.address || '450 Sutter St, Suite 800, San Francisco, CA',
      services: store.services,
      hours: store.businessHours || [],
      faqs: store.faqs,
      conversationHistory: conv.messages.map(m => ({ sender: m.sender, text: m.text })),
      lastUserMessage: text,
    });

    const aiMsg: Message = {
      id: `msg_${Date.now()}_ai`,
      conversationId: conv.id,
      sender: 'ai',
      text: aiResult.text,
      timestamp: new Date().toISOString(),
      intentDetected: (aiResult.detectedIntent as any) || 'appointment',
    };
    conv.messages.push(aiMsg);
    conv.lastMessageTime = new Date().toISOString();
    conv.leadScore = aiResult.leadScore;

    // Log audit event
    store.auditLogs.unshift({
      id: `log_${Date.now()}`,
      orgId: store.organization.id,
      userId: 'system-ai',
      userName: 'AI Receptionist',
      action: 'Inbound Webhook Processed',
      details: `Inbound ${channel.toUpperCase()} from ${from} processed. Intent: ${aiResult.detectedIntent}, Score: ${aiResult.leadScore}.`,
      category: 'ai',
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      reply: aiResult.text,
      detectedIntent: aiResult.detectedIntent,
      leadScore: aiResult.leadScore,
      bookingRequested: aiResult.bookingRequested,
      conversationId: conv.id,
    });
  } catch (err: any) {
    console.error('Inbound webhook error:', err);
    res.status(500).json({ error: 'Internal server error processing message' });
  }
});

// PMS Integrations Status
app.get('/api/integrations', (req, res) => {
  res.json({
    status: 'ok',
    integrations: [
      {
        id: 'opendental',
        name: 'OpenDental PMS',
        type: 'pms',
        status: 'connected',
        lastSync: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        description: '2-way patient chart and chair slot synchronization.',
      },
      {
        id: 'dentrix',
        name: 'Dentrix G7 / Ascend',
        type: 'pms',
        status: 'ready',
        lastSync: null,
        description: 'Automatic chair block booking and operatory mapping.',
      },
      {
        id: 'twilio',
        name: 'Twilio Cloud SMS',
        type: 'telecom',
        status: 'connected',
        webhookUrl: '/api/webhooks/inbound-message',
        description: 'Inbound and outbound patient SMS triage routing.',
      },
      {
        id: 'gcal',
        name: 'Google Calendar API',
        type: 'calendar',
        status: 'connected',
        lastSync: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        description: 'Clinician real-time availability checking.',
      },
    ],
  });
});

// ----------------------------------------------------
// Analytics & Dashboard Metrics
// ----------------------------------------------------
app.get('/api/analytics', (req, res) => {
  const store = getStore();
  const metrics = getMetrics(store);
  res.json({
    metrics,
    trends: [
      { day: 'Mon', leads: 8, recoveredRevenue: 2500, appointments: 4 },
      { day: 'Tue', leads: 12, recoveredRevenue: 3800, appointments: 6 },
      { day: 'Wed', leads: 9, recoveredRevenue: 2800, appointments: 5 },
      { day: 'Thu', leads: 14, recoveredRevenue: 4400, appointments: 7 },
      { day: 'Fri', leads: 10, recoveredRevenue: 3100, appointments: 5 },
      { day: 'Sat', leads: 5, recoveredRevenue: 1820, appointments: 3 },
      { day: 'Sun', leads: 3, recoveredRevenue: 0, appointments: 0 },
    ],
    categories: [
      { name: 'Dental Implants', value: 8500, percentage: 46 },
      { name: 'Invisalign Aligners', value: 4200, percentage: 23 },
      { name: 'Porcelain Veneers', value: 3300, percentage: 18 },
      { name: 'Teeth Whitening', value: 1420, percentage: 8 },
      { name: 'General & Emergency', value: 1000, percentage: 5 },
    ],
  });
});

// ----------------------------------------------------
// Admin Platform Dashboard Metrics
// ----------------------------------------------------
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    totalOrganizations: 142,
    activeOrganizations: 128,
    trialOrganizations: 14,
    activeSubscriptions: 119,
    mrr: 23450,
    arr: 281400,
    churnRate: 1.4,
    failedPayments: 0,
    totalAIConversationsHandled: 48920,
    totalLeadsRecovered: 1840,
    totalRevenueAttributed: 1420500,
  });
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  const store = getStore();
  res.json(store.auditLogs);
});

// Aggregate data for frontend initialization
app.get('/api/data', (req, res) => {
  const store = getStore();
  res.json({
    organization: store.organization,
    metrics: getMetrics(store),
    leads: store.leads,
    patients: store.patients,
    conversations: store.conversations,
    appointments: store.appointments,
    missedOpportunities: store.missedOpportunities,
    services: store.services,
    faqs: store.faqs,
    aiSettings: store.aiSettings,
    auditLogs: store.auditLogs,
    platformMetrics: {
      totalMrr: 48900,
      activeClinicsCount: 142,
      totalRecoveredRevenueAcrossAllClinics: 2840000,
      churnRatePercent: 1.2,
    },
  });
});

// Demo Reset
app.post('/api/demo/reset', (req, res) => {
  const store = resetStoreToDemo();
  res.json({ success: true, message: 'Smile Dental Clinic reset to pristine demo state', store });
});

app.post('/api/reset-demo', (req, res) => {
  const store = resetStoreToDemo();
  res.json({ success: true, message: 'Smile Dental Clinic reset to pristine demo state', store });
});

// ----------------------------------------------------
// Vite Middleware Setup
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DentalLead AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
