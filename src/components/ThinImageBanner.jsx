import React from 'react';

// Banner Data Array of Objects
const bannerData = [
  {
    id: 1,
    title: 'Super Sale Strip Banner',
    // 1920x300 pixel design e-commerce banner height e ekdom chikon hoy
    imageUrl: '/images/Untitled design.png',
    link: '#',
  },
];

export default function ThinImageBanner() {
  const banner = bannerData[0];

  return (
    <section className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-3 md:py-5">
      {/* Banner Container */}
      <div className="w-full overflow-hidden rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <a href={banner.link} className="block w-full">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            /* 
               1. w-full: Always takes 100% width of container
               2. h-auto: Automatically adjusts height responsively
               3. aspect-[6/1] to aspect-[8/1]: Keeps the thin banner proportion perfect on all screens
            */
            className="w-full h-auto aspect-[5/1] sm:aspect-[6/1] md:aspect-[8/1] object-cover block"
          />
        </a>
      </div>
    </section>
  );
}