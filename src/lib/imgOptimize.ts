/**
 * Vercel Image Optimization helpers
 * Docs: https://vercel.com/docs/image-optimization
 *
 * /_vercel/image?url=<encoded>&w=<width>&q=<quality>
 *   – width must be in the `sizes` list declared in vercel.json
 *   – quality 1–100 (75 is a good default)
 *   – automatically serves WebP/AVIF based on Accept header
 */

const WIDTHS = [400, 800, 1200, 1920] as const;
const QUALITY = 75;

/** Single optimized URL at a given pixel width */
export function vercelImg(url: string, width: number, q = QUALITY): string {
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${q}`;
}

/**
 * Full srcset string covering all breakpoints.
 * Usage:  <img srcSet={makeSrcSet(url)} sizes="(max-width: 768px) 100vw, 50vw" />
 */
export function makeSrcSet(url: string, widths: readonly number[] = WIDTHS, q = QUALITY): string {
  return widths.map(w => `${vercelImg(url, w, q)} ${w}w`).join(", ");
}
