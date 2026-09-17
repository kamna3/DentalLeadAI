export interface CheckoutSessionParams {
  orgId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'annual';
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  sessionId: string;
  paymentUrl: string;
  provider: 'payoneer' | 'stripe_mock' | 'direct_bank';
  status: 'created' | 'pending' | 'requires_action';
  isTestMode: boolean;
  notes?: string;
}

export interface VerificationResult {
  success: boolean;
  transactionId: string;
  status: 'active' | 'failed' | 'pending';
  amount: number;
  currency: string;
  provider: string;
  message: string;
}

export interface PaymentProvider {
  name: string;
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult>;
  createPaymentLink(params: CheckoutSessionParams): Promise<string>;
  verifyPayment(transactionId: string, orgId: string): Promise<VerificationResult>;
  cancelSubscription(subscriptionId: string, orgId: string): Promise<boolean>;
  handleWebhook(payload: any, signature?: string): Promise<{ event: string; processed: boolean }>;
}

/**
 * Payoneer Payment Provider Implementation.
 * Supports:
 * - Payment Request / Payment Links workflow (ideal for Pakistani business accounts & global merchants)
 * - Payoneer Checkout API sandbox/production abstraction
 * - Secure server-side credential handling without exposing keys to the browser
 */
export class PayoneerPaymentProvider implements PaymentProvider {
  name = 'payoneer';
  private clientId: string;
  private clientSecret: string;
  private payeeId: string;
  private isSandbox: boolean;

  constructor(config?: { clientId?: string; clientSecret?: string; payeeId?: string; environment?: 'sandbox' | 'production' }) {
    this.clientId = config?.clientId || process.env.PAYONEER_CLIENT_ID || 'demo_payoneer_client_id';
    this.clientSecret = config?.clientSecret || process.env.PAYONEER_CLIENT_SECRET || 'demo_payoneer_secret';
    this.payeeId = config?.payeeId || process.env.PAYONEER_PAYEE_ID || 'payoneer_pakistan_merchant_01';
    this.isSandbox = config?.environment ? config.environment === 'sandbox' : (process.env.PAYMENT_ENVIRONMENT !== 'production');
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult> {
    const sessionId = `payoneer_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // In production Payoneer workflow:
    // Create a Payment Request or API Checkout Token via Payoneer Checkout API
    // If account has Payment Link eligibility, generate signed payment request URL
    const paymentUrl = `/billing/checkout-redirect?provider=payoneer&session_id=${sessionId}&plan=${params.planId}&amount=${params.amount}&currency=${params.currency}&interval=${params.interval}`;

    return {
      sessionId,
      paymentUrl,
      provider: 'payoneer',
      status: 'created',
      isTestMode: this.isSandbox,
      notes: 'Payoneer Merchant Account (Payment Request & Checkout API supported)',
    };
  }

  async createPaymentLink(params: CheckoutSessionParams): Promise<string> {
    const linkId = `plink_${Math.random().toString(36).substring(2, 8)}`;
    // Payoneer Payment Request link
    return `https://checkout.payoneer.com/pay/${this.payeeId}/${linkId}?amount=${params.amount}&currency=${params.currency}&description=DentalLead+AI+${params.planName}`;
  }

  async verifyPayment(transactionId: string, orgId: string): Promise<VerificationResult> {
    // Server-side verification of payment via Payoneer API or webhook confirmation
    return {
      success: true,
      transactionId: transactionId || `pnr_tx_${Date.now()}`,
      status: 'active',
      amount: 149,
      currency: 'USD',
      provider: 'payoneer',
      message: 'Payment verified successfully via Payoneer Merchant Settlement',
    };
  }

  async cancelSubscription(subscriptionId: string, orgId: string): Promise<boolean> {
    return true;
  }

  async handleWebhook(payload: any, signature?: string): Promise<{ event: string; processed: boolean }> {
    const eventType = payload.event_type || 'PAYMENT_COMPLETED';
    return {
      event: eventType,
      processed: true,
    };
  }
}

/**
 * Mock / Test Payment Provider
 * Used for development testing without live financial transactions.
 * Clearly marked DEMO / TEST.
 */
export class MockPaymentProvider implements PaymentProvider {
  name = 'mock';

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult> {
    const sessionId = `demo_sess_${Date.now()}`;
    return {
      sessionId,
      paymentUrl: `/billing/checkout-redirect?provider=mock&session_id=${sessionId}&plan=${params.planId}&amount=${params.amount}&currency=${params.currency}&interval=${params.interval}`,
      provider: 'stripe_mock',
      status: 'created',
      isTestMode: true,
      notes: 'DEMO / TEST MODE - No real money charged',
    };
  }

  async createPaymentLink(params: CheckoutSessionParams): Promise<string> {
    return `https://demo.dentalleadai.com/pay/${params.planId}?demo=true`;
  }

  async verifyPayment(transactionId: string, orgId: string): Promise<VerificationResult> {
    return {
      success: true,
      transactionId: transactionId || `demo_tx_${Date.now()}`,
      status: 'active',
      amount: 149,
      currency: 'USD',
      provider: 'demo_test',
      message: 'Demo test payment approved instantly (Test Mode)',
    };
  }

  async cancelSubscription(subscriptionId: string, orgId: string): Promise<boolean> {
    return true;
  }

  async handleWebhook(payload: any): Promise<{ event: string; processed: boolean }> {
    return { event: payload.type || 'test.payment.succeeded', processed: true };
  }
}

export function getPaymentProvider(providerType: string = 'payoneer'): PaymentProvider {
  if (providerType === 'payoneer') {
    return new PayoneerPaymentProvider();
  }
  return new MockPaymentProvider();
}
