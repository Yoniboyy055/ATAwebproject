/**
 * Hero Block
 * Full-width hero section with background image, title, and CTA
 */

import { z } from "zod";
import { ReactNode } from "react";

const HeroBlockPropsSchema = z.object({
  title: z.string().optional().default("Welcome to Amanuel Travel"),
  subtitle: z.string().optional(),
  backgroundImage: z.string().optional(),
  buttonText: z.string().optional().default("Explore"),
  buttonLink: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).optional().default("center"),
  minHeight: z.number().optional().default(400),
});

export type HeroBlockProps = z.infer<typeof HeroBlockPropsSchema>;

export function HeroBlock(props: any): ReactNode {
  // Validate props with Zod
  let validProps: HeroBlockProps;
  try {
    validProps = HeroBlockPropsSchema.parse(props);
  } catch (error) {
    return <div className="bg-red-50 p-4 text-red-700">Hero block validation failed</div>;
  }

  const bgStyle = validProps.backgroundImage
    ? { backgroundImage: `url(${validProps.backgroundImage})` }
    : undefined;

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[validProps.alignment];

  return (
    <section
      className={`bg-cover bg-center relative w-full ${alignmentClass}`}
      style={{
        minHeight: `${validProps.minHeight}px`,
        ...bgStyle,
      }}
    >
      {/* Overlay for readability */}
      {validProps.backgroundImage && (
        <div className="absolute inset-0 bg-black/30" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {validProps.title}
        </h1>
        {validProps.subtitle && (
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            {validProps.subtitle}
          </p>
        )}
        {validProps.buttonText && validProps.buttonLink && (
          <a
            href={validProps.buttonLink}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            {validProps.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
