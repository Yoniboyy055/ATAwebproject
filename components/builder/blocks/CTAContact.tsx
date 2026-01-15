/**
 * CTAContact Block
 * Call-to-Action for contact or booking
 */

import { z } from "zod";
import { ReactNode } from "react";

const CTAContactPropsSchema = z.object({
  heading: z.string().optional().default("Ready to Book?"),
  description: z.string().optional(),
  primaryCta: z.object({
    text: z.string().optional().default("Contact Us"),
    link: z.string().optional(),
  }).optional(),
  secondaryCta: z.object({
    text: z.string().optional(),
    link: z.string().optional(),
  }).optional(),
  backgroundColor: z.string().optional().default("bg-gradient-to-r from-blue-600 to-blue-700"),
  layout: z.enum(["center", "split"]).optional().default("center"),
});

export type CTAContactProps = z.infer<typeof CTAContactPropsSchema>;

export function CTAContactBlock(props: any): ReactNode {
  let validProps: CTAContactProps;
  try {
    validProps = CTAContactPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">CTAContact validation failed</div>;
  }

  return (
    <section className={`${validProps.backgroundColor} text-white py-16 px-4`}>
      <div className="max-w-4xl mx-auto">
        {validProps.layout === "center" ? (
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {validProps.heading}
            </h2>
            {validProps.description && (
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {validProps.description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {validProps.primaryCta?.link && (
                <a
                  href={validProps.primaryCta.link}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition"
                >
                  {validProps.primaryCta.text}
                </a>
              )}
              {validProps.secondaryCta?.link && (
                <a
                  href={validProps.secondaryCta.link}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition"
                >
                  {validProps.secondaryCta.text}
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                {validProps.heading}
              </h2>
              {validProps.description && (
                <p className="text-lg opacity-90">{validProps.description}</p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {validProps.primaryCta?.link && (
                <a
                  href={validProps.primaryCta.link}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-center transition"
                >
                  {validProps.primaryCta.text}
                </a>
              )}
              {validProps.secondaryCta?.link && (
                <a
                  href={validProps.secondaryCta.link}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg text-center transition"
                >
                  {validProps.secondaryCta.text}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
