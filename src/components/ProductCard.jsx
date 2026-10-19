import { Link } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { FaCartPlus } from 'react-icons/fa6';
import { getPriceInfo } from '../utils/productPrice';

// সব জায়গার প্রোডাক্ট কার্ডের কমন ডিজাইন (Home সেকশন, Related Products ইত্যাদি)
export default function ProductCard({ product, onBuyNow, onAddToCart }) {
  const { current, original } = getPriceInfo(product);
  const detailsPath = `/product-details/${product.slug}`;
  const discount = product.discount_percent > 0 ? `${product.discount_percent}% OFF` : null;


  return (
    <div className="relative bg-white border border-gray-200 rounded-[8px] overflow-hidden flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow">

      {/* Top Image Box */}
      <Link to={detailsPath} className="relative block w-full h-64 sm:h-72 md:h-80 overflow-hidden">
        {/* Corner Ribbon Badge */}
        {discount && (
          <div className="absolute top-0 left-0 bg-[#C8795A] text-white text-[8px] sm:text-[9px] font-bold uppercase z-10 shadow-sm pl-2 pr-4 py-0.5 tracking-wider">
            {discount}
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover block hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          <Link to={detailsPath}>
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
}
