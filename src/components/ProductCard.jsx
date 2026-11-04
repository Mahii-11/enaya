import { Link } from 'react-router-dom';
import { FaBolt, FaCartPlus } from 'react-icons/fa6';
import { getPriceInfo } from '../utils/productPrice';

// সব জায়গার প্রোডাক্ট কার্ডের কমন ডিজাইন (Shop page-এর কার্ডের ডিজাইন অনুসরণ করে)
// product: { name, slug, image, type, price, offer_price, min_price, max_price, discount_percent }
export default function ProductCard({ product, onBuyNow, onAddToCart }) {
  const { current, original } = getPriceInfo(product);
  const detailsPath = product.slug ? `/product-details/${product.slug}` : null;
  const discount = product.discount_percent > 0 ? `${product.discount_percent}% OFF` : null;

  // slug না থাকলে (ডামি ডাটা) লিংক ছাড়া সাধারণ wrapper
  const MediaWrapper = detailsPath ? Link : 'div';
  const mediaProps = detailsPath ? { to: detailsPath } : {};

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col">
      <MediaWrapper
        {...mediaProps}
        className="relative block aspect-[2/3] overflow-hidden bg-gray-50"
      >
        {discount && (
          <div className="absolute top-0 left-0 bg-[#C8795A] text-white text-[10px] font-bold uppercase z-10 shadow-sm pl-2.5 pr-4 py-1 tracking-wider">
            {discount}
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </MediaWrapper>

      <div className="p-4 flex flex-col flex-1">
        <h4
          className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]"
          title={product.name}
        >
          {detailsPath ? <Link to={detailsPath}>{product.name}</Link> : product.name}
        </h4>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-extrabold text-gray-900">{current}</span>
          {original && <span className="text-sm text-[#C8795A] line-through">{original}</span>}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            title="Buy Now"
            onClick={() => onBuyNow?.(product)}
            className="relative overflow-hidden group/btn bg-white border border-[#C8795A] text-[#C8795A] hover:text-white font-medium py-2 px-1 rounded-md flex items-center justify-center gap-1.5 transition-colors duration-300"
          >
            <span className="absolute inset-0 bg-[#C8795A] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-in-out" />
            <FaBolt className="text-xs shrink-0 relative z-10" />
            <span className="text-[8px] sm:text-[11px] font-bold whitespace-nowrap relative z-10">Buy Now</span>
          </button>

          <button
            type="button"
            title="Add to Cart"
            onClick={() => onAddToCart?.(product)}
            className="relative overflow-hidden group/btn bg-white border border-[#C8795A] text-[#C8795A] hover:text-white font-medium py-2 px-1 rounded-md flex items-center justify-center gap-1.5 transition-colors duration-300"
          >
            <span className="absolute inset-0 bg-[#C8795A] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-in-out" />
            <FaCartPlus className="text-xs shrink-0 relative z-10" />
            <span className="text-[8px] sm:text-[11px] font-bold whitespace-nowrap relative z-10">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
