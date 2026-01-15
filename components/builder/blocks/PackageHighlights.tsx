/**
 * PackageHighlights Block
 * Display key highlights/features of a package
 */

import { z } from "zod";
import { ReactNode } from "react";

const PackageHighlightsPropsSchema = z.object({
  highlights: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
  })).optional().default([]),
  layout: z.enum(["grid", "list"]).optional().default("grid"),
});

export type PackageHighlightsProps = z.infer<typeof PackageHighlightsPropsSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PackageHighlightsBlock(props: any): ReactNode {
  let validProps: PackageHighlightsProps;
  try {
    validProps = PackageHighlightsPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">PackageHighlights validation failed</div>;
  }

  if (validProps.layout === "grid") {
    return (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {validProps.highlights.map((h, idx) => (
            <div key={idx} className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {h.title}
              </h3>
              {h.description && (
                <p className="text-gray-600">{h.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {validProps.highlights.map((h, idx) => (
          <div key={idx} className="flex gap-4 p-4 border-l-4 border-blue-600">
            <div>
              <h3 className="font-semibold text-gray-900">{h.title}</h3>
              {h.description && (
                <p className="text-gray-600 text-sm">{h.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
