import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  skeletonClass?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
};

/**
 * Drop-in image wrapper:
 *  - Shows an animated skeleton while the image downloads
 *  - Fades in once loaded
 *  - Passes fetchPriority="high" on above-fold images
 */
export function ProgressiveImage({
  src,
  alt,
  className = "",
  skeletonClass = "bg-gray-800",
  priority = false,
  objectPosition,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Skeleton pulse — fades out once image is ready */}
      <div
        className={`absolute inset-0 ${skeletonClass} transition-opacity duration-500 pointer-events-none ${
          loaded ? "opacity-0" : "animate-pulse opacity-100"
        }`}
      />

      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={objectPosition ? { objectPosition } : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
