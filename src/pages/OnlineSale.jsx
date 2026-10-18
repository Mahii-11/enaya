
import { useEffect, useState } from "react";
import {  getOnlineSaleProducts } from "../services/api";
import {  useNavigate } from "react-router-dom";
import Loader from "../loader/Loader"
import { useDispatch } from "react-redux";
import { addItem } from "../cart/cartSlice";
import { normalizeProductForCart } from "../utils/cartAdapter";
import CartPopup from "../components/CartPopup";
import { Eye, ShoppingCart } from "lucide-react";





export default function OnlineSale() {
  return (
    <div>
        <SaleHero />
        <OnlineSaleProducts/>
    </div>
  )
}



export function SaleHero() {
  return (
    <section className="w-full bg-[#F3F4F6] lg:bg-white  py-4 md:py-16">

      <div className="container-custom">

        <div className="lg:hidden overflow-hidden rounded-xl lg:rounded-none">

          <img
            src="/images/banner-1.png"
            alt="Sale Banner"
            className="
            w-full
            h-[120px]
            sm:h-[150px]
            md:h-[260px]
            lg:h-[320px]
            object-cover
            "
            loading="lazy"
          />

        </div>
          <div className="hidden lg:block  overflow-hidden rounded-xl lg:rounded-none">
          <img
            src="/images/sale-banner.jpg"
            alt="Sale Banner"
            className="
            w-full
            h-[120px]
            sm:h-[150px]
            md:h-[260px]
            lg:h-[320px]
            object-cover
            "
            loading="lazy"
          />

        </div>

      </div>

    </section>
  );
}






export  function OnlineSaleProducts() {
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const [cartPopup, setCartPopup] = useState(null);
    const [deal, setDeal] = useState([]);
    const [loading, setLoading] = useState(true)
   
  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        setLoading(true);
        const data = await getOnlineSaleProducts(); 
        console.log(data);
        setDeal(data);
      } catch (error) {
        console.error("Error fetching deal products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDealProducts();
  }, []);

  if (loading) {
    return (
      <Loader type="dealofday" count={5} />
    )
  }

  if (!deal) {
    return (
      <div className="text-center py-20 text-gray-500">
        No deals available.
      </div>
    );
  }

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


  return (
    <>
  <section className="bg-[#F8FAFC] py-10">
     
  <div className="max-w-7xl mx-auto px-4">
    {/* Section Header */}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#0F172A]"> Online Sale Products</h2>
    </div>

    {/* Product Grid */}
    <div className="max-w-7xl mx-auto grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5">
      {deal.map((product, i) => (
          <div
          key={i}
          className="bg-white border border-gray-200 rounded-sm hover:shadow-md hover:scale-[1.02] transition-all duration-150 cursor-pointer overflow-hidden group"
          >     
          {/* Image */}
          <div className="relative">
            <img
              src={product.image || "/images/motorola.png"}
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
             ৳{Number(product.price).toLocaleString()}
          </span>
        </div>
      </div>
         </div>
        
      ))}
      
    </div>
  </div>
  </section>


<CartPopup
  popup={cartPopup}
  onClose={() => setCartPopup(null)}
/>

</>
  );
}





