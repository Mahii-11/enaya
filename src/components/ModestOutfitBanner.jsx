import React from 'react';
import { FaWandMagicSparkles, FaCamera, FaStar, FaRibbon } from 'react-icons/fa6';

export default function ModestOutfitBanner() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 py-4">
      {/* Banner Container: 1920x300 aspect ratio matching background */}
      <div className="w-full bg-[#E8E1D9] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm flex items-center justify-between min-h-[220px] md:min-h-[280px] lg:min-h-[300px] px-6 md:px-16 relative">
        
        {/* Left Content Area (Typography & Icons) */}
        <div className="flex flex-col items-center text-center max-w-lg z-10 py-6">
          {/* Cursive Subheading */}
          <span className="font-serif italic text-2xl md:text-4xl text-[#4A3E3D] tracking-wide mb-1">
            Modest
          </span>

          {/* Main Title */}
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#2B2321] tracking-tight uppercase font-medium">
            Outfit Ideas
          </h2>

          {/* Divider Line with Heart Icon */}
          <div className="flex items-center gap-3 w-full my-3 justify-center">
            <div className="h-[1px] bg-[#9A8C87] w-16 md:w-28 opacity-60" />
            <span className="text-xs text-[#4A3E3D]">♥</span>
            <div className="h-[1px] bg-[#9A8C87] w-16 md:w-28 opacity-60" />
          </div>

          {/* Tagline */}
          <p className="text-xs md:text-sm text-[#5C4F4D] tracking-wider mb-6 font-light">
            Inspiration for Every Occasion
          </p>

          {/* Feature Icons Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 pt-2 border-t border-[#D5C9BD] w-full">
            <div className="flex items-center gap-2 justify-center text-[#4A3E3D]">
              <FaWandMagicSparkles className="text-xs" />
              <span className="text-[10px] md:text-xs font-medium">Modest Fashion</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-[#4A3E3D]">
              <FaCamera className="text-xs" />
              <span className="text-[10px] md:text-xs font-medium">Style Inspo</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-[#4A3E3D]">
              <FaStar className="text-xs" />
              <span className="text-[10px] md:text-xs font-medium">Mix & Match</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-[#4A3E3D]">
              <FaRibbon className="text-xs" />
              <span className="text-[10px] md:text-xs font-medium">Classy & Timeless</span>
            </div>
          </div>
        </div>

        {/* Right Side Image (Abaya Model Photo) */}
        <div className="h-full absolute right-0 top-0 w-1/2 md:w-5/12 overflow-hidden flex justify-end">
          <img
            src="https://via.placeholder.com/600x600/D5C9BD/4A3E3D?text=Abaya+Model+Photo" 
            alt="Modest Outfit Model"
            className="h-full w-full object-cover object-center"
          />
        </div>

      </div>
    </section>
  );
}