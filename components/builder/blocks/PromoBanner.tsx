/**
 * PromoBanner Block
 * Promotional banner with text, image, and CTA
 */

import { z } from "zod";
import { ReactNode } from "react";

const PromoBannerPropsSchema = z.object({
  heading: z.string().optional().default("Special Offer"),
  message: z.string().optional(),
  ctaText: z.string().optional().default("Learn More"),
  ctaLink: z.string().optional(),
  backgroundColor: z.string().optional().default("bg-gradient-to-r from-purple-600 to-pink-600"),
  textColor: z.string().optional().default("text-white"),
});

export type PromoBannerProps = z.infer<typeof PromoBannerPropsSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PromoBannerBlock(props: any): ReactNode {
  let validProps: PromoBannerProps;
  try {
    validProps = PromoBannerPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">PromoBanner block validation failed</div>;
  }

  return (
    <section className={`${validProps.backgroundColor} ${validProps.textColor} py-8 px-4`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {validProps.heading}
          </h2>
          {validProps.message && (
            <p className="text-lg opacity-90">{validProps.message}</p>
          )}
        </div>
        {validProps.ctaText && validProps.ctaLink && (
          <a
            href={validProps.ctaLink}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition whitespace-nowrap"
          >
            {validProps.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
