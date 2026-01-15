/**
 * Builder.io fetch utilities with validation and caching
 * All functions validate responses with Zod before returning
 */

import { cache } from "react";
import { BUILDER_CONFIG, APPROVED_BLOCKS } from "./config";
import {
  validatePackageEntry,
  validatePageEntry,
  BuilderPackageEntry,
  BuilderPageEntry,
  SafePackage,
  ValidationResult,
  validatePackageData,
} from "./builder.schemas";

const API_BASE = "https://www.builder.io/api/v2";

/**
 * Core fetch function for Builder API with error handling
 */
async function builderApiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<any> {
  if (!BUILDER_CONFIG.apiKey) {
    console.error("NEXT_PUBLIC_BUILDER_API_KEY is not set");
    throw new Error("Builder API key is not configured");
  }

  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Accept": "application/json",
    ...options?.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Add cache tags for ISR
      next: {
        revalidate: BUILDER_CONFIG.revalidate.pages,
        tags: ["builder"],
      },
    });

    if (!response.ok) {
      throw new Error(`Builder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Builder API fetch failed:", error);
    throw error;
  }
}

/**
 * Fetch a page by URL path
 * Used by catch-all route to render any page from Builder
 */
export const fetchPageByPath = cache(
  async (path: string): Promise<ValidationResult<BuilderPageEntry>> => {
    try {
      const response = await builderApiFetch(
        `/content/page?url=${encodeURIComponent(path)}`
      );

      if (!response.data || response.data.length === 0) {
        return {
          success: false,
          error: `Page not found at path: ${path}`,
        };
      }

      // Get the first matching page
      const pageData = response.data[0];
      return validatePageEntry(pageData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Failed to fetch page: ${message}`,
      };
    }
  }
);

/**
 * Fetch all packages with optional filters
 * Used for packages listing page
 */
export const fetchPackages = cache(
  async (filters?: {
    tag?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<ValidationResult<SafePackage[]>> => {
    try {
      let query = `model=${BUILDER_CONFIG.models.package}`;

      if (filters?.featured) {
        query += `&query.data.featured=true`;
      }

      if (filters?.tag) {
        query += `&query.data.tags[]=${encodeURIComponent(filters.tag)}`;
      }

      if (filters?.limit) {
        query += `&limit=${filters.limit}`;
      }

      const response = await builderApiFetch(
        `/content?apiKey=${BUILDER_CONFIG.apiKey}&${query}`,
        {
          next: {
            revalidate: BUILDER_CONFIG.revalidate.packagesList,
            tags: ["builder-packages"],
          },
        }
      );

      if (!response.results || !Array.isArray(response.results)) {
        return {
          success: true,
          data: [],
        };
      }

      // Validate each package
      const packages: SafePackage[] = [];
      const errors: string[] = [];

      for (const result of response.results) {
        const validation = validatePackageEntry(result);
        if (validation.success) {
          // Convert to SafePackage by adding id if missing
          packages.push({
            ...validation.data.data,
            id: validation.data.id,
          });
        } else {
          errors.push(validation.error);
          if (BUILDER_CONFIG.apiKey) {
            console.warn(`Package validation failed: ${validation.error}`);
          }
        }
      }

      if (errors.length > 0 && FEATURES.debugMode) {
        console.warn(`${errors.length} package(s) failed validation`);
      }

      return {
        success: true,
        data: packages,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Failed to fetch packages: ${message}`,
      };
    }
  }
);

/**
 * Fetch a single package by slug
 * Used for /packages/[slug] dynamic page
 */
export const fetchPackageBySlug = cache(
  async (slug: string): Promise<ValidationResult<BuilderPackageEntry>> => {
    try {
      const response = await builderApiFetch(
        `/content?apiKey=${BUILDER_CONFIG.apiKey}&model=${BUILDER_CONFIG.models.package}&query.data.slug=${encodeURIComponent(slug)}`,
        {
          next: {
            revalidate: BUILDER_CONFIG.revalidate.packageDetail,
            tags: ["builder-package", `builder-package-${slug}`],
          },
        }
      );

      if (!response.results || response.results.length === 0) {
        return {
          success: false,
          error: `Package not found with slug: ${slug}`,
        };
      }

      // Get the first matching package
      return validatePackageEntry(response.results[0]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Failed to fetch package: ${message}`,
      };
    }
  }
);

/**
 * Get all package slugs for static generation (getStaticPaths)
 * Useful if you want to pre-render all package pages
 */
export const fetchPackageSlugs = cache(
  async (): Promise<string[]> => {
    try {
      const result = await fetchPackages({ limit: 100 });
      if (!result.success) {
        console.warn("Failed to fetch package slugs:", result.error);
        return [];
      }
      return result.data.map((pkg) => pkg.slug).filter(Boolean);
    } catch (error) {
      console.error("Error fetching package slugs:", error);
      return [];
    }
  }
);

/**
 * Helper: Normalize image URL from Builder
 * Ensures images are properly formatted and safe to render
 */
export function normalizeBuilderImage(
  image: string | { src?: string; url?: string } | undefined
): string | null {
  if (!image) return null;

  if (typeof image === "string") {
    return image.startsWith("http") ? image : null;
  }

  if (typeof image === "object") {
    const url = image.src || image.url;
    return url && typeof url === "string" && url.startsWith("http")
      ? url
      : null;
  }

  return null;
}

/**
 * Helper: Check if block is approved for rendering
 * Used by block wrapper component
 */
export function isApprovedBlock(blockName: string): boolean {
  return APPROVED_BLOCKS.includes(blockName as any);
}

/**
 * Helper: Safe block filter
 * Removes unapproved blocks from content
 */
export function filterApprovedBlocks(blocks: any[] | undefined) {
  if (!Array.isArray(blocks)) return [];
  return blocks.filter((block) => {
    const name = block?.component?.name;
    return name && isApprovedBlock(name);
  });
}

// Feature flag import
import { FEATURES } from "./config";
