import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getsearchProducts } from "../services/api";
import Loader from "../loader/Loader";
import ProductCard from "../components/ProductCard";
import SelectOptionsPopup from "../components/SelectOptionsPopup";
import useProductCardCart from "../hooks/useProductCardCart";
import { toCardProduct } from "../utils/cardProduct";

export default function SearchResultsPage() {
  const { addToCart, buyNow, optionsProduct, closeOptions, goToDetails } = useProductCardCart();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const result = await getsearchProducts(query);
        setProducts(result);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return <Loader type="dealofday" count={5} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6">Search results for: {query}</h1>

      {products.length === 0 ? (
        <p className="text-gray-500 py-10 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.product_id || product.id}
              product={toCardProduct(product)}
              onBuyNow={buyNow}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      <SelectOptionsPopup
        product={optionsProduct}
        onClose={closeOptions}
        onSelectOptions={goToDetails}
      />
    </div>
  );
}
