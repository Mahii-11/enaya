import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaCartPlus } from "react-icons/fa";
import { getWatchShopProducts } from "../services/api";
import WatchShopSkeleton from "../loader/WatchShopSkeleton";
import { getPriceInfo } from "../utils/productPrice";
import useProductCardCart from "../hooks/useProductCardCart";
import SelectOptionsPopup from "./SelectOptionsPopup";

/*
  `video_embed_url` / `video_url` from the API can be an embed URL, a watch / shorts / youtu.be URL
  or an embed code - the 11-character video ID is extracted automatically.
  The API sends no orientation, so cards are portrait (YouTube Shorts / reels).
*/
const ORIENTATION = "portrait";

// Pulls the 11-character video ID out of an embed code / URL / raw ID
const getYouTubeId = (input = "") => {
  const text = String(input).trim();
  const src = text.match(/src=["']([^"']+)["']/i)?.[1] ?? text;
  const match = src.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?(?:[^#]*&)?v=)|youtu\.be\/)([\w-]{11})/i
  );
  if (match) return match[1];
  return /^[\w-]{11}$/.test(src) ? src : null;
};

// Autoplay + muted + loop + inline, with all YouTube UI switched off
const buildEmbedSrc = (id) =>
  `https://www.youtube.com/embed/${id}?${new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id, // required by YouTube for loop to work
    playsinline: "1",
    controls: "0",
    disablekb: "1",
    fs: "0",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
  }).toString()}`;

/*
  Hiding YouTube's title bar / like button / "AI" label / logo
  ------------------------------------------------------------
  YouTube draws these on top of the player (title at the top; like button, "AI"
  label and logo near the bottom) and shows them on load and on every loop
  restart, not only on hover. Besides `pointer-events-none`, they are cropped
  out with two tricks:

  1. BAR: the iframe is taller than the video, so the player letterboxes it with
     black bars above and below (BAR each). The title and other overlays anchored
     to the iframe's edges land in those bars. The iframe is shifted up by BAR so
     the video's top edge lines up with the top of the visible box, and the bars
     are clipped by the box's `overflow-hidden`.

  2. VISIBLE: only this share of the video's height is shown (top-aligned), so the
     bottom of the video, where the Shorts like button / "AI" label sit, is cut off.
     Smaller number = more of the bottom is cropped (and the video is zoomed a bit).

  Tuning: if something still peeks out at the bottom, lower PORTRAIT_VISIBLE
  (e.g. 0.78); if too much of the video is cut, raise it (e.g. 0.86).
  If the title still peeks out at the top, raise BAR (e.g. "10rem").
*/
const BAR = "8rem";
const PORTRAIT_VISIBLE = 0.82;
const LANDSCAPE_VISIBLE = 0.9;

const getIframeStyle = (orientation) => {
  const isLandscape = orientation === "landscape";
  const visible = isLandscape ? LANDSCAPE_VISIBLE : PORTRAIT_VISIBLE;
  const widthOverHeight = isLandscape ? "16 / 9" : "9 / 16";
  const heightOverWidth = isLandscape ? "9 / 16" : "16 / 9";

  // Video width: fills the box width AND makes the video tall enough that the
  // visible part of it (VISIBLE share) fills the box height.
  const videoWidth = `max(100cqw, 100cqh * ${widthOverHeight} / ${visible})`;

  return {
    width: `calc(${videoWidth})`,
    height: `calc((${videoWidth}) * ${heightOverWidth} + 2 * ${BAR})`,
    top: `calc(-1 * ${BAR})`,
  };
};

/*
  Slot width = container width split into 2 / 4 / 5 visible cards
  (mobile / tablet / desktop). Each slot has mr-3 (0.75rem) spacing, so:
    2 cards -> 2 x 0.75rem = 1.5rem
    4 cards -> 4 x 0.75rem = 3rem
    5 cards -> 5 x 0.75rem = 3.75rem
  Spacing is a margin (not `gap`) so the trailing space of each group is part of
  the group width. That is what makes the loop seam perfectly gapless.
*/
const slotClass =
  "shrink-0 mr-3 w-[calc((100cqw_-_1.5rem)/2)] md:w-[calc((100cqw_-_3rem)/4)] lg:w-[calc((100cqw_-_3.75rem)/5)]";

const VideoProductCard = ({ product, rootRef, onBuyNow, onAddToCart, isClone = false }) => {
  const boxRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const videoId = useMemo(
    () => getYouTubeId(product.video_embed_url || product.video_url),
    [product.video_embed_url, product.video_url]
  );
  const iframeStyle = useMemo(() => getIframeStyle(ORIENTATION), []);
  const { current, original } = getPriceInfo(product);
  const detailsPath = `/product-details/${product.slug}`;


  /*
    Only mount the YouTube iframe while the card is on (or just next to) the
    visible slider area. The slider renders every card twice, and 10 live YouTube
    players at once would be very heavy, especially on mobile.
  */
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) setLoaded(false);
      },
      { root: rootRef?.current ?? null, rootMargin: "0px 200px 0px 200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootRef]);

  // Cloned cards only exist for the seamless loop, keep them out of tab order
  const tabIndex = isClone ? -1 : undefined;

  return (
    <div className="relative bg-white border border-gray-200 rounded-[8px] overflow-hidden flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow">
      {/* Top Video Box (`group` drives the hover zoom, since the wrapper below ignores the mouse) */}
      <Link
        to={detailsPath}
        ref={boxRef}
        tabIndex={tabIndex}
        className="group relative block w-full h-80 md:h-96 overflow-hidden bg-gray-900 [container-type:size]"
      >
        {/* Wrapper: pointer-events-none, so the mouse / touch never reaches YouTube */}
        <div className="pointer-events-none select-none absolute inset-0 group-hover:scale-105 transition-transform duration-300">
          {/* YouTube thumbnail shown until the player is ready */}
          {videoId && (
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* YouTube embed (autoplay, muted, loop, inline) */}
          {videoId && inView && (
            <iframe
              src={buildEmbedSrc(videoId)}
              title={product.name}
              tabIndex={-1}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setLoaded(true)}
              style={iframeStyle}
              className={`absolute left-1/2 -translate-x-1/2 max-w-none border-0 pointer-events-none transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          <Link to={detailsPath} tabIndex={tabIndex}>
            <h3 className="text-gray-900 text-xs font-semibold line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-black font-extrabold text-base sm:text-lg">
              {current}
            </span>
            {original && (
              <span className="text-[#C8795A] line-through text-xs font-semibold">
                {original}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 w-full pt-1">
          {/* Buy Now Button: Phone view-ete (md er niche) hide thakbe, md ba tar upore show korbe */}
          <button
            type="button"
            title="Buy Now"
            onClick={() => onBuyNow(product)}
            tabIndex={tabIndex}
            className="hidden md:flex relative overflow-hidden group bg-white border border-[#C8795A] text-[#C8795A] hover:text-white font-medium py-2 px-1 rounded-md items-center justify-center gap-1 transition-colors duration-300 leading-tight"
          >
            {/* Left to Right Liquid Fill Effect */}
            <span className="absolute inset-0 bg-[#C8795A] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>

            {/* Button Content (Icon and Text stay on top) */}
            <FaBolt className="text-sm shrink-0 relative z-10 transition-colors duration-300" />
            <span className="hidden md:inline text-[10px] xl:text-[11px] whitespace-nowrap relative z-10 transition-colors duration-300">
              Buy Now
            </span>
          </button>

          {/* Add to Cart Button: Phone view-ete shob somoy thakbe ebong single thakle full width nibe */}
          <button
            type="button"
            title="Add to Cart"
            onClick={() => onAddToCart(product)}
            tabIndex={tabIndex}
            className="col-span-1 relative overflow-hidden group bg-white border border-[#C8795A] text-[#C8795A] hover:text-white font-medium py-2 px-1 rounded-md flex items-center justify-center gap-1 transition-colors duration-300 leading-tight"
          >
            {/* Left to Right Liquid Fill Effect */}
            <span className="absolute inset-0 bg-[#C8795A] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>

            {/* Button Content (Icon and Text stay on top) */}
            <FaCartPlus className="text-sm shrink-0 relative z-10 transition-colors duration-300" />
            <span className="text-[10px] xl:text-[11px] whitespace-nowrap relative z-10 transition-colors duration-300">
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// প্রতিটি গ্রুপে কমপক্ষে এতগুলো কার্ড থাকবে, যাতে কম প্রডাক্ট হলেও স্লাইডারে ফাঁকা জায়গা না থাকে
const MIN_CARDS_PER_GROUP = 6;

const WatchAndShop = ({
  duration = 40, // seconds for one full loop - increase for slower sliding
}) => {
  const viewportRef = useRef(null);
  const [fetched, setFetched] = useState(null);
  const [failed, setFailed] = useState(false);
  const { addToCart, buyNow, optionsProduct, closeOptions, goToDetails } = useProductCardCart();

  useEffect(() => {
    let cancelled = false;
    getWatchShopProducts()
      .then((data) => {
        if (!cancelled) setFetched(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const products = useMemo(() => {
    if (!fetched || fetched.length === 0) return [];
    const repeat = Math.ceil(MIN_CARDS_PER_GROUP / fetched.length);
    return Array.from({ length: repeat }, () => fetched).flat();
  }, [fetched]);

  if (failed || (fetched && fetched.length === 0)) return null;
  if (!fetched) return <WatchShopSkeleton />;

  return (
    <section className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
      {/* Marquee animation (kept inline so no tailwind.config change is needed) */}
      <style>{`
        @keyframes ws-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .ws-track {
          animation: ws-marquee 40s linear infinite;
          will-change: transform;
        }
        .ws-track:hover,
        .ws-track:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ws-track { animation: none; }
          .ws-viewport { overflow-x: auto !important; }
        }
      `}</style>

      {/* Section Heading */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Watch &amp; Shop
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Watch our products in action and shop your favorites
        </p>
      </div>

      {/* Viewport: clips the moving track. Container-type lets slots use `cqw` units */}
      <div
        ref={viewportRef}
        className="ws-viewport w-full overflow-hidden py-2 [container-type:inline-size]"
      >
        {/* Track = 2 identical groups; sliding by -50% lands exactly on group 2 = seamless loop */}
        <div
          className="ws-track flex w-max"
          style={{ animationDuration: `${duration}s` }}
        >
          {/* Group 1 (real cards) */}
          <div className="flex shrink-0">
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className={slotClass}>
                <VideoProductCard product={product} rootRef={viewportRef} onBuyNow={buyNow} onAddToCart={addToCart} />
              </div>
            ))}
          </div>

          {/* Group 2 (clone for the infinite loop) */}
          <div className="flex shrink-0" aria-hidden="true">
            {products.map((product, index) => (
              <div key={`clone-${product.id}-${index}`} className={slotClass}>
                <VideoProductCard isClone product={product} rootRef={viewportRef} onBuyNow={buyNow} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <SelectOptionsPopup
        product={optionsProduct}
        onClose={closeOptions}
        onSelectOptions={goToDetails}
      />
    </section>
  );
};

export default WatchAndShop;
