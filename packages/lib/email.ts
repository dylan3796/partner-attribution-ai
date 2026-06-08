import { Resend } from 'resend';

// Initialize Resend - will be undefined if API key not set
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

// TODO: switch back to notifications@covant.ai once domain is verified in Resend
const FROM_ADDRESS = process.env.RESEND_DOMAIN_VERIFIED === 'true'
  ? 'Covant <notifications@covant.ai>'
  : 'Covant <onboarding@resend.dev>';
const PORTAL_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://covant.ai';

// Check if email is configured
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Base email template with dark theme
function emailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Covant</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #141414; border-radius: 12px; border: 1px solid #262626;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #262626;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">Covant</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #262626;">
              <p style="margin: 0; font-size: 12px; color: #737373; line-height: 1.5;">
                This email was sent by Covant. You're receiving this because you're part of a partner program.
              </p>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #525252;">
                © ${new Date().getFullYear()} Covant. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// CTA Button component
function ctaButton(text: string, url: string): string {
  return `
<table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
  <tr>
    <td style="background-color: #6366f1; border-radius: 8px;">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
        ${text}
      </a>
    </td>
  </tr>
</table>
  `.trim();
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(date: Date | string | number): string {
  const d = typeof date === 'object' ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Send deal approved notification to partner
 */
export async function sendDealApproved(
  to: string,
  partnerName: string,
  dealName: string,
  amount: number,
  commissionAmount: number
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log('[Email] Skipping sendDealApproved - RESEND_API_KEY not configured');
    return { success: false, error: 'Email not configured' };
  }

  const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">
  Deal Approved 🎉
</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${partnerName},<br><br>
  Great news! Your deal has been approved.
</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr>
    <td style="padding: 20px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #737373;">Deal Name</p>
      <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">${dealName}</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td width="50%">
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">Deal Value</p>
            <p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">${formatCurrency(amount)}</p>
          </td>
          <td width="50%">
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">Your Commission</p>
            <p style="margin: 0; font-size: 20px; font-weight: 700; color: #22c55e;">${formatCurrency(commissionAmount)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
  Your commission will be processed according to your payout schedule. Track all your deals in the partner portal.
</p>
${ctaButton('View in Portal', `${PORTAL_URL}/portal`)}
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Deal approved: ${dealName}`,
      html: emailTemplate(content),
    });

    if (error) {
      console.error('[Email] sendDealApproved error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent deal approved notification to ${to}`);
    return { success: true };
  } catch (err) {
    console.error('[Email] sendDealApproved exception:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send commission paid notification to partner
 */
export async function sendCommissionPaid(
  to: string,
  partnerName: string,
  amount: number,
  dealName: string,
  payoutDate: Date | string | number
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log('[Email] Skipping sendCommissionPaid - RESEND_API_KEY not configured');
    return { success: false, error: 'Email not configured' };
  }

  const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">
  Commission Paid 💸
</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${partnerName},<br><br>
  Your commission has been processed and sent to your account.
</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr>
    <td style="padding: 20px; text-align: center;">
      <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">Amount Paid</p>
      <p style="margin: 0 0 16px 0; font-size: 36px; font-weight: 700; color: #22c55e;">${formatCurrency(amount)}</p>
      <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">For Deal</p>
      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #ffffff;">${dealName}</p>
      <p style="margin: 0; font-size: 13px; color: #525252;">Processed on ${formatDate(payoutDate)}</p>
    </td>
  </tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
  Funds should arrive in your account within 2-3 business days depending on your payment method.
</p>
${ctaButton('View Payout History', `${PORTAL_URL}/portal/payouts`)}
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Commission paid: ${formatCurrency(amount)}`,
      html: emailTemplate(content),
    });

    if (error) {
      console.error('[Email] sendCommissionPaid error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent commission paid notification to ${to}`);
    return { success: true };
  } catch (err) {
    console.error('[Email] sendCommissionPaid exception:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send partner invite email
 */
export async function sendPartnerInvite(
  to: string,
  partnerName: string,
  orgName: string,
  inviteUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log('[Email] Skipping sendPartnerInvite - RESEND_API_KEY not configured');
    return { success: false, error: 'Email not configured' };
  }

  const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">
  You're Invited! 🤝
</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${partnerName},<br><br>
  <strong style="color: #ffffff;">${orgName}</strong> has invited you to join their partner program on Covant.
</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr>
    <td style="padding: 20px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #ffffff;">What is Covant?</p>
      <p style="margin: 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
        Covant is a partner relationship management platform. As a partner, you'll be able to:
      </p>
      <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #d4d4d4; font-size: 14px; line-height: 1.8;">
        <li>Register deals and track their progress</li>
        <li>View your commission attributions in real-time</li>
        <li>Access training materials and resources</li>
        <li>Track payouts and earnings</li>
      </ul>
    </td>
  </tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
  Click below to accept the invitation and set up your partner account.
</p>
${ctaButton('Accept Invitation', inviteUrl)}
<p style="margin: 24px 0 0 0; font-size: 12px; color: #525252;">
  If you didn't expect this invitation, you can safely ignore this email.
</p>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `You're invited to ${orgName}'s partner program`,
      html: emailTemplate(content),
    });

    if (error) {
      console.error('[Email] sendPartnerInvite error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent partner invite to ${to}`);
    return { success: true };
  } catch (err) {
    console.error('[Email] sendPartnerInvite exception:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send deal registration received notification
 */
export async function sendDealRegistered(
  to: string,
  partnerName: string,
  dealName: string,
  status: 'pending' | 'approved' | 'rejected' = 'pending'
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log('[Email] Skipping sendDealRegistered - RESEND_API_KEY not configured');
    return { success: false, error: 'Email not configured' };
  }

  const statusInfo = {
    pending: {
      emoji: '📋',
      color: '#f59e0b',
      text: 'Pending Review',
      description: 'Your deal registration has been received and is awaiting review by the partner team.',
    },
    approved: {
      emoji: '✅',
      color: '#22c55e',
      text: 'Approved',
      description: 'Your deal registration has been approved! You can now track its progress.',
    },
    rejected: {
      emoji: '❌',
      color: '#ef4444',
      text: 'Needs Attention',
      description: 'There was an issue with your deal registration. Please check the portal for details.',
    },
  }[status];

  const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">
  Deal Registration Received ${statusInfo.emoji}
</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${partnerName},<br><br>
  We've received your deal registration.
</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr>
    <td style="padding: 20px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #737373;">Deal Name</p>
      <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">${dealName}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #737373;">Status</p>
      <span style="display: inline-block; padding: 6px 12px; background-color: ${statusInfo.color}20; border-radius: 6px; font-size: 14px; font-weight: 600; color: ${statusInfo.color};">
        ${statusInfo.text}
      </span>
    </td>
  </tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
  ${statusInfo.description}
</p>
<p style="margin: 16px 0 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
  <strong style="color: #d4d4d4;">What happens next?</strong><br>
  The partner team will review your registration, typically within 1-2 business days. You'll receive another notification once a decision is made.
</p>
${ctaButton('Track Deal Status', `${PORTAL_URL}/portal/deals`)}
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Deal registration received: ${dealName}`,
      html: emailTemplate(content),
    });

    if (error) {
      console.error('[Email] sendDealRegistered error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent deal registered notification to ${to}`);
    return { success: true };
  } catch (err) {
    console.error('[Email] sendDealRegistered exception:', err);
    return { success: false, error: String(err) };
  }
}

// Export all email types for the test endpoint
export const EMAIL_TYPES = ['deal_approved', 'commission_paid', 'partner_invite', 'deal_registered'] as const;
export type EmailType = typeof EMAIL_TYPES[number];
