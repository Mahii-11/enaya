// OrderDetails.jsx

import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  User,
  Phone,
  MapPin,
  CalendarDays,
  Receipt,
  Printer,
} from "lucide-react";

import { getSingleOrder } from "../../services/api";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await getSingleOrder(id);

      if (res?.success) {
        setOrder(res.data);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error("Order fetch failed:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const currency = (amount) => `৳${Number(amount || 0).toLocaleString()}`;

  const subtotal = useMemo(() => {
    if (!order?.order_products) return 0;

    return order.order_products.reduce((sum, item) => {
      return sum + Number(item.unit_price) * Number(item.qty);
    }, 0);
  }, [order]);

  const shipping = Number(order?.shipping_cost || 0);
  const discount = Number(order?.discount_amount || 0);
  const advance = Number(order?.advance_amount || 0);

  const grandTotal = subtotal - discount - advance + shipping;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const printPage = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="max-w-7xl mx-auto animate-pulse space-y-5">
          <div className="h-12 bg-white rounded-2xl"></div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="h-52 bg-white rounded-2xl"></div>
            <div className="h-52 bg-white rounded-2xl"></div>
          </div>
          <div className="h-96 bg-white rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 ">
        <div className="bg-white shadow rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Order Not Found
          </h2>
          <p className="text-slate-500 mt-2">
            Requested order details could not be loaded.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex mt-5 bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-5 md:py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Order Details
              </h1>
              <p className="text-sm text-slate-500">
                Order ID: #{order.order_id}
              </p>
            </div>
          </div>

          <button
            onClick={printPage}
            className="text-xs md:text-sm  inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:opacity-90 "
          >
            <Printer size={18} />
            Print Invoice
          </button>
        </div>

        {/* Top Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Truck className="text-blue-600" size={20} />
              <h2 className="font-bold text-lg text-slate-800">
                Shipping Information
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <User size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-500">Name</p>
                  <p className="font-semibold text-slate-800">
                    {order?.order_address?.shipping_name ||
                      order?.user?.name ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-800">
                    {order?.order_address?.shipping_phone ||
                      order?.user?.phone ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-500">Address</p>
                  <p className="font-semibold text-slate-800">
                    {order?.order_address?.shipping_address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Receipt className="text-emerald-600" size={20} />
              <h2 className="font-bold text-lg text-slate-800">
                Order Information
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-slate-500">Date</p>
                <p className="font-semibold text-slate-800">
                  {formatDate(order.created_at)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Order ID</p>
                <p className="font-semibold text-slate-800">
                  #{order.order_id}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Shipping Method</p>
                <p className="font-semibold text-slate-800">
                  {order.shipping_method || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Payment</p>
                <p className="font-semibold text-slate-800">
                  {order.payment_method == 1
                    ? "Cash On Delivery"
                    : "Online Payment"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-semibold text-slate-800">
                  {order.order_status == 0 ? "Pending" : "Completed"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Items</p>
                <p className="font-semibold text-slate-800">
                  {order.product_qty}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-violet-600" />
              <h2 className="font-bold text-lg text-slate-800">
                Order Summary
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Variant</th>
                  <th className="px-6 py-4">Color / Size</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {order?.order_products?.map((item) => {
                  const total =
                    Number(item.unit_price) * Number(item.qty);

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-5 font-medium text-slate-800">
                        {item.product_name}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {item.variation &&
                        item.variation !== "null"
                          ? item.variation
                          : "N/A"}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {item.variation_color_id &&
                        item.variation_color_id !== "null"
                          ? item.variation_color_id
                          : "N/A"}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {currency(item.unit_price)}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {item.qty}
                      </td>

                      <td className="px-6 py-5 text-right font-semibold text-slate-800">
                        {currency(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation */}
          <div className="border-t bg-slate-50 p-6">
            <div className="max-w-sm ml-auto space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal :</span>
                <span className="font-semibold">
                  {currency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Discount(-) :</span>
                <span className="font-semibold">
                  {currency(discount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Advance(-) :</span>
                <span className="font-semibold">
                  {currency(advance)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Shipping :</span>
                <span className="font-semibold">
                  {currency(shipping)}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between text-base">
                <span className="font-bold text-slate-800">
                  Grand Total :
                </span>
                <span className="font-bold text-slate-900">
                  {currency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-lg text-slate-800 mb-4">
            Company Details
          </h2>

          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold">
                Phone Number:
              </span>{" "}
              09699800108, 01725897654
            </p>

            <p>
              <span className="font-semibold">
                Authorized Sign
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Company Name:
              </span>{" "}
              Digitech
            </p>

            <p>
              <span className="font-semibold">Address:</span>{" "}
              House - 27, Road - 09, South Bishil, Mirpur - 1,
              Dhaka - 1216
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}