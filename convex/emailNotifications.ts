import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

// Initialize Resend in actions (they run on server)
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const FROM_ADDRESS = "Covant <notifications@covant.ai>";
const PORTAL_URL = process.env.NEXT_PUBLIC_APP_URL || "https://covant.ai";

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Base email template
function emailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #141414; border-radius: 12px; border: 1px solid #262626;">
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #262626;">
              <span style="font-size: 20px; font-weight: 700; color: #ffffff;">Covant</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">${content}</td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #262626;">
              <p style="margin: 0; font-size: 12px; color: #737373;">This email was sent by Covant.</p>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #525252;">© ${new Date().getFullYear()} Covant</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;"><tr><td style="background-color: #6366f1; border-radius: 8px;"><a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">${text}</a></td></tr></table>`;
}

/**
 * Send deal approved email
 */
export const sendDealApprovedEmail = action({
  args: {
    dealId: v.string(),
    partnerEmail: v.string(),
    partnerName: v.string(),
    dealName: v.string(),
    amount: v.number(),
    commissionAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) {
      console.log("[Email] RESEND_API_KEY not configured, skipping email");
      return { success: false, error: "Email not configured" };
    }

    const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff;">Deal Approved 🎉</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${args.partnerName},<br><br>Great news! Your deal has been approved.
</p>
<table role="presentation" width="100%" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr><td style="padding: 20px;">
    <p style="margin: 0 0 12px 0; font-size: 14px; color: #737373;">Deal Name</p>
    <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">${args.dealName}</p>
    <table role="presentation" width="100%"><tr>
      <td width="50%">
        <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">Deal Value</p>
        <p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">${formatCurrency(args.amount)}</p>
      </td>
      <td width="50%">
        <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">Your Commission</p>
        <p style="margin: 0; font-size: 20px; font-weight: 700; color: #22c55e;">${formatCurrency(args.commissionAmount)}</p>
      </td>
    </tr></table>
  </td></tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3;">Your commission will be processed according to your payout schedule.</p>
${ctaButton("View in Portal", `${PORTAL_URL}/portal`)}`;

    try {
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: args.partnerEmail,
        subject: `Deal approved: ${args.dealName}`,
        html: emailTemplate(content),
      });

      if (error) {
        console.error("[Email] sendDealApprovedEmail error:", error);
        return { success: false, error: error.message };
      }

      console.log(`[Email] Sent deal approved to ${args.partnerEmail}`);
      return { success: true };
    } catch (err) {
      console.error("[Email] Exception:", err);
      return { success: false, error: String(err) };
    }
  },
});

/**
 * Send commission paid email
 */
export const sendCommissionPaidEmail = action({
  args: {
    payoutId: v.string(),
    partnerEmail: v.string(),
    partnerName: v.string(),
    amount: v.number(),
    dealName: v.string(),
    paidAt: v.number(),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) {
      console.log("[Email] RESEND_API_KEY not configured, skipping email");
      return { success: false, error: "Email not configured" };
    }

    const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff;">Commission Paid 💸</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${args.partnerName},<br><br>Your commission has been processed and sent to your account.
</p>
<table role="presentation" width="100%" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr><td style="padding: 20px; text-align: center;">
    <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">Amount Paid</p>
    <p style="margin: 0 0 16px 0; font-size: 36px; font-weight: 700; color: #22c55e;">${formatCurrency(args.amount)}</p>
    <p style="margin: 0 0 4px 0; font-size: 14px; color: #737373;">For Deal</p>
    <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #ffffff;">${args.dealName}</p>
    <p style="margin: 0; font-size: 13px; color: #525252;">Processed on ${formatDate(args.paidAt)}</p>
  </td></tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3;">Funds should arrive within 2-3 business days.</p>
${ctaButton("View Payout History", `${PORTAL_URL}/portal/payouts`)}`;

    try {
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: args.partnerEmail,
        subject: `Commission paid: ${formatCurrency(args.amount)}`,
        html: emailTemplate(content),
      });

      if (error) {
        console.error("[Email] sendCommissionPaidEmail error:", error);
        return { success: false, error: error.message };
      }

      console.log(`[Email] Sent commission paid to ${args.partnerEmail}`);
      return { success: true };
    } catch (err) {
      console.error("[Email] Exception:", err);
      return { success: false, error: String(err) };
    }
  },
});

/**
 * Send partner invite email
 */
export const sendPartnerInviteEmail = action({
  args: {
    partnerEmail: v.string(),
    partnerName: v.string(),
    orgName: v.string(),
    inviteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) {
      console.log("[Email] RESEND_API_KEY not configured, skipping email");
      return { success: false, error: "Email not configured" };
    }

    const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff;">You're Invited! 🤝</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${args.partnerName},<br><br>
  <strong style="color: #ffffff;">${args.orgName}</strong> has invited you to join their partner program on Covant.
</p>
<table role="presentation" width="100%" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr><td style="padding: 20px;">
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
  </td></tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3;">Click below to accept the invitation and set up your partner account.</p>
${ctaButton("Accept Invitation", args.inviteUrl)}
<p style="margin: 24px 0 0 0; font-size: 12px; color: #525252;">If you didn't expect this invitation, you can safely ignore this email.</p>`;

    try {
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: args.partnerEmail,
        subject: `You're invited to ${args.orgName}'s partner program`,
        html: emailTemplate(content),
      });

      if (error) {
        console.error("[Email] sendPartnerInviteEmail error:", error);
        return { success: false, error: error.message };
      }

      console.log(`[Email] Sent partner invite to ${args.partnerEmail}`);
      return { success: true };
    } catch (err) {
      console.error("[Email] Exception:", err);
      return { success: false, error: String(err) };
    }
  },
});

/**
 * Send deal registered email
 */
export const sendDealRegisteredEmail = action({
  args: {
    dealId: v.string(),
    partnerEmail: v.string(),
    partnerName: v.string(),
    dealName: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) {
      console.log("[Email] RESEND_API_KEY not configured, skipping email");
      return { success: false, error: "Email not configured" };
    }

    const statusInfo = {
      pending: { emoji: "📋", color: "#f59e0b", text: "Pending Review", desc: "Your deal registration has been received and is awaiting review." },
      approved: { emoji: "✅", color: "#22c55e", text: "Approved", desc: "Your deal registration has been approved!" },
      rejected: { emoji: "❌", color: "#ef4444", text: "Needs Attention", desc: "There was an issue with your deal registration." },
    }[args.status];

    const content = `
<h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff;">Deal Registration Received ${statusInfo.emoji}</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #d4d4d4; line-height: 1.6;">
  Hey ${args.partnerName},<br><br>We've received your deal registration.
</p>
<table role="presentation" width="100%" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #262626; margin-bottom: 24px;">
  <tr><td style="padding: 20px;">
    <p style="margin: 0 0 12px 0; font-size: 14px; color: #737373;">Deal Name</p>
    <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">${args.dealName}</p>
    <p style="margin: 0 0 8px 0; font-size: 14px; color: #737373;">Status</p>
    <span style="display: inline-block; padding: 6px 12px; background-color: ${statusInfo.color}20; border-radius: 6px; font-size: 14px; font-weight: 600; color: ${statusInfo.color};">
      ${statusInfo.text}
    </span>
  </td></tr>
</table>
<p style="margin: 0 0 8px 0; font-size: 14px; color: #a3a3a3;">${statusInfo.desc}</p>
<p style="margin: 16px 0 8px 0; font-size: 14px; color: #a3a3a3;"><strong style="color: #d4d4d4;">What happens next?</strong><br>The partner team will review your registration within 1-2 business days.</p>
${ctaButton("Track Deal Status", `${PORTAL_URL}/portal/deals`)}`;

    try {
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: args.partnerEmail,
        subject: `Deal registration received: ${args.dealName}`,
        html: emailTemplate(content),
      });

      if (error) {
        console.error("[Email] sendDealRegisteredEmail error:", error);
        return { success: false, error: error.message };
      }

      console.log(`[Email] Sent deal registered to ${args.partnerEmail}`);
      return { success: true };
    } catch (err) {
      console.error("[Email] Exception:", err);
      return { success: false, error: String(err) };
    }
  },
});
