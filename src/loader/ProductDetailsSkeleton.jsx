// Mirrors ProductDetailsPage: gallery (thumbs + main), info column, tabs, related grid.
export default function ProductDetailsSkeleton() {
  return (
    <div aria-hidden="true" className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50">
      <style>{`
        @keyframes product-details-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-2xl shadow-sm">
        {/* Gallery */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 order-2 md:order-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Block key={i} className="w-16 h-20 rounded-lg shrink-0" />
            ))}
          </div>
          <Block className="flex-1 order-1 md:order-2 h-[450px] rounded-2xl" />
        </div>

        {/* Info */}
        <div className="lg:col-span-7 space-y-5">
          <Block className="h-7 w-3/4 rounded-md" />
          <div className="flex items-center gap-3">
            <Block className="h-8 w-28 rounded-md" />
            <Block className="h-5 w-16 rounded-md" />
            <Block className="h-5 w-14 rounded-full" />
          </div>
          <Block className="h-3 w-52 rounded-full" />
          <Block className="h-10 w-72 max-w-full rounded-xl" />

          <div className="space-y-3">
            <Block className="h-3 w-28 rounded-full" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Block key={i} className="w-10 h-10 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Block className="h-3 w-16 rounded-full" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Block key={i} className="w-7 h-7 rounded-full" />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t pt-5">
            <Block className="flex-1 min-w-[130px] h-11 rounded-xl" />
            <Block className="flex-1 min-w-[130px] h-11 rounded-xl" />
            <Block className="w-36 h-11 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Block key={i} className="h-16 rounded-xl" />
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 space-y-3">
        <Block className="h-4 w-48 rounded-full" />
        <Block className="h-3 w-full rounded-full" />
        <Block className="h-3 w-11/12 rounded-full" />
        <Block className="h-3 w-3/4 rounded-full" />
      </div>

      {/* Related */}
      <Block className="h-4 w-36 rounded-full mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`bg-white p-3 rounded-xl border border-gray-100 ${i >= 2 ? 'max-md:hidden' : ''}`}
          >
            <Block className="h-44 rounded-lg mb-2" />
            <Block className="h-3 w-4/5 rounded-full mb-2" />
            <Block className="h-3 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Block({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-stone-200/80 ${className}`}>
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{ animation: 'product-details-shimmer 1.6s infinite' }}
      />
    </div>
  );
}
