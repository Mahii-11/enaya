import { Search, ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getsearchProducts } from "../services/api";
import useDebounce from "../hooks/useDebounce";

export default function SearchPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const debounceSearch = useDebounce(search, 500);



  useEffect(() => {

    const fetchProducts = async () => {

      if (!debounceSearch) {
        setProducts([]);
        return;
      }

      const result = await getsearchProducts(debounceSearch);

      console.log("Products:", result);

      setProducts(result);

    };

    fetchProducts();

  }, [debounceSearch]);
  


   const handleSearch = (e) => {
  setSearch(e.target.value);
};


   const handleKeyDown = (e) => {
  if (e.key === "Enter" && search.trim()) {

    setProducts([]);
    navigate(`/search-results?q=${encodeURIComponent(search)}`);
    setSearch("");

  }
};



  return (
    <div className="min-h-screen bg-white">

      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        <h1 className="text-lg font-semibold text-gray-900">
          Search
        </h1>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className="
            pl-11
            h-12
            rounded-full
            border
            border-gray-200
            bg-gray-50
            focus:bg-white
            focus:border-[#02010a]
            focus:ring-2
            focus:ring-[#010002]/20
            transition
            "
            
          />
        </div>
      </div>


            <div className="px-4">

              {products.length > 0 && (
  <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm">

    <div className="flex justify-center pt-20 px-3 sm:px-6">

      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[75vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">

          <h2 className="text-sm sm:text-base font-semibold">
            Product Search By:
            <span className="text-orange-500 ml-1">{search}</span>
          </h2>

          <button
            onClick={() => setProducts([])}
            className="text-gray-500 hover:text-black text-sm"
          >
            Close
          </button>

        </div>

        {/* Product List */}
        <div className="p-3 sm:p-5 space-y-3">

          {products.slice(0, 8).map((product) => (

            <div
              key={product.id}
              className="flex items-center gap-3 sm:gap-4 bg-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
            >

              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
              />

              {/* Product Info */}
              <div className="flex-1">

                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                  {product.name}
                </p>

                <p className="text-orange-500 font-semibold mt-1 text-sm sm:text-base">
                  Tk. {product.price}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>
)}
             
</div>
</div>
  );
}