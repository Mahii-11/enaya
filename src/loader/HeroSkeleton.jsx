export default function HeroSkeleton() {
  return (
    <section className="w-full bg-[#ffffff] py-6 md:py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Hero Slider Skeleton */}
        <div className="relative w-full aspect-[21/9] overflow-hidden rounded-2xl bg-gray-100">
          
          {/* Main Image Skeleton */}
          <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-[pulse_1.8s_ease-in-out_infinite]" />

          {/* Optional Overlay Content Skeleton */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-14">
            
            {/* Small Badge */}
            <div className="h-4 w-24 rounded-full bg-white/60 mb-4" />

            {/* Heading */}
            <div className="space-y-3">
              <div className="h-8 md:h-12 w-[70%] rounded-lg bg-white/70" />
              <div className="h-8 md:h-12 w-[50%] rounded-lg bg-white/60" />
            </div>

            {/* Subtitle */}
            <div className="mt-5 h-4 w-[40%] rounded bg-white/50" />

            {/* Button */}
            <div className="mt-7 h-11 w-36 rounded-xl bg-white/70" />
          </div>

          {/* Dots Skeleton */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
