/**
 * PricingBox Block
 * Display pricing tiers or package pricing
 */

import { z } from "zod";
import { ReactNode } from "react";

const PricingBoxPropsSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional().default("USD"),
  period: z.string().optional().default("per person"),
  features: z.array(z.string()).optional().default([]),
  ctaText: z.string().optional().default("Book Now"),
  ctaLink: z.string().optional(),
  highlighted: z.boolean().optional().default(false),
});

export type PricingBoxProps = z.infer<typeof PricingBoxPropsSchema>;

export function PricingBoxBlock(props: any): ReactNode {
  let validProps: PricingBoxProps;
  try {
    validProps = PricingBoxPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">PricingBox validation failed</div>;
  }

  const borderClass = validProps.highlighted ? "border-2 border-blue-600" : "border border-gray-200";
  const shadowClass = validProps.highlighted ? "shadow-lg" : "shadow";

  return (
    <div className={`${borderClass} ${shadowClass} rounded-lg p-8 bg-white`}>
      {validProps.heading && (
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {validProps.heading}
        </h3>
      )}
      {validProps.description && (
        <p className="text-gray-600 mb-6">{validProps.description}</p>
      )}
      {validProps.price && (
        <div className="mb-6">
          <span className="text-4xl font-bold text-blue-600">
            {validProps.currency} {validProps.price}
          </span>
          <span className="text-gray-600 ml-2">/{validProps.period}</span>
        </div>
      )}
      {validProps.features.length > 0 && (
        <ul className="space-y-3 mb-8">
          {validProps.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      {validProps.ctaText && validProps.ctaLink && (
        <a
          href={validProps.ctaLink}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
        >
          {validProps.ctaText}
        </a>
      )}
    </div>
  );
}
