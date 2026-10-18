// Mirrors the real HeroSlider layout: one centered card with the neighbouring cards peeking in from both sides.
export default function HeroSliderSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="relative w-full py-2 overflow-hidden bg-[#FAF7F5]"
    >
      <style>{`
        @keyframes hero-skeleton-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="w-full overflow-hidden py-1">
        <div className="flex items-center justify-center gap-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative shrink-0 overflow-hidden rounded-[16px] bg-gray-200/80 shadow-lg w-[96%] sm:w-[86%] lg:w-[84%] aspect-[1600/510] max-sm:aspect-[2/1]"
            >
              <div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{ animation: 'hero-skeleton-shimmer 1.6s infinite' }}
              />

              {/* Dots pill – only on the centered card, like the real slider */}
              {i === 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/10">
                  <div className="h-1.5 w-8 rounded-full bg-white/80" />
                  <div className="h-1.5 w-2 rounded-full bg-white/50" />
                  <div className="h-1.5 w-2 rounded-full bg-white/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
