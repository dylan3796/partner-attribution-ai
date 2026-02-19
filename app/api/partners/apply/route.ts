import { NextRequest, NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "company", "email", "partnerType", "estimatedDeals", "description"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate partner type
    const validPartnerTypes = ["reseller", "referral", "integration", "agency"];
    if (!validPartnerTypes.includes(body.partnerType)) {
      return NextResponse.json(
        { success: false, error: "Invalid partner type" },
        { status: 400 }
      );
    }

    // Validate estimated deals
    const validEstimates = ["1-5", "6-20", "21-50", "50+"];
    if (!validEstimates.includes(body.estimatedDeals)) {
      return NextResponse.json(
        { success: false, error: "Invalid estimated deals value" },
        { status: 400 }
      );
    }

    // Check if Convex is configured
    if (!process.env.CONVEX_URL && !process.env.NEXT_PUBLIC_CONVEX_URL) {
      // Demo mode - just return success
      console.log("[Partner Application] Demo mode - application data:", {
        name: body.name,
        company: body.company,
        email: body.email,
        partnerType: body.partnerType,
        estimatedDeals: body.estimatedDeals,
      });
      return NextResponse.json({
        success: true,
        message: "Application received (demo mode)",
      });
    }

    // Submit to Convex
    const result = await fetchMutation(api.partnerApplications.submitApplication, {
      name: body.name,
      title: body.title || undefined,
      company: body.company,
      email: body.email,
      website: body.website || undefined,
      partnerType: body.partnerType,
      estimatedDeals: body.estimatedDeals,
      description: body.description,
      source: body.source || undefined,
    });

    return NextResponse.json({
      success: true,
      applicationId: result.applicationId,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("[Partner Application] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
