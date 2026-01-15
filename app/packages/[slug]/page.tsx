/**
 * Package detail page
 * Premium coded template that renders package from Builder
 * Includes: title, price, image gallery, blocks, and CTA section
 */

import { fetchPackageBySlug, fetchPackageSlugs } from "@/lib/builder";
import { renderBlocks } from "@/components/builder/registry";
import { BuilderImage, getFirstValidImage } from "@/components/builder/ImageHelper";
import { Metadata } from "next";
import { FEATURES } from "@/lib/config";

interface PackageDetailProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static paths for all packages (ISR)
 * This allows Next.js to pre-render package pages
 */
export async function generateStaticParams() {
  try {
    const slugs = await fetchPackageSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.warn("Failed to generate static params for packages:", error);
    return [];
  }
}

/**
 * Render package detail page
 */
export default async function PackageDetailPage({
  params,
}: PackageDetailProps) {
  const result = await fetchPackageBySlug(params.slug);

  // Handle not found
  if (!result.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Package Not Found</h1>
        <p className="text-gray-600 mb-8">{result.error}</p>
        {FEATURES.debugMode && (
          <details className="text-xs text-gray-500">
            <summary>Debug info</summary>
            <pre className="mt-2 bg-gray-100 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        )}
        <a href="/packages" className="text-blue-600 hover:text-blue-700 font-semibold">
          ← Back to packages
        </a>
      </div>
    );
  }

  const pkg = result.data;
  const packageData = pkg.data;
  const blocks = packageData.body || [];
  const firstImage = getFirstValidImage(packageData.images);

  return (
    <main className="bg-white">
      {/* Hero Section with Image */}
      {firstImage && (
        <div className="relative h-96 bg-gray-100">
          <BuilderImage
            src={firstImage}
            alt={packageData.title}
            width={1200}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {/* Package Header */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {packageData.title}
          </h1>

          {/* Tags */}
          {packageData.tags && packageData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {packageData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-baseline gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Price</p>
              <div className="text-4xl font-bold text-blue-600">
                {packageData.currency} {packageData.price.toLocaleString()}
              </div>
              <p className="text-gray-600 text-sm mt-1">per person</p>
            </div>
          </div>

          {/* Excerpt */}
          {packageData.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed border-l-4 border-blue-600 pl-4">
              {packageData.excerpt}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <div className="mb-12">
          <a
            href={`/contact?package=${packageData.slug}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition"
          >
            Inquire About This Package
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Content Blocks from Builder */}
      {blocks.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            {renderBlocks(blocks)}
          </div>
        </section>
      )}

      {/* Image Gallery */}
      {packageData.images && packageData.images.length > 1 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packageData.images.map((image, idx) => (
                <div key={idx} className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <BuilderImage
                    src={typeof image === 'string' ? image : image?.src}
                    alt={`${packageData.title} - Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Contact us today to reserve your spot for this amazing journey.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition"
          >
            Contact Us Now
          </a>
        </div>
      </section>
    </main>
  );
}

/**
 * Generate SEO metadata from package data
 */
export async function generateMetadata({
  params,
}: PackageDetailProps): Promise<Metadata> {
  const result = await fetchPackageBySlug(params.slug);

  if (!result.success) {
    return {
      title: "Package Not Found",
      description: "The package you're looking for doesn't exist.",
    };
  }

  const pkg = result.data;
  const packageData = pkg.data;
  const firstImage = getFirstValidImage(packageData.images);

  return {
    title: `${packageData.title} | Amanuel Travel`,
    description:
      packageData.excerpt ||
      `Explore our ${packageData.title} travel package at ${packageData.currency} ${packageData.price}`,
    keywords: packageData.tags ? packageData.tags.join(", ") : undefined,
    openGraph: {
      title: packageData.title,
      description: packageData.excerpt,
      images: firstImage
        ? [
            {
              url: firstImage,
              width: 1200,
              height: 630,
              alt: packageData.title,
            },
          ]
        : undefined,
    },
  };
}

/**
 * Revalidate every hour
 * Can be revalidated on-demand via API route
 */
export const revalidate = 3600;
