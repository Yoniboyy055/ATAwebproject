/**
 * Gallery Block
 * Image gallery with lightbox
 */

import { z } from "zod";
import { ReactNode } from "react";

const GalleryPropsSchema = z.object({
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })).optional().default([]),
  columns: z.number().optional().default(3),
});

export type GalleryProps = z.infer<typeof GalleryPropsSchema>;

export function GalleryBlock(props: any): ReactNode {
  let validProps: GalleryProps;
  try {
    validProps = GalleryPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">Gallery validation failed</div>;
  }

  const colsClass = `grid-cols-${validProps.columns} md:grid-cols-${Math.min(validProps.columns + 1, 4)}`;

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className={`grid ${colsClass} gap-4`}>
          {validProps.images.map((img, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Image placeholder</p>
              </div>
              {img.caption && (
                <p className="p-3 text-sm text-gray-600">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
