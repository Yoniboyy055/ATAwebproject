/**
 * Builder.io block registry
 * Central registration point for approved blocks
 * Ensures only safe, approved components can be rendered
 */

import dynamic from "next/dynamic";
import { ApprovedBlockType, APPROVED_BLOCKS } from "@/lib/config";
import { SafeBlockRenderer, BlockErrorFallback } from "./BlockErrorBoundary";

/**
 * Dynamically import approved blocks
 * Using dynamic imports for better code splitting and safety
 */
const blockComponents: Partial<Record<ApprovedBlockType, React.ComponentType<any>>> = {
  Hero: dynamic(
    () => import("./blocks/Hero").then((mod) => mod.HeroBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  TrustBar: dynamic(
    () => import("./blocks/TrustBar").then((mod) => mod.TrustBarBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  PromoBanner: dynamic(
    () => import("./blocks/PromoBanner").then((mod) => mod.PromoBannerBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  PackagesGrid: dynamic(
    () => import("./blocks/PackagesGrid").then((mod) => mod.PackagesGridBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  FeaturedPackagesCarousel: dynamic(
    () => import("./blocks/FeaturedPackagesCarousel").then((mod) => mod.FeaturedPackagesCarouselBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  PackageHighlights: dynamic(
    () => import("./blocks/PackageHighlights").then((mod) => mod.PackageHighlightsBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  ItineraryTimeline: dynamic(
    () => import("./blocks/ItineraryTimeline").then((mod) => mod.ItineraryTimelineBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  Gallery: dynamic(
    () => import("./blocks/Gallery").then((mod) => mod.GalleryBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  PricingBox: dynamic(
    () => import("./blocks/PricingBox").then((mod) => mod.PricingBoxBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  ImportantInfo: dynamic(
    () => import("./blocks/ImportantInfo").then((mod) => mod.ImportantInfoBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  FAQ: dynamic(
    () => import("./blocks/FAQ").then((mod) => mod.FAQBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
  CTAContact: dynamic(
    () => import("./blocks/CTAContact").then((mod) => mod.CTAContactBlock),
    { ssr: true, loading: () => <BlockErrorFallback isDev={false} /> }
  ),
};

/**
 * Render a single block from Builder data
 * Validates block type before rendering
 */
export function renderBlock(block: any): React.ReactNode {
  if (!block) return null;

  const blockName = block?.component?.name;
  const options = block?.component?.options || {};

  // Check if block is approved
  if (!blockName || !APPROVED_BLOCKS.includes(blockName as ApprovedBlockType)) {
    return (
      <SafeBlockRenderer blockName={blockName}>
        <BlockErrorFallback
          blockName={blockName}
          isDev={process.env.NODE_ENV === "development"}
        />
      </SafeBlockRenderer>
    );
  }

  const Component = blockComponents[blockName as ApprovedBlockType];

  if (!Component) {
    return (
      <SafeBlockRenderer blockName={blockName}>
        <BlockErrorFallback
          blockName={blockName}
          isDev={process.env.NODE_ENV === "development"}
        />
      </SafeBlockRenderer>
    );
  }

  return (
    <SafeBlockRenderer key={block.id || blockName} blockName={blockName}>
      <Component {...options} />
    </SafeBlockRenderer>
  );
}

/**
 * Render multiple blocks from a Blocks field
 */
export function renderBlocks(blocks: any[] | undefined): React.ReactNode[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((block, idx) => (
    <div key={block?.id || idx}>{renderBlock(block)}</div>
  ));
}

/**
 * Check if a block name is approved
 */
export function isBlockApproved(blockName: string): boolean {
  return APPROVED_BLOCKS.includes(blockName as ApprovedBlockType);
}
