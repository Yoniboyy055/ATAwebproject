/**
 * Image optimization and normalization helpers for Builder.io images
 * Ensures all images are safe and properly optimized
 */

import Image from "next/image";

interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Normalize Builder image object or string
 */
export function normalizeImageUrl(
  image: string | { src?: string; url?: string } | undefined
): string | null {
  if (!image) return null;

  if (typeof image === "string") {
    return image.startsWith("http") ? image : null;
  }

  if (typeof image === "object") {
    const url = image.src || image.url;
    return url && typeof url === "string" && url.startsWith("http")
      ? url
      : null;
  }

  return null;
}

/**
 * Safely render a Builder image with next/image
 * Defaults to reasonable constraints if not provided
 */
export function BuilderImage({
  src,
  alt = "",
  width = 800,
  height = 600,
  className = "",
  priority = false,
}: ImageProps & { className?: string; priority?: boolean }) {
  const imageUrl = normalizeImageUrl(src);

  if (!imageUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt || "Image"}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
/**
 * Get first valid image from array
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFirstValidImage(
  images: any[] | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
): string | null {
  if (!Array.isArray(images)) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const image of images) {
    const url = normalizeImageUrl(image);
    if (url) return url;
  }
  return null;
}
