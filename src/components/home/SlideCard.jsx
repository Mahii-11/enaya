import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, Video as VideoIcon } from 'lucide-react';

export function SlideCard({ 
  slide, 
  isActive, 
  index, 
  slideWidth, 
  onSelect,
  slides = [],           // সব স্লাইডের ডেটা
  currentIndex = 0,      // মেইন অ্যাক্টিভ ইনডেক্স
  onSelectIndex,         // ডটে ক্লিক করলে স্লাইড পরিবর্তনের ফাংশন
  isAutoplay = true,     // অটোপ্লে স্টেট
  autoplayProgress = 0   // অটোপ্লে প্রোগ্রেস পার্সেন্টেজ
}) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Play/pause video when slide becomes active or inactive
  useEffect(() => {
    if (slide.mediaType === 'video' && videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, slide.mediaType]);

  const toggleVideoPlayback = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Organic Ken Burns drift coordinates for varied cinematic zoom-in
  const kenBurnsConfig = [
    { scale: 1.10, x: 5, y: -4, origin: '50% 45%' },
    { scale: 1.09, x: -6, y: -3, origin: '45% 50%' },
    { scale: 1.11, x: 0, y: -6, origin: '50% 50%' },
    { scale: 1.08, x: 6, y: -4, origin: '50% 40%' },
    { scale: 1.10, x: -5, y: 4, origin: '52% 48%' },
    { scale: 1.09, x: 4, y: 3, origin: '48% 52%' },
  ][index % 6];

  return (
    <div
      style={{ width: `${slideWidth}px` }}
      onClick={() => {
        if (!isActive && onSelect) onSelect();
      }}
      className={`shrink-0 ${
        isActive ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {/*
        Phone (< 640px): 2:1 ratio - ager 1600:510 theke ektu lomba,
        banner-er nich ager "All Categories" heading-er jayga porjonto jay.
        Aro lomba chaile ratio komaan (jemon 16/9), kom chaile baran (jemon 5/2).
        Tablet / desktop: ager moto 1600:510 ratio.
      */}
      <div
        className="relative w-full rounded-[16px] overflow-hidden flex items-center justify-center shadow-lg aspect-[1600/510] max-sm:aspect-[2/1]"
        style={{ width: `${slideWidth}px` }}
      >
        {slide.mediaType === 'video' ? (
          /* Video Banner */
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <motion.div
              className="w-full h-full will-change-transform flex items-center justify-center"
              initial={{ scale: 1, x: 0, y: 0 }}
              animate={
                isActive
                  ? {
                      scale: kenBurnsConfig.scale,
                      x: kenBurnsConfig.x,
                      y: kenBurnsConfig.y,
                    }
                  : { scale: 1, x: 0, y: 0 }
              }
              transition={{
                scale: {
                  duration: isActive ? 7.5 : 0.8,
                  ease: isActive ? [0.25, 0.1, 0.25, 1] : [0.22, 1, 0.36, 1],
                },
                x: {
                  duration: isActive ? 7.5 : 0.8,
                  ease: 'easeOut',
                },
                y: {
                  duration: isActive ? 7.5 : 0.8,
                  ease: 'easeOut',
                },
              }}
              style={{ transformOrigin: kenBurnsConfig.origin }}
            >
              <video
                ref={videoRef}
                src={slide.mediaUrl}
                poster={slide.posterUrl}
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

          </div>
        ) : (
          /* Image Banner */
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <motion.div
              className="w-full h-full will-change-transform flex items-center justify-center"
              initial={{ scale: 1, x: 0, y: 0 }}
              animate={
                isActive
                  ? {
                      scale: kenBurnsConfig.scale,
                      x: kenBurnsConfig.x,
                      y: kenBurnsConfig.y,
                    }
                  : { scale: 1, x: 0, y: 0 }
              }
              transition={{
                scale: {
                  duration: isActive ? 7.5 : 0.8,
                  ease: isActive ? [0.25, 0.1, 0.25, 1] : [0.22, 1, 0.36, 1],
                },
                x: {
                  duration: isActive ? 7.5 : 0.8,
                  ease: 'easeOut',
                },
                y: {
                  duration: isActive ? 7.5 : 0.8,
                  ease: 'easeOut',
                },
              }}
              style={{ transformOrigin: kenBurnsConfig.origin }}
            >
              <picture className="w-full h-full">
                {slide.mobileUrl && (
                  <source media="(max-width: 639px)" srcSet={slide.mobileUrl} />
                )}
                <img
                  src={slide.mediaUrl}
                  alt={slide.altText || 'Banner'}
                  loading={index <= 1 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover object-center select-none pointer-events-none"
                />
              </picture>
            </motion.div>
          </div>
        )}

        {/* আন্তর্জাতিক সাইটগুলোর মতো কার্ডের ভেতরে একদম নিচে মাঝখানে ডট এবং প্রোগ্রেস বার (শুধুমাত্র অ্যাক্টিভ স্লাইডে শো করবে) */}
        {isActive && slides.length > 0 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
            {slides.map((s, idx) => {
              const isDotActive = idx === currentIndex;
              return (
                <button
                  key={s.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectIndex) onSelectIndex(idx);
                  }}
                  className="relative group py-0.5 px-1 focus:outline-none cursor-pointer"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div
                    className={`h-1 md:h-1.5 rounded-full transition-all duration-300 relative overflow-hidden ${
                      isDotActive ? 'w-6 sm:w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  >
                    {/* অটোপ্লে প্রোগ্রেস বার */}
                    {isDotActive && isAutoplay && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-[#E89269]"
                        style={{ width: `${autoplayProgress}%` }}
                        transition={{ ease: 'linear' }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}