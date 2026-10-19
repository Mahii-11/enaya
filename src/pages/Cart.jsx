import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { decreaseItemQuantity, deleteItem, getCart, getTotalCartPrice, increaseItemQuantity } from "../cart/cartSlice";

export default function Cart() {
  const cartItems = useSelector(getCart);
  const dispatch = useDispatch();
  const subtotal = useSelector(getTotalCartPrice);
  

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center  mt-5 lg:mt-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Trash2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/">
          <Button  size="lg" className="rounded-full bg-black hover:bg-black/90 px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 py-2 sm:py-6 md:py-8 lg:py-12">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold font-display mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
             {cartItems.map((item) => (
                <div
                key={`${item.slug}-${item.variant_id}`}
               className="bg-white p-4 sm:p-5 md:p-6 rounded-xl border flex  flex-row gap-4 items-start sm:items-center transition-shadow hover:shadow-lg"
                >
               {/* Image */}
               <div className="w-24 h-24 sm:w-24 md:w-28 lg:w-32  sm:h-24 md:h-28 lg:h-32 bg-muted/20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                       src={item.image || "/images/motorola.png"}
                       alt={item.name}
                       className="w-full h-full object-cover"
                       onError={(e) => {
                       e.target.onerror = null;
                       e.target.src = "/images/motorola.png";
                      }}
                      />
                      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link to={`/product-details/${item.slug}`}>
          <h3 className="font-semibold hover:text-red-600 transition-colors line-clamp-2 text-sm sm:text-base md:text-lg">
            {item.name}
          </h3>
        </Link>
        {(item.size_name || item.color_name) && (
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            {[
              item.size_name && `Size: ${item.size_name}`,
              item.color_name && `Color: ${item.color_name}`,
            ]
              .filter(Boolean)
              .join(" | ")}
          </p>
        )}
        <p className="text-muted-foreground text-sm sm:text-base mt-1 font-medium">
          ৳{item.totalPrice}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
        {/* Quantity */}
        <div className="flex items-center border rounded-lg bg-background overflow-hidden">
          <button
            onClick={() => dispatch(decreaseItemQuantity({ slug: item.slug, variant_id: item.variant_id }))}
            className="p-2 hover:bg-muted transition-colors rounded-l-lg"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => dispatch(increaseItemQuantity({ slug: item.slug, variant_id: item.variant_id }))}
            className="p-2 hover:bg-muted transition-colors rounded-r-lg"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Delete */}
        <Button
          onClick={() => dispatch(deleteItem({ slug: item.slug, variant_id: item.variant_id }))}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl border p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                
              </div>

              <Link to="/checkout">
                <Button className="w-full rounded-full bg-black text-white hover:bg-gray-800" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}