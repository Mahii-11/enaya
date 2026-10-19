import { CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const formatPrice = (value) => `৳${Number(value || 0).toLocaleString("en-US")}`;

export default function ThankYouPage() {
  const location = useLocation();
  // /checkout API response-এর data: { id, invoice_no, total, thank_you_url, summary }
  const order = location?.state?.order;
  const summary = order?.summary;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-6 sm:p-8 text-center border border-gray-100 mb-44 sm:mb-14">

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
        {order?.invoice_no && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-lg font-semibold text-gray-800">#{order.invoice_no}</p>
          </div>
        )}

        {/* Order Summary */}
        {summary?.items?.length > 0 && (
          <div className="mt-6 text-left">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Order Summary</h2>
            <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
              {summary.items.map((item, index) => (
                <li key={`${item.product_id}-${item.size_id}-${item.color_id}-${index}`} className="flex gap-3 p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 rounded-md object-cover bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    {(item.size_name || item.color_name) && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {[
                          item.size_name && `Size: ${item.size_name}`,
                          item.color_name && `Color: ${item.color_name}`,
                        ]
                          .filter(Boolean)
                          .join(" | ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{formatPrice(item.line_total)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <dt>Subtotal</dt>
                <dd>{formatPrice(summary.subtotal)}</dd>
              </div>
              {summary.coupon_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Coupon{summary.coupon_code ? ` (${summary.coupon_code})` : ""}</dt>
                  <dd>-{formatPrice(summary.coupon_discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <dt>Delivery{summary.shipping_method?.name ? ` (${summary.shipping_method.name})` : ""}</dt>
                <dd>{formatPrice(summary.shipping_fee)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold text-gray-900">
                <dt>Total</dt>
                <dd>{formatPrice(summary.total ?? order.total)}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Info */}
        <p className="text-sm text-gray-500 mt-6">
          You will receive a confirmation call soon. Please keep your phone
          available.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            to="/"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>

          {order?.thank_you_url && (
            <a
              href={order.thank_you_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              View Order
            </a>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          Need help? Contact our support team anytime.
        </p>

      </div>
    </div>
  );
}
