/**
 * PackagesGrid Block
 * Display packages in a responsive grid layout
 */

import { z } from "zod";
import { fetchPackages } from "@/lib/builder";
import { SafePackage } from "@/lib/builder.schemas";
import { BuilderImage } from "../ImageHelper";

const PackagesGridPropsSchema = z.object({
  title: z.string().optional().default("Our Packages"),
  subtitle: z.string().optional(),
  layout: z.enum(["2-col", "3-col", "4-col"]).optional().default("3-col"),
  limit: z.number().optional().default(6),
  featured: z.boolean().optional().default(false),
  tag: z.string().optional(),
  showPrice: z.boolean().optional().default(true),
  showExcerpt: z.boolean().optional().default(true),
});

export type PackagesGridProps = z.infer<typeof PackagesGridPropsSchema>;

interface PackageCardProps {
  package: SafePackage;
  showPrice: boolean;
  showExcerpt: boolean;
}

function PackageCard({ package: pkg, showPrice, showExcerpt }: PackageCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      {pkg.images && pkg.images.length > 0 && (
        <div className="relative h-48 bg-gray-100">
          <BuilderImage
            src={typeof pkg.images[0] === 'string' ? pkg.images[0] : pkg.images[0]?.src}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {pkg.title}
        </h3>

        {showExcerpt && pkg.excerpt && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {pkg.excerpt}
          </p>
        )}

        {/* Tags */}
        {pkg.tags && pkg.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {pkg.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {showPrice && (
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              {pkg.currency} {pkg.price}
            </span>
            <a
              href={`/packages/${pkg.slug}`}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PackagesGridBlock(props: any) {
  // Validate props
  let validProps: PackagesGridProps;
  try {
    validProps = PackagesGridPropsSchema.parse(props);
  } catch (error) {
    return <div className="bg-red-50 p-4 text-red-700">PackagesGrid block validation failed</div>;
  }

  // Fetch packages
  const result = await fetchPackages({
    limit: validProps.limit,
    featured: validProps.featured,
    tag: validProps.tag,
  });

  if (!result.success || result.data.length === 0) {
    return (
      <div className="bg-gray-50 p-8 text-center rounded-lg">
        <p className="text-gray-600">No packages available</p>
      </div>
    );
  }

  const gridClass = {
    "2-col": "grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
    "3-col": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4-col": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[validProps.layout];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(validProps.title || validProps.subtitle) && (
          <div className="text-center mb-12">
            {validProps.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {validProps.title}
              </h2>
            )}
            {validProps.subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {validProps.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {result.data.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              showPrice={validProps.showPrice}
              showExcerpt={validProps.showExcerpt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
