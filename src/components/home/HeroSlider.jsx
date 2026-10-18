import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { getSliders } from '../../services/api';
import HeroSliderSkeleton from '../../loader/HeroSliderSkeleton';
import { SlideCard } from './SlideCard';

const AUTOPLAY_INTERVAL = 4000; // 4 seconds per banner
const GAP = 32; // Gap between banner slides in pixels

export function HeroSlider() {
  const [slides, setSlides] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSliders()
      .then((data) => {
        if (!cancelled) setSlides(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || (slides && slides.length === 0)) return null;
  if (!slides) return <HeroSliderSkeleton />;

  return <HeroSliderContent originalSlides={slides} />;
}

function HeroSliderContent({ originalSlides }) {
  const totalOriginal = originalSlides.length;

  const virtualSlides = useMemo(() => {
    const last = originalSlides[totalOriginal - 1];
    const first = originalSlides[0];
    return [
      { ...last, virtualId: 'virtual-head' },
      ...originalSlides.map((s) => ({ ...s, virtualId: `primary-${s.id}` })),
      { ...first, virtualId: 'virtual-tail' },
    ];
  }, [originalSlides, totalOriginal]);

  const [virtualIndex, setVirtualIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  const containerRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const progressIntervalRef  = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Active original banner index (0..totalOriginal - 1)
  // Active original banner index (ইনস্ট্যান্ট আপডেট হওয়ার জন্য)
const activeOriginalIndex = useMemo(() => {
  if (virtualIndex === 0) return totalOriginal - 1;
  if (virtualIndex === virtualSlides.length - 1) return 0;
  return (virtualIndex - 1 + totalOriginal) % totalOriginal;
}, [virtualIndex, totalOriginal, virtualSlides.length]);


const calculateSlideWidth = useCallback((width) => {
    if (width < 640) {
      // Mobile screen
      return Math.round(width * 0.96);
    } else if (width < 1024) {
      // Tablet screen
      return Math.round(width * 0.86);
    } else if (width < 1440) {
      // Laptop / Standard Desktop screen
      return Math.round(width * 0.84);
    } else {
      // XL / Ultra-large screen (2560px ba tar uporer jonno)
      // Ekhane percentage ektu bariye dewa holo (86%) ebong max limit 1600px kora holo,
      // jate main slider-er weight bere jay ebong side-er slide gulo beshi beriye na thake।
      return Math.min(Math.round(width * 0.86), 1900);
    }
  }, []);

  const slideWidth = calculateSlideWidth(containerWidth);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const centerOffset = (containerWidth - slideWidth) / 2;
  const getTargetX = useCallback(
    (index) => {
      return centerOffset - index * (slideWidth + GAP);
    },
    [centerOffset, slideWidth]
  );

  const x = useMotionValue(getTargetX(virtualIndex));

  useEffect(() => {
    x.set(getTargetX(virtualIndex));
  }, [virtualIndex, getTargetX, x]);

// Navigate to target virtual index with spring easing (স্লাইড চেঞ্জ হওয়ার সাথে সাথেই ইনস্ট্যান্ট ডট আপডেট করার জন্য)
  const goToVirtualIndex = useCallback(
    (target) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setAutoplayProgress(0);
      startTimeRef.current = Date.now();

      // অ্যানিমেশন শুরু হওয়ার সাথেই সাথে স্টেট আপডেট করে দেওয়া হলো যাতে ডট ইনস্ট্যান্টলি সরে যায়
      setVirtualIndex(target);

      const targetX = getTargetX(target);

      animate(x, targetX, {
        type: 'spring',
        stiffness: 190,
        damping: 25,
        mass: 0.9,
        onComplete: () => {
          // Infinite loop seamless edge reset (এজ কেস ঠিক রাখার জন্য)
          if (target === 0) {
            const realLastIndex = totalOriginal;
            x.set(getTargetX(realLastIndex));
            setVirtualIndex(realLastIndex);
          } else if (target === virtualSlides.length - 1) {
            const realFirstIndex = 1;
            x.set(getTargetX(realFirstIndex));
            setVirtualIndex(realFirstIndex);
          }
          setIsAnimating(false);
        },
      });
    },
    [isAnimating, getTargetX, x, totalOriginal, virtualSlides.length]
  );

  const handleNext = useCallback(() => {
    goToVirtualIndex(virtualIndex + 1);
  }, [goToVirtualIndex, virtualIndex]);

  const handlePrev = useCallback(() => {
    goToVirtualIndex(virtualIndex - 1);
  }, [goToVirtualIndex, virtualIndex]);

  const handleSelectOriginalIndex = useCallback(
    (idx) => {
      goToVirtualIndex(idx + 1);
    },
    [goToVirtualIndex]
  );

  useEffect(() => {
    if (!isAutoplay || isHovered) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    startTimeRef.current = Date.now();

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / AUTOPLAY_INTERVAL) * 100);
      setAutoplayProgress(progress);
    }, 40);

    autoplayTimerRef.current = window.setInterval(() => {
      handleNext();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isAutoplay, isHovered, handleNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section
      id="hero-banner-slider-section"
      className="relative w-full py-2 overflow-hidden bg-[#FAF7F5]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={containerRef} className="w-full relative overflow-hidden py-1">
        <motion.div
          className="flex items-center cursor-grab active:cursor-grabbing select-none"
          style={{
            gap: `${GAP}px`,
            x,
          }}
          drag="x"
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            if (info.offset.x < -swipeThreshold) {
              handleNext();
            } else if (info.offset.x > swipeThreshold) {
              handlePrev();
            } else {
              goToVirtualIndex(virtualIndex);
            }
          }}
        >
          {virtualSlides.map((slide, vIdx) => {
            const isSlideActive = vIdx === virtualIndex;
            return (
              <SlideCard
                key={slide.virtualId}
                slide={slide}
                isActive={isSlideActive}
                index={vIdx}
                slideWidth={slideWidth}
                onSelect={() => goToVirtualIndex(vIdx)}
                // কার্ডের ভেতরের ডটের জন্য নিচের প্রপসগুলো পাঠানো হলো
                slides={originalSlides}
                currentIndex={activeOriginalIndex}
                onSelectIndex={handleSelectOriginalIndex}
                isAutoplay={isAutoplay}
                autoplayProgress={autoplayProgress}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}