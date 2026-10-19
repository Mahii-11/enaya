import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Zap, Moon, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

/*
  Usage (in your parent component):
    {showFlashSale && <FlashSaleBanner timeLeft={timeLeft} />}

  Breakpoints:
    - below `sm` (phones): compact - smaller text, icon, timer and button,
      icon + title in one row, timer + button share one row
    - `sm` and up (tablet / laptop / desktop): full size

  Animations (Eid festive vibe):
    - Zap icon blink + glowing ring
    - Gold shine sweeps across the title/badge (left -> right -> left)
    - Crescent moon glow, twinkling stars, swinging lanterns
    - Sob animation `prefers-reduced-motion` e bondho hoye jay
*/

// Background-e jhikimiki tara (top/left % e position)
const STARS = [
  { top: "14%", left: "6%", size: 10, delay: 0 },
  { top: "72%", left: "12%", size: 7, delay: 0.8 },
  { top: "22%", left: "38%", size: 8, delay: 1.4 },
  { top: "80%", left: "46%", size: 6, delay: 0.4 },
  { top: "12%", left: "64%", size: 9, delay: 1.1 },
  { top: "68%", left: "78%", size: 7, delay: 1.8 },
  { top: "30%", left: "92%", size: 11, delay: 0.6 },
];

// Gold shine gradient - text-er upor diye aloh jhilik
const SHINE_GRADIENT =
  "linear-gradient(110deg, #ffffff 35%, #F5D78E 45%, #fff8e1 50%, #F5D78E 55%, #ffffff 65%)";

function Lantern({ className = "", delay = 0, reduce }) {
  return (
    <motion.div
      className={`absolute top-0 origin-top pointer-events-none ${className}`}
      animate={reduce ? undefined : { rotate: [-6, 6, -6] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="mx-auto w-px h-6 bg-[#E7C9A0]/50" />
      <svg width="22" height="34" viewBox="0 0 22 34" className="drop-shadow-[0_0_8px_rgba(245,215,142,0.7)]">
        <path d="M7 2h8l2 4H5z" fill="#C8795A" />
        <path d="M4 6h14l-2 20H6z" fill="#F5D78E" fillOpacity="0.9" />
        <path d="M8 8h6l-1 16H9z" fill="#fff8e1" fillOpacity="0.8" />
        <path d="M6 26h10l-2 4H8z" fill="#C8795A" />
        <circle cx="11" cy="32" r="1.5" fill="#F5D78E" />
      </svg>
    </motion.div>
  );
}

const FlashSaleBanner = ({
  timeLeft = { hours: 0, minutes: 0, seconds: 0 },
}) => {
  const reduce = useReducedMotion();
  const pad = (n) => String(n ?? 0).padStart(2, "0");

  const units = [
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  // Shine ekbar dane jay, ekbar bame ashe (mirror loop)
  const shine = reduce
    ? {}
    : {
        animate: { backgroundPosition: ["100% 0%", "0% 0%"] },
        transition: {
          duration: 2.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      };

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl bg-[#2A1810] text-white border border-[#3E241A]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2A1810] via-[#3a2016] to-[#1c100a] opacity-95 pointer-events-none" />

      {/* Soft golden glow behind the moon */}
      <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-[#F5D78E]/10 blur-3xl pointer-events-none" />

      {/* Crescent moon */}
      <motion.div
        className="absolute top-2 right-3 sm:top-3 sm:right-6 text-[#F5D78E] pointer-events-none"
        animate={reduce ? undefined : { opacity: [0.35, 0.7, 0.35], rotate: [-8, 0, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Moon className="w-7 h-7 sm:w-10 sm:h-10 fill-[#F5D78E] drop-shadow-[0_0_10px_rgba(245,215,142,0.8)]" />
      </motion.div>

      {/* Twinkling stars */}
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-[#F5D78E] pointer-events-none"
          style={{ top: s.top, left: s.left }}
          animate={reduce ? undefined : { opacity: [0.15, 1, 0.15], scale: [0.7, 1.15, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <Star style={{ width: s.size, height: s.size }} className="fill-current" />
        </motion.span>
      ))}

      {/* Hanging lanterns (majher faka jaygay, shudhu lg+) */}
      <div className="hidden lg:block">
        <Lantern className="left-[46%]" reduce={reduce} />
        <Lantern className="left-[52%] scale-75" delay={0.6} reduce={reduce} />
      </div>

      <div className="relative z-10 px-4 py-4 sm:px-10 sm:py-9 flex flex-col lg:flex-row items-center justify-between gap-3.5 sm:gap-6">
        {/* Left side: Icon, Title & Subtitle */}
        <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto text-left sm:text-center lg:text-left">
          {/* Blinking flash icon */}
          <div className="relative shrink-0">
            {!reduce && (
              <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#F5D78E] animate-ping opacity-40" />
            )}
            <motion.div
              className="relative w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#E08A62] to-[#C8795A] flex items-center justify-center"
              animate={
                reduce
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0px rgba(245,215,142,0)",
                        "0 0 22px rgba(245,215,142,0.85)",
                        "0 0 0px rgba(245,215,142,0)",
                      ],
                    }
              }
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                animate={reduce ? undefined : { opacity: [1, 0.2, 1, 1], scale: [1, 0.85, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.2, 0.45, 1] }}
                className="flex"
              >
                <Zap className="w-[18px] h-[18px] sm:w-6 sm:h-6 text-[#FFF3C4] fill-[#FFF3C4]" />
              </motion.span>
            </motion.div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-start sm:justify-center lg:justify-start gap-2 mb-1">
              <span className="relative overflow-hidden whitespace-nowrap text-[9px] sm:text-[11px] font-semibold tracking-wide sm:tracking-wider uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-[#C8795A]/30 text-[#F5D78E] border border-[#F5D78E]/40">
                ☪ EID SPECIAL • UP TO 70% OFF
                {/* Badge-er upor diye aloh chole jay */}
                {!reduce && (
                  <motion.span
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                    animate={{ left: ["-40%", "110%"] }}
                    transition={{ duration: 2.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  />
                )}
              </span>
            </div>

            <motion.h3
              className="text-lg sm:text-2xl leading-tight font-serif font-bold tracking-wide bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,215,142,0.35)]"
              style={{ backgroundImage: SHINE_GRADIENT, backgroundSize: "250% 100%", backgroundPosition: "100% 0%" }}
              {...shine}
            >
              Flash Sale
            </motion.h3>

            <p className="text-[11px] leading-snug sm:text-sm sm:leading-normal text-stone-300 mt-0.5 sm:mt-1 max-w-md">
              Celebrate Eid with premium picks at all-time-low prices. New items
              added every hour—once they're gone, they're gone.
            </p>
          </div>
        </div>

        {/* Right side: Countdown Timer & View All Button */}
        <div className="flex items-center justify-between sm:justify-center sm:flex-wrap gap-2.5 sm:gap-6 w-full sm:w-auto">
          {/* Timer Box */}
          <div className="flex flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-2 text-center bg-black/40 backdrop-blur-md px-2 py-1.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-[#F5D78E]/20">
            {units.map((unit, index) => (
              <Fragment key={unit.label}>
                {index > 0 && (
                  <motion.span
                    className="text-[#F5D78E]/70 font-bold text-sm sm:text-base"
                    animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    :
                  </motion.span>
                )}
                <div className="flex flex-col px-1.5 sm:px-2">
                  <span className="text-base sm:text-xl leading-tight font-bold font-mono text-white">
                    {pad(unit.value)}
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-stone-400 uppercase tracking-wider">
                    {unit.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>

          {/* View All Button */}
          <Link
            to="/online-sale"
            className="relative overflow-hidden shrink-0 whitespace-nowrap bg-gradient-to-r from-[#F5D78E] to-[#E7C9A0] text-neutral-900 hover:brightness-105 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-[#F5D78E]/20 flex items-center gap-2 group"
          >
            <span className="relative z-10">View all</span>
            {!reduce && (
              <motion.span
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12"
                animate={{ left: ["-40%", "120%"] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
