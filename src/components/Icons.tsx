/* Shared inline SVG icons */

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#16a34a" />
    {/* Fox face silhouette */}
    <path
      d="M10 22 L14 12 L20 16 L26 12 L30 22 C28 28 24 30 20 30 C16 30 12 28 10 22Z"
      fill="#bbf7d0"
    />
    {/* Ears */}
    <path d="M12 14 L10 6 L16 12Z" fill="#14532d" />
    <path d="M28 14 L30 6 L24 12Z" fill="#14532d" />
    {/* Eyes */}
    <circle cx="15.5" cy="18" r="1.8" fill="#14532d" />
    <circle cx="24.5" cy="18" r="1.8" fill="#14532d" />
    {/* Nose */}
    <ellipse cx="20" cy="22" rx="1.5" ry="1.2" fill="#14532d" />
  </svg>
);

export const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-500 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
