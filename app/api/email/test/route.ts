import { NextRequest, NextResponse } from "next/server";
import {
  sendDealApproved,
  sendCommissionPaid,
  sendPartnerInvite,
  sendDealRegistered,
  isEmailConfigured,
  EMAIL_TYPES,
  type EmailType,
} from "@/lib/email";

// Only allow in development
const isDev = process.env.NODE_ENV !== "production";

export async function POST(request: NextRequest) {
  // Block in production
  if (!isDev) {
    return NextResponse.json(
      { error: "Test endpoint only available in development" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { type, to } = body as { type: EmailType; to: string };

    // Validate inputs
    if (!type || !EMAIL_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid email type. Must be one of: ${EMAIL_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!to || !to.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { 
          error: "Email not configured",
          message: "Set RESEND_API_KEY environment variable to enable email sending" 
        },
        { status: 503 }
      );
    }

    // Send test email based on type
    let result: { success: boolean; error?: string };

    switch (type) {
      case "deal_approved":
        result = await sendDealApproved(
          to,
          "Test Partner",
          "Enterprise SaaS Deal",
          125000,
          12500
        );
        break;

      case "commission_paid":
        result = await sendCommissionPaid(
          to,
          "Test Partner",
          12500,
          "Enterprise SaaS Deal",
          new Date()
        );
        break;

      case "partner_invite":
        result = await sendPartnerInvite(
          to,
          "Test Partner",
          "Acme Corp",
          "https://partnerbase.app/invite/test-123"
        );
        break;

      case "deal_registered":
        result = await sendDealRegistered(
          to,
          "Test Partner",
          "New Business Opportunity",
          "pending"
        );
        break;

      default:
        return NextResponse.json(
          { error: "Unknown email type" },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test ${type} email sent to ${to}`,
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Email Test] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET() {
  if (!isDev) {
    return NextResponse.json(
      { error: "Test endpoint only available in development" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    configured: isEmailConfigured(),
    availableTypes: EMAIL_TYPES,
    usage: "POST with { type: 'deal_approved' | 'commission_paid' | 'partner_invite' | 'deal_registered', to: 'email@example.com' }",
  });
}
