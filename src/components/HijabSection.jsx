import React from 'react';
import { Link } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { FaBagShopping, FaCartPlus } from 'react-icons/fa6'; 

const productsData = [
  {
    id: 1,
    title: 'Premium Chiffon Instant Hijab',
    category: 'Chiffon Hijab',
    discount: '15% OFF',
    currentPrice: 380,
    originalPrice: 450,
    image: '/images/hijab-1.jpg',
  },
  {
    id: 2,
    title: 'Luxury Turkish Silk Satin Hijab',
    category: 'Silk Hijab',
    discount: '20% OFF',
    currentPrice: 520,
    originalPrice: 650,
    image: '/images/hijab-2.jpg',
  },
  {
    id: 3,
    title: 'Breathable Jersey Everyday Hijab',
    category: 'Jersey Hijab',
    discount: '10% OFF',
    currentPrice: 315,
    originalPrice: 350,
    image: '/images/hijab-3.jpg',
  },
  {
    id: 4,
    title: 'Crinkle Crimp Cotton Scarf Hijab',
    category: 'Cotton Hijab',
    discount: '25% OFF',
    currentPrice: 270,
    originalPrice: 360,
    image: '/images/hijab-4.jpg',
  },
  {
    id: 5,
    title: '3-Layer Niqab & Khimar Hijab Set',
    category: 'Khimar & Niqab',
    discount: '20% OFF',
    currentPrice: 760,
    originalPrice: 950,
    image: '/images/hijab-5.jpg',
  },
  
];

const ProductCard = ({ product }) => {
  return (
    <div className="relative bg-white border border-gray-200 rounded-[8px] overflow-hidden flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow">
      
      {/* Top Image Box */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
          {product?.discount && (
    <div 
      className="absolute top-0 left-0 bg-[#C8795A] text-white text-[8px] sm:text-[9px] font-bold uppercase z-10 shadow-sm pl-2 pr-4 py-0.5 tracking-wider"
     
    >
      {product.discount}
    </div>
  )}

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover block hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Content */}
          <div className="p-3.5 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="text-gray-900 text-xs font-semibold line-clamp-1 mb-2">
                {product.title}
              </h3>
    
              <div className="flex items-center gap-2 mb-3">
                <span className="text-black font-extrabold text-base sm:text-lg">
                  ৳{product.currentPrice}
                </span>
                <span className="text-[#C8795A] line-through text-xs font-semibold">
                  ৳{product.originalPrice}
                </span>
              </div>
            </div>
    
          {/* Action Buttons Section */}
<div className={`grid ${true ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2'} gap-1.5 w-full pt-1`}>
  {/* Buy Now Button: Phone view-ete (md er niche) hide thakbe, md ba tar upore show korbe */}
  <button
    type="button"
    title="Buy Now"
    onClick={() => onBuyNow?.(product)}
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
    onClick={() => onAddToCart?.(product)}
    className="col-span-1 md:col-span-auto relative overflow-hidden group bg-white border border-[#C8795A] text-[#C8795A] hover:text-white font-medium py-2 px-1 rounded-md flex items-center justify-center gap-1 transition-colors duration-300 leading-tight"
  >
    {/* Left to Right Liquid Fill Effect */}
    <span className="absolute inset-0 bg-[#C8795A] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>

    {/* Button Content (Icon and Text stay on top) */}
    <FaCartPlus className="text-sm shrink-0 relative z-10 transition-colors duration-300" />
    <span className=" text-[10px] xl:text-[11px] whitespace-nowrap relative z-10 transition-colors duration-300">
      Add to Cart
    </span>
  </button>
</div>
          </div>
    </div>
  );
};

export default function HijabSection() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 py-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black tracking-tight">Georgette</h2>
        <Link
          to="/shop-page"
          className="text-lg font-bold text-black hover:opacity-75 transition-opacity"
        >
          View All
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {productsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}