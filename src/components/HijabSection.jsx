import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

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

// স্ট্যাটিক ডাটাকে শেয়ার্ড ProductCard-এর শেপে বদলায় (slug নেই, তাই কার্ড লিংক ছাড়া থাকে)
const toCardProduct = (item) => ({
  id: item.id,
  name: item.title,
  image: item.image,
  offer_price: item.currentPrice,
  price: item.originalPrice,
  discount_percent: parseInt(item.discount, 10) || 0,
});

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
          <ProductCard key={product.id} product={toCardProduct(product)} />
        ))}
      </div>
    </section>
  );
}