/**
 * Catch-all route for Builder.io pages
 * Renders any page stored in Builder by URL path
 */

import { fetchPageByPath } from "@/lib/builder";
import { renderBlocks } from "@/components/builder/registry";
import { Metadata } from "next";
import { FEATURES } from "@/lib/config";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    page: string[];
  };
}

/**
 * Render any Builder page dynamically
 */
export default async function CatchAllPage({ params }: PageProps) {
  // Construct the path from segments
  const path = "/" + params.page.join("/");

  // Skip Builder for auth routes - they have their own pages
  if (path.startsWith("/auth/") || path.startsWith("/api/auth/")) {
    notFound();
  }

  // Fetch page from Builder
  const result = await fetchPageByPath(path);

  // Handle fetch errors
  if (!result.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">{result.error}</p>
        {FEATURES.debugMode && (
          <details className="text-xs text-gray-500 max-w-2xl">
            <summary>Debug info</summary>
            <pre className="mt-2 bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        )}
        <a href="/" className="text-blue-600 hover:text-blue-700">
          ← Back to home
        </a>
      </div>
    );
  }

  const page = result.data;
  const blocks = page.data?.blocks || page.data?.body || [];

  return (
    <main>
      {/* Render blocks from Builder */}
      {renderBlocks(blocks)}
    </main>
  );
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const path = "/" + params.page.join("/");

  // Skip Builder for auth routes
  if (path.startsWith("/auth/") || path.startsWith("/api/auth/")) {
    return {
      title: "Sign In — Amanuel Travel",
      description: "Sign in to your Amanuel Travel account",
    };
  }

  const result = await fetchPageByPath(path);

  if (!result.success) {
    return {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist.",
    };
  }

  const page = result.data;
  const title = page.data?.metadata?.title || page.data?.title || "Amanuel Travel";
  const description = page.data?.metadata?.description || "Amanuel Travel Agency";

  return {
    title,
    description,
    keywords: page.data?.metadata?.keywords,
  };
}
