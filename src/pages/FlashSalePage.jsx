import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFlashSaleProducts } from "../services/api";
import Loader from "../loader/Loader";
import FlashSaleBanner from "../components/ui/FlashSaleBanner";
import ProductCard from "../components/ProductCard";
import SelectOptionsPopup from "../components/SelectOptionsPopup";
import useProductCardCart from "../hooks/useProductCardCart";

export default function FlashSalePage() {
  const { addToCart, buyNow, optionsProduct, closeOptions, goToDetails } = useProductCardCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  // result-er sathe page number rakha hoy, tai page bodlale nijei loading dhora pore
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getFlashSaleProducts(page)
      .then((data) => {
        if (!cancelled) setResult({ page, ...data });
      })
      .catch(() => {
        if (!cancelled) setResult({ page, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const loading = result?.page !== page;

  const goToPage = (next) => {
    setSearchParams(next > 1 ? { page: String(next) } : {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderProducts = () => {
    if (loading) return <Loader type="dealofday" count={5} />;

    if (result.failed) {
      return (
        <p className="text-center py-16 text-gray-500">
          Could not load flash sale products. Please try again.
        </p>
      );
    }

    if (!result.isRunning || result.products.length === 0) {
      return (
        <p className="text-center py-16 text-gray-500">
          No flash sale products available right now.
        </p>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {result.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuyNow={buyNow}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {result.lastPage > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="px-4 py-2 rounded-md border border-[#C8795A] text-[#C8795A] text-sm font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              {page} / {result.lastPage}
            </span>
            <button
              type="button"
              disabled={page >= result.lastPage}
              onClick={() => goToPage(page + 1)}
              className="px-4 py-2 rounded-md border border-[#C8795A] text-[#C8795A] text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <FlashSaleBanner showViewAll={false} />
      {renderProducts()}

      <SelectOptionsPopup
        product={optionsProduct}
        onClose={closeOptions}
        onSelectOptions={goToDetails}
      />
    </div>
  );
}
