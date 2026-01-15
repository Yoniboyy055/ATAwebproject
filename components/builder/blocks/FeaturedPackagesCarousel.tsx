/**
 * FeaturedPackagesCarousel Block
 * Carousel/slider for featured packages
 */

import { z } from "zod";
import { ReactNode } from "react";

const FeaturedPackagesCarouselPropsSchema = z.object({
  title: z.string().optional().default("Featured Packages"),
  autoplay: z.boolean().optional().default(true),
  interval: z.number().optional().default(5000),
});

export type FeaturedPackagesCarouselProps = z.infer<typeof FeaturedPackagesCarouselPropsSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FeaturedPackagesCarouselBlock(props: any): ReactNode {
  let validProps: FeaturedPackagesCarouselProps;
  try {
    validProps = FeaturedPackagesCarouselPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">FeaturedPackagesCarousel validation failed</div>;
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {validProps.title}
        </h2>
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">Carousel placeholder - configure in Builder.io</p>
        </div>
      </div>
    </section>
  );
}
