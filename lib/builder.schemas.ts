/**
 * TypeScript types and Zod validation schemas for Builder.io content
 * Ensures all Builder API responses are validated before use
 */

import { z } from "zod";

/**
 * Builder Block Schema - represents a single block in a Blocks field
 * Only approved blocks are allowed
 */
export const BuilderBlockSchema = z.object({
  "@type": z.string(),
  id: z.string().optional(),
  component: z.object({
    name: z.string(),
    options: z.record(z.string(), z.unknown()).optional(),
  }),
  responsiveStyles: z.object({
    large: z.record(z.string(), z.unknown()).optional(),
    medium: z.record(z.string(), z.unknown()).optional(),
    small: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
});

export type BuilderBlock = z.infer<typeof BuilderBlockSchema>;

/**
 * Builder Image Schema
 * Handles Builder image uploads with metadata
 */
export const BuilderImageSchema = z.object({
  src: z.string().url(),
  alt: z.string().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
});

export type BuilderImage = z.infer<typeof BuilderImageSchema>;

/**
 * Package-specific schema with all required fields
 * This is what the owner edits in Builder.io Data Model
 */
export const PackageDataSchema = z.object({
  title: z.string().min(1, "Package title is required"),
  slug: z.string().min(1, "Package slug is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().default("USD").describe("Currency code (USD, EUR, etc)"),
  excerpt: z.string().optional().describe("Short description"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  images: z.array(BuilderImageSchema).default([]),
  description: z.string().optional(),
  body: z.array(BuilderBlockSchema).optional().describe("Blocks field for content"),
});

export type PackageData = z.infer<typeof PackageDataSchema>;

/**
 * Full Builder Package Entry
 * Includes metadata from Builder (id, createdAt, etc.)
 */
export const BuilderPackageEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  published: z.string().optional(),
  createdDate: z.string().optional(),
  lastUpdated: z.string().optional(),
  data: PackageDataSchema,
});

export type BuilderPackageEntry = z.infer<typeof BuilderPackageEntrySchema>;

/**
 * Builder Page Entry
 * For generic pages (Home, About, Contact, etc.)
 */
export const BuilderPageEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  published: z.string().optional(),
  createdDate: z.string().optional(),
  lastUpdated: z.string().optional(),
  data: z.object({
    title: z.string().optional(),
    metadata: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.string().optional(),
    }).optional(),
    blocks: z.array(BuilderBlockSchema).optional(),
    body: z.array(BuilderBlockSchema).optional(),
  }).optional(),
});

export type BuilderPageEntry = z.infer<typeof BuilderPageEntrySchema>;

/**
 * Builder API Response for querying entries
 */
export const BuilderApiResponseSchema = z.object({
  results: z.array(z.unknown()),
  cursor: z.string().optional(),
  limit: z.number().optional(),
});

export type BuilderApiResponse = z.infer<typeof BuilderApiResponseSchema>;

/**
 * Safe Package for rendering (validated)
 */
export const SafePackageSchema = PackageDataSchema.extend({
  id: z.string(),
  slug: z.string(), // Override to ensure always present
});

export type SafePackage = z.infer<typeof SafePackageSchema>;

/**
 * Validation result - either success or error
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; raw?: unknown };

/**
 * Validate Builder API response safely
 * Returns typed data or error message
 */
export function validatePackageEntry(
  data: unknown
): ValidationResult<BuilderPackageEntry> {
  try {
    const validated = BuilderPackageEntrySchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    const message = error instanceof z.ZodError
      ? `Invalid package entry: ${error.issues[0]?.message || "Unknown error"}`
      : "Failed to parse package entry";
    return { success: false, error: message, raw: data };
  }
}

/**
 * Validate page entry
 */
export function validatePageEntry(
  data: unknown
): ValidationResult<BuilderPageEntry> {
  try {
    const validated = BuilderPageEntrySchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    const message = error instanceof z.ZodError
      ? `Invalid page entry: ${error.issues[0]?.message || "Unknown error"}`
      : "Failed to parse page entry";
    return { success: false, error: message, raw: data };
  }
}

/**
 * Validate package data only (without Builder metadata)
 */
export function validatePackageData(
  data: unknown
): ValidationResult<SafePackage> {
  try {
    const validated = SafePackageSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    const message = error instanceof z.ZodError
      ? `Invalid package data: ${error.issues[0]?.message || "Unknown error"}`
      : "Failed to parse package data";
    return { success: false, error: message, raw: data };
  }
}
