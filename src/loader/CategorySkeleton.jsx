// Mirrors the "All Categories" row: rounded tile + name line, same sizes and edge fade as the real track.
export default function CategorySkeleton({ count = 10 }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
      }}
    >
      <style>{`
        @keyframes category-skeleton-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="flex items-center gap-4 sm:gap-6 pb-4 pt-1 w-max">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col items-center shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-200/80 mb-2.5">
              <div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{ animation: 'category-skeleton-shimmer 1.6s infinite' }}
              />
            </div>
            <div className="h-3 w-16 sm:w-20 rounded-full bg-stone-200/80" />
          </div>
        ))}
      </div>
    </div>
  );
}
