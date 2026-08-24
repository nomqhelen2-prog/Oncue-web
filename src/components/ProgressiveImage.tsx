import { useState } from "react";
import { makeSrcSet } from "../lib/imgOptimize";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Tailwind/inline classes for the skeleton placeholder */
  skeletonClass?: string;
  /** Passed directly to the <img> sizes attribute */
  sizes?: string;
  /** True for the first image in a page section — disables lazy loading */
  priority?: boolean;
  /** Object-fit position hint, e.g. "center 20%" */
  objectPosition?: string;
};

/**
 * Drop-in <img> replacement that:
 *  1. Shows an animated skeleton while the image downloads
 *  2. Fades the real image in once loaded
 *  3. Serves srcset via Vercel Image Optimization for correct sizing
 */
export function ProgressiveImage({
  src,
  alt,
  className = "",
  skeletonClass = "bg-gray-800",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px",
  priority = false,
  objectPosition,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  // src is always the original URL — safe fallback if Vercel optimizer is unavailable.
  // srcSet carries the optimized versions; browser picks the best one automatically.
  const srcSet = makeSrcSet(src);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Skeleton — hidden once image is ready */}
      <div
        className={`absolute inset-0 ${skeletonClass} ${loaded ? "opacity-0" : "animate-pulse"} transition-opacity duration-500 pointer-events-none`}
      />

      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={objectPosition ? { objectPosition } : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} // don't leave skeleton up on broken image
      />
    </div>
  );
}
