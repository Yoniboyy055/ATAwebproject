/**
 * Builder.io Health Check Endpoint
 * Simple health check - verifies Builder integration configuration
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const hasKey = !!process.env.NEXT_PUBLIC_BUILDER_API_KEY;
    const hasSiteUrl = !!process.env.NEXT_PUBLIC_SITE_URL;
    const ok = hasKey && hasSiteUrl;

    return NextResponse.json({
      ok,
      hasKey,
      hasSiteUrl,
      ...(ok ? {} : { note: "Missing Builder environment configuration." }),
    });
  } catch (error) {
    console.error("Builder health check failed:", error);
    return NextResponse.json({
      ok: false,
      hasKey: false,
      hasSiteUrl: false,
      note: "Builder health check could not read configuration.",
    });
  }
}

