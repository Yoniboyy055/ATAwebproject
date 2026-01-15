/**
 * Builder.io Health Check Endpoint
 * Verifies that Builder integration is properly configured
 * Used for local smoke testing and deployment verification
 */

import { BUILDER_CONFIG } from "@/lib/config";
import { fetchPackageBySlug } from "@/lib/builder";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      apiKeyConfigured: !!BUILDER_CONFIG.apiKey,
      siteUrl: BUILDER_CONFIG.siteUrl,
    },
    integration: {
      config: {
        apiKey: BUILDER_CONFIG.apiKey ? "✓" : "✗ MISSING",
        siteUrl: BUILDER_CONFIG.siteUrl,
        models: BUILDER_CONFIG.models,
        revalidateTimes: BUILDER_CONFIG.revalidate,
      },
    },
    status: "ok" as const,
  };

  // If API key is not configured, return incomplete status
  if (!BUILDER_CONFIG.apiKey) {
    checks.status = "error";
    return NextResponse.json(checks, { status: 503 });
  }

  // Optionally, test a package fetch if a test slug is provided
  const testSlug = request.nextUrl.searchParams.get("test");
  if (testSlug) {
    try {
      const result = await fetchPackageBySlug(testSlug);
      checks.integration.testFetch = {
        slug: testSlug,
        success: result.success,
        error: !result.success ? result.error : undefined,
      };
    } catch (error) {
      checks.integration.testFetch = {
        slug: testSlug,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  return NextResponse.json(checks, { status: checks.status === "ok" ? 200 : 503 });
}

