/**
 * On-demand revalidation API route
 * Allows Builder webhooks to trigger ISR cache invalidation
 */

import { revalidateTag } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Verify webhook secret (optional but recommended)
    const secret = request.headers.get("x-builder-webhook-secret");
    if (secret !== process.env.BUILDER_WEBHOOK_SECRET) {
      if (process.env.BUILDER_WEBHOOK_SECRET) {
        return new Response("Invalid webhook secret", { status: 401 });
      }
    }

    const body = await request.json();

    // Revalidate based on what changed
    const { modelName } = body;

    if (modelName === "page") {
      // Revalidate all pages
      revalidateTag("builder");
    } else if (modelName === "package") {
      // Revalidate packages list and detail page
      revalidateTag("builder-packages");
      if (body.data?.slug) {
        revalidateTag(`builder-package-${body.data.slug}`);
      }
    }

    return new Response(JSON.stringify({ revalidated: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return new Response("Revalidation failed", { status: 500 });
  }
}
