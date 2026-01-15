/**
 * TrustBar Block
 * Display trust indicators, badges, or testimonial counts
 */

import { z } from "zod";
import { ReactNode } from "react";

const TrustBarPropsSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional().default([
    { label: "Years in Business", value: "10+" },
    { label: "Happy Travelers", value: "5000+" },
    { label: "Destinations", value: "50+" },
  ]),
  backgroundColor: z.string().optional().default("bg-blue-50"),
});

export type TrustBarProps = z.infer<typeof TrustBarPropsSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TrustBarBlock(props: any): ReactNode {
  let validProps: TrustBarProps;
  try {
    validProps = TrustBarPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">TrustBar block validation failed</div>;
  }

  return (
    <section className={`${validProps.backgroundColor} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {validProps.items.map((item, idx) => (
            <div key={idx}>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {item.value}
              </div>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
