import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeCategories } from '../services/api';
import CategoryProductsSkeleton from '../loader/CategoryProductsSkeleton';
import useProductCardCart from '../hooks/useProductCardCart';
import SelectOptionsPopup from './SelectOptionsPopup';
import ProductCard from './ProductCard';


function CategoryProductsBlock({ section, onBuyNow, onAddToCart }) {
  const { category, products } = section;

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 py-8 bg-white">
      {/* Category Banner (ThinImageBanner-এর মতো স্টাইল) */}
      {category.banner_image && (
        <div className="w-full overflow-hidden rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow mb-6">
          <img
            src={category.banner_image}
            alt={category.name}
            className="w-full h-auto aspect-[5/1] sm:aspect-[6/1] md:aspect-[8/1] object-cover block"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black tracking-tight">{category.name}</h2>
        <Link
          to={`/shop-page?category=${category.slug}`}
          className="text-lg font-bold text-black hover:opacity-75 transition-opacity"
        >
          View All
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onBuyNow={onBuyNow} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}

export default function XiaomiSection() {
  const [sections, setSections] = useState(null);
  const [failed, setFailed] = useState(false);
  const { addToCart, buyNow, optionsProduct, closeOptions, goToDetails } = useProductCardCart();

  useEffect(() => {
    let cancelled = false;
    getHomeCategories()
      .then((data) => {
        if (!cancelled) setSections(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || (sections && sections.length === 0)) return null;
  if (!sections) return <CategoryProductsSkeleton />;

  return (
    <>
      {sections.map((section) => (
        <CategoryProductsBlock
          key={section.id}
          section={section}
          onBuyNow={buyNow}
          onAddToCart={addToCart}
        />
      ))}
      <SelectOptionsPopup
        product={optionsProduct}
        onClose={closeOptions}
        onSelectOptions={goToDetails}
      />
    </>
  );
}
