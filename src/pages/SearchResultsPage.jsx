import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getsearchProducts } from "../services/api";
import Loader from "../loader/Loader";
import { Eye, ShoppingCart } from "lucide-react";
import { addItem } from "../cart/cartSlice";
import { normalizeProductForCart } from "../utils/cartAdapter";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartPopup from "../components/CartPopup";

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);
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



   function handleAddToCart(e, product) {
    e.stopPropagation();
  
    if (product.product_type === "variable") {
      navigate(`/product-details/${product.product_slug}`);
      return;
    }
  
    const normalizedProduct = normalizeProductForCart({
      ...product,
      id: product.product_id || product.id,
      product_id: product.product_id || product.id,
      product_name: product.name,
      discount_price: product.price,
      thumb_image: product.image,
    });
  
    dispatch(addItem(normalizedProduct));
  
    setCartPopup({
      image: product.image,
      price: product.price,
    });
  
    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  }
  






   if (loading) {
    return (
      <Loader type="dealofday" count={5} />
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-xl font-semibold mb-6">
        Search results for: {query}
      </h1>

         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-sm hover:shadow-md hover:scale-[1.02] transition-all duration-150 cursor-pointer overflow-hidden group"
            
          >

            {/* Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
                  <button 
                             onClick={(e) => handleAddToCart(e, product)}
               
                             className="md:hidden absolute bottom-1 right-1 bg-[#e62e04] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md active:scale-90 transform "
                              >
                               {product.product_type === "variable"
                               ? <Eye size={16} color="white" />
                               : <ShoppingCart size={16} color="white" />
                              }
                           </button>
               
               
                            <button
                               onClick={(e) => handleAddToCart(e, product)}   
                               className="hidden md:flex absolute bottom-0 left-0 right-0 bg-[#e62e04] text-white text-[10px] font-semibold py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 items-center justify-center gap-1"
                            >
               
                               {product.product_type === "variable"
                               ? "View Details"
                               : "Add to Cart"
                              }
                        
                           </button>
            </div>
                 <div className="p-1.5">
        <p className="text-[11px] text-gray-700 leading-tight line-clamp-2 mb-1 min-h-[2.5em]">
          {product.name}
        </p>

        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-[#e62e04] font-bold text-sm leading-none">
             Tk.{Number(product.price).toLocaleString()}
          </span>
        </div>
      </div>
          </div>
          
        ))}
      </div>
      
      <CartPopup
        popup={cartPopup}
        onClose={() => setCartPopup(null)}
      />
      

    </div>
  );
}