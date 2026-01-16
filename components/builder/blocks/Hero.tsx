/**
 * Hero Block
 * Full-width hero section with background image, title, and CTA
 */

import { z } from "zod";
import { ReactNode } from "react";
import styles from "./Hero.module.css";

const HeroBlockPropsSchema = z.object({
  title: z.string().optional().default("Welcome to Amanuel Travel"),
  subtitle: z.string().optional(),
  backgroundImage: z.string().url('Invalid image URL').optional(),
  buttonText: z.string().optional().default("Explore"),
  buttonLink: z.string().url('Invalid button link').optional(),
  alignment: z.enum(["left", "center", "right"]).optional().default("center"),
  minHeight: z.number().optional().default(400),
});

export type HeroBlockProps = z.infer<typeof HeroBlockPropsSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HeroBlock(props: any): ReactNode {
  // Validate props with Zod
  let validProps: HeroBlockProps;
  try {
    validProps = HeroBlockPropsSchema.parse(props);
  } catch (error) {
    return <div className="bg-red-50 p-4 text-red-700">Hero block validation failed</div>;
  }

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[validProps.alignment];

  // Create unique section ID for CSS targeting
  const sectionId = `hero-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <>
      {validProps.backgroundImage && (
        <style>{`
          #${sectionId} {
            background-image: url("${validProps.backgroundImage}");
          }
        `}</style>
      )}
      <section
        id={sectionId}
        className={`${styles.hero} ${validProps.backgroundImage ? styles.heroWithImage : ""} ${alignmentClass}`}
        data-height={validProps.minHeight}
      >
        {/* Overlay for readability */}
        {validProps.backgroundImage && (
          <div className={styles.overlay} />
        )}

        {/* Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {validProps.title}
          </h1>
          {validProps.subtitle && (
            <p className={styles.heroSubtitle}>
              {validProps.subtitle}
            </p>
          )}
          {validProps.buttonText && validProps.buttonLink && (
            <a
              href={validProps.buttonLink}
              className={styles.heroButton}
            >
              {validProps.buttonText}
            </a>
          )}
        </div>
      </section>
    </>
  );
}
