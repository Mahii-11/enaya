import { useState, useEffect, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import FlashSaleBanner from './ui/FlashSaleBanner';
import CategorySkeleton from '../loader/CategorySkeleton';
import { getFeaturedCategories } from '../services/api';

// ট্র্যাকের অর্ধেক অংশ যেন কন্টেইনারের চেয়ে চওড়া থাকে, তাই কম ক্যাটাগরি হলে লিস্টটা বারবার রিপিট করা হয়
const MIN_ITEMS_PER_HALF = 24;

const MotionLink = motion.create(Link);

export default function CategoryAndBanner() {
  const [categories, setCategories] = useState(null);
  const [categoriesFailed, setCategoriesFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getFeaturedCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setCategoriesFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ইনফিনিট লুপের জন্য ক্যাটাগরি লিস্টটা ডুপ্লিকেট করে দিচ্ছি
  // (ট্র্যাক ৫০% পর্যন্ত গেলে ঠিক দ্বিতীয় সেটের শুরু থেকে আবার একই জায়গা দেখাবে,
  // তাই সিমলেসলি লুপ হবে, কোনো জাম্প/কাটাকাটি চোখে পড়বে না)
  const loopedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const repeat = Math.ceil(MIN_ITEMS_PER_HALF / categories.length);
    const half = Array.from({ length: repeat }, () => categories).flat();
    return [...half, ...half];
  }, [categories]);

  // ফ্ল্যাশ সেল অন/অফ করার স্টেট (True থাকলে দেখাবে, False হলে হাইড হয়ে যাবে)
  const [showFlashSale, setShowFlashSale] = useState(true);

  // হোভার করলে স্লাইড পজ হবে, কার্সর সরালে আবার স্মুথলি কন্টিনিউ করবে
  const [isPaused, setIsPaused] = useState(false);

  // লাইভ কাউন্টডাউন টাইমার লজিক (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 59, seconds: 28 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-10">

      {/* ---------------- 1. ALL CATEGORIES — AUTO INFINITE SMOOTH SLIDER ---------------- */}
      {!categoriesFailed && (categories === null || categories.length > 0) && (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-900 tracking-tight">
            All Categories
          </h2>
        </div>

        {categories === null ? (
          <CategorySkeleton />
        ) : (
        /* বাইরের কনটেইনার — এখানে overflow hidden থাকবে, ভিতরে ট্র্যাকটা অনবরত স্লাইড করবে */
        <div
          className="relative w-full overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex items-center gap-4 sm:gap-6 pb-4 pt-1 category-track"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              width: 'max-content',
            }}
          >
            {loopedCategories.map((cat, index) => (
              <MotionLink
                key={`${cat.id}-${index}`}
                to={`/shop-page?category=${cat.slug}`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center shrink-0 group cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-white mb-2.5 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-800 group-hover:text-[#C8795A] transition-colors text-center">
                  {cat.name}
                </span>
              </MotionLink>
            ))}
          </div>
        </div>
        )}

        {/* ইনফিনিট স্ক্রলের অ্যানিমেশন — ট্র্যাকটা তার নিজের অর্ধেক (৫০%) পর্যন্ত বাম দিকে সরে,
            যেহেতু লিস্টটা ডুপ্লিকেট করা, তাই ৫০% পয়েন্টে গিয়ে আবার শুরুর মতোই দেখায়,
            ফলে কোনো ঝাঁকুনি বা রিসেট চোখে পড়ে না, একদম সিমলেস লুপ চলতে থাকে।
            hover করলে animationPlayState paused হয়ে যায়, ঠিক যেখানে ছিল সেখানেই থেমে যায়,
            আর mouse leave করলে ঠিক সেখান থেকেই আবার স্মুথলি চলা শুরু করে (রিস্টার্ট হয় না)। */}
        <style>{`
          .category-track {
            animation: category-scroll 35s linear infinite;
          }
          @keyframes category-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
      )}

      {showFlashSale && <FlashSaleBanner timeLeft={timeLeft} />}

    </section>
  );
}