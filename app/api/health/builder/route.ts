/**
 * Builder.io Health Check Endpoint
 * Simple health check - verifies Builder integration configuration
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const hasKey = !!apiKey;
    const hasSiteUrl = !!siteUrl;

    // Basic connectivity test - just check config, not Builder API
    const ok = hasKey && hasSiteUrl;

    return NextResponse.json(
      {
        ok,
        hasKey,
        hasSiteUrl,
        env: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString(),
      },
      { status: ok ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

