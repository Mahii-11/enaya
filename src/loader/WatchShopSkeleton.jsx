// Mirrors the Watch & Shop section: centered heading + a row of tall video cards (2 / 4 / 5 visible).
export default function WatchShopSkeleton({ cards = 5 }) {
  return (
    <section
      aria-hidden="true"
      className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12"
    >
      <style>{`
        @keyframes watch-shop-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Heading */}
      <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
        <Block className="h-7 sm:h-8 w-44 rounded-md" />
        <Block className="h-3 w-64 max-w-full rounded-full" />
      </div>

      {/* Cards */}
      <div className="flex gap-3 overflow-hidden py-2">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className={`shrink-0 w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-2.25rem)/4)] lg:w-[calc((100%-3rem)/5)] border border-gray-200 rounded-[8px] overflow-hidden bg-white ${
              i >= 2 ? 'max-md:hidden' : ''
            } ${i >= 4 ? 'max-lg:hidden' : ''}`}
          >
            <Block className="w-full h-80 md:h-96" />
            <div className="p-3.5 space-y-3">
              <Block className="h-3 w-4/5 rounded-full" />
              <Block className="h-5 w-1/2 rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                <Block className="h-8 rounded-md max-md:hidden" />
                <Block className="h-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Block({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-stone-200/80 ${className}`}>
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{ animation: 'watch-shop-shimmer 1.6s infinite' }}
      />
    </div>
  );
}
