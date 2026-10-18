import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ThankYouPage() {
  const location = useLocation();
  const order = location?.state?.order;
  const orderId = order?.id;
  const orderNum = order?.order_id;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100 mb-44 sm:mb-14">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={50} className="text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Thank You for Your Order!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mt-3">
          Your order has been successfully placed. Our team will contact you
          shortly to confirm the order details.
        </p>

        {/* Order Number */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-lg font-semibold text-gray-800">#{orderNum}</p>
        </div>

        {/* Info */}
        <p className="text-sm text-gray-500 mt-6">
          You will receive a confirmation call soon. Please keep your phone
          available.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center mt-8">
          <Link
            to="/"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>

          <Link
             to={`/order-details/${orderId}`}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            View Orders
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          Need help? Contact our support team anytime.
        </p>

      </div>
    </div>
  );
}