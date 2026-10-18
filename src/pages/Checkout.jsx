import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getCart, getTotalCartPrice } from "../cart/cartSlice";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/lebel";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { createOrder, getUserOrders } from "../services/api";
import { useDispatch } from "react-redux";
import { clearCart } from "../cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
//import { Navigate } from "react-router-dom";







export default function CheckoutPage() {
  const location = useLocation();
  const buyNowItem = location.state?.item;
  const navigate = useNavigate();
  const reduxCartItems = useSelector(getCart);
  const cartItems = buyNowItem ? [buyNowItem] : reduxCartItems;
  const subtotal = buyNowItem
  ? buyNowItem.unit_price * buyNowItem.quantity
  : useSelector(getTotalCartPrice);
  const dispatch = useDispatch();
  const [deliveryType, setDeliveryType] = useState("inside");
  const deliveryFee = deliveryType === "inside" ? 60 : 120;
  const total = subtotal + deliveryFee;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
     shipping_name: "",
     order_phone: "",
     shipping_address: "",
  });


  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleOrderSubmit = async () => {

   if (loading) return;

  if (cartItems.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Cart is Empty",
      text: "Please add product to cart first",
    });
    return;
  }

   if (!formData.shipping_name || !formData.order_phone || !formData.shipping_address) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      text: "Please fill all required fields",
    });
    return;
  }

   const phoneRegex = /^01[3-9]\d{8}$/;

  if (!phoneRegex.test(formData.order_phone)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone Number",
      text: "Please enter a valid Bangladeshi phone number",
    });
    return;
  }

  try {
      setLoading(true);

      Swal.fire({
      title: "Processing Order...",
      text: "Please wait while we place your order",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const data = new FormData();
    data.append("shipping_name", formData.shipping_name);
    data.append("order_phone", formData.order_phone);
    data.append("shipping_address", formData.shipping_address);
    data.append("product_qty", cartItems.reduce((sum, item) => sum + item.quantity, 0));
    data.append("total_amount", total); 
    data.append("shipping_cost", deliveryFee);
    data.append("shipping_method", deliveryType === "inside" ? 21 : 22);
    data.append("payment_method", 1);

     cartItems.forEach((product, index) => {
      data.append(`product_data[${index}][product_id]`, product.product_id || product.id);
      data.append(`product_data[${index}][unit_price]`, product.unit_price);
      data.append(`product_data[${index}][qty]`, product.quantity);
      data.append(`product_data[${index}][variation_color_id]`, product.color_name);
      data.append(`product_data[${index}][variation]`, product.variation_size);
      data.append(`product_data[${index}][size_id]`, product.size_id);
      data.append(`product_data[${index}][color_id]`, product.color_id);
     // data.append(`product_data[${index}][product_image]`, product.image);
      data.append(`product_data[${index}][product_image]`,product.image.split("/").pop());
      data.append(`product_data[${index}][product_name]`, product.product_name);
    });

    // 🔹 Debug: FormData entries check
    console.log("===== FormData Entries =====");
   for (let [key, value] of data.entries()) {
   console.log(key, value);
   }
    console.log("============================");

    const result = await createOrder(data);

     console.log("Order Result:", result);

if (result.success) {
  Swal.fire({
  icon: "success",
  title: "Order Placed 🎉",
  html: "Your order has been confirmed successfully.",
  confirmButtonColor: "#16a34a",
  width: "300px",
  padding: "1.2rem",
  customClass: {
    popup: "rounded-xl",
    title: "text-base font-semibold",
    htmlContainer: "text-sm text-gray-600",
    confirmButton: "text-sm px-5 py-2"
  }
}).then(async () => {
      if (!buyNowItem) {
      dispatch(clearCart());
    }
    try {
      // 🔥 fetch all orders again
      const res = await getUserOrders();

      const ordersArray = res?.data?.data || res?.data || [];

      // 🔥 latest order (newly created)
      const latestOrder = ordersArray[0]; 
      // (if API returns newest first)

      navigate("/thank-you", {
        state: {
          order: latestOrder
        }
      });

    } catch (err) {
      console.log(err);

      // fallback
      navigate("/thank-you", {
        state: { order: null }
      });
    }
  });



} else {
  Swal.fire({
    icon: "error",
    title: "Order Failed ❌",
    text: result.msg || "Order creation failed!",
  });
}

  } catch (error) {
     console.error("Error in createOrder:", error);
     Swal.fire({
      icon: "error",
      title: "Order Failed ❌",
      text: "Something went wrong. Please try again.",
      confirmButtonColor: "#dc2626",
    });
  }  finally {
    setLoading(false);
  }
};


  const hasCartItems = reduxCartItems.length > 0;
   const hasBuyNowItem = !!buyNowItem;


// 🔥 BLOCK ACCESS IF NOTHING EXISTS
if (!hasCartItems && !hasBuyNowItem) {
  return (
    <div className="text-center py-32">
      <h2 className="text-xl font-semibold">No checkout session found</h2>
      <p>Please add product to cart or use Buy Now</p>
    </div>
  );
}




  return (
   
  <div className="bg-gray-100 min-h-screen py-4 md:py-8 lg:py-16 px-3 sm:px-4 md:px-6">
    
    <div className="max-w-7xl mx-auto">
      
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
        
        {/* Main Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address */}
            <div className="bg-background p-4 sm:p-6 rounded-2xl border">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2 space-y-2">
                  <Label>Your Name</Label>
                  <Input
                    name="shipping_name"
                    value={formData.shipping_name}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Your Phone</Label>
                  <Input className="h-11"
                  name="order_phone"
                  value={formData.order_phone}
                  onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Your Address</Label>
                  <Input className="h-11"
                   name="shipping_address"
                   value={formData.shipping_address}
                   onChange={handleChange}
                  
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-background p-4 sm:p-6 rounded-2xl border">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Payment Method
              </h2>

              <RadioGroup 
              value={deliveryType}
              onValueChange={setDeliveryType}
              className="flex flex-col gap-4">
                
                <div className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition">
                  <RadioGroupItem value="inside" />
                  <Label className="font-normal cursor-pointer flex-1 text-sm sm:text-base">
                    Inside Dhaka - 60Tk
                  </Label>
                </div>

                <div className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition">
                  <RadioGroupItem value="outside" />
                  <Label className="font-normal cursor-pointer flex-1 text-sm sm:text-base">
                    Outside Dhaka - 120TK
                  </Label>
                </div>
              </RadioGroup>
            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="bg-[#F8FAFC] p-4 sm:p-6 rounded-2xl shadow-inner h-fit lg:sticky lg:top-24">

            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="flex flex-col gap-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((product) => (
                <div
                  key={product.product_slug}
                  className="flex items-start gap-3"
                >
                  <img
                    src={product.image || "/images/motorola.png"}
                    alt={product.product_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/motorola.png";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {product.product_name}
                    </p>

                    <p className="text-gray-500 text-xs sm:text-sm">
                      Qty: {product.quantity}
                    </p>
                    <div className="text-muted-foreground text-xs sm:text-sm mt-0.5 flex flex-wrap gap-2">
                      {product.variation_size && <span>Size: {product.variation_size}</span>}
                      {product.color_name && <span>Color: {product.color_name}</span>}
                     </div>
                    <p className="text-red-500 font-semibold text-sm sm:text-base">
                      ৳{(product.quantity * product.discount_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Fee */}
            <div className="flex justify-between text-sm sm:text-base mb-2">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-base sm:text-lg mb-4 border-t pt-3">
              <span>Total:</span>
              <span>৳{total.toFixed(2)}</span>
            </div>

              <Button
                 onClick={handleOrderSubmit}
                 disabled={loading}
                 className="w-full h-11 text-sm sm:text-base bg-black text-white hover:bg-gray-800"
               >
                 {loading ? "Processing..." : "Proceed to Pay"}
               </Button>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}


