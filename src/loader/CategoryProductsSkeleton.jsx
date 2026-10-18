// Mirrors one home category block: thin banner, header row, and a 2/3/4/5-column product grid.
export default function CategoryProductsSkeleton({ cards = 5 }) {
  return (
    <section
      aria-hidden="true"
      className="w-full max-w-[1600px] mx-auto px-4 py-8 bg-white"
    >
      <style>{`
        @keyframes category-products-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Banner */}
      <Block className="w-full rounded-xl md:rounded-2xl aspect-[5/1] sm:aspect-[6/1] md:aspect-[8/1] mb-6" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Block className="h-7 w-40 rounded-md" />
        <Block className="h-6 w-20 rounded-md" />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className={`border border-gray-200 rounded-[8px] overflow-hidden bg-white ${
              i >= 2 ? 'max-sm:hidden' : ''
            } ${i >= 3 ? 'max-md:hidden' : ''} ${i >= 4 ? 'max-lg:hidden' : ''}`}
          >
            <Block className="w-full h-64 sm:h-72 md:h-80" />
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
        style={{ animation: 'category-products-shimmer 1.6s infinite' }}
      />
    </div>
  );
}
