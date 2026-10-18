  import {
  ShoppingBag,
  Clock,
 // Heart,
  MessageSquare,
  Package,
  CheckCircle2,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { getUserOrders } from "../../services/api";
import { useEffect, useState } from "react";
import OrdersSkeleton from "./OrdersSkeleton";

const baseURL = "https://backend.gadgetglobe.com.bd/";

export default function Overview({ user, setActiveTab }) {
  const [allOrders, setAllOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders();

        if (res?.data) {
          const formattedOrders = res.data.map((item) => ({
            id: `#ORD-${item.order_id}`,
            product:
              item.order_products?.[0]?.product_name ||
              "No Product Found",
            status: getOrderStatus(item.order_status),
            date: formatDate(item.created_at),
            amount: `৳${Number(item.total_amount).toLocaleString()}`,
          }));

          setRecentOrders(formattedOrders.slice(0, 5)); // recent 5 orders

          // ✅ TOP CARDS DATA
          const delivered = formattedOrders.filter(
            (x) => x.status === "Delivered"
          ).length;

          const pending = formattedOrders.filter(
            (x) => x.status === "Pending"
          ).length;

          const processing = formattedOrders.filter(
            (x) => x.status === "Processing"
          ).length;

          setAllOrders([
            {
              title: "Total Orders",
              value: formattedOrders.length,
              icon: ShoppingBag,
              color: "bg-blue-100 text-blue-700",
            },
            {
              title: "Pending",
              value: pending,
              icon: Clock,
              color: "bg-orange-100 text-orange-700",
            },
            {
              title: "Delivered",
              value: delivered,
              icon: CheckCircle2,
              color: "bg-green-100 text-green-700",
            },
            {
              title: "Processing",
              value: processing,
              icon: Package,
              color: "bg-purple-100 text-purple-700",
            },
          ]);
        }
      } catch (error) {
        console.error("Order fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ BACKEND STATUS MAP
  function getOrderStatus(status) {
    switch (Number(status)) {
      case 0:
        return "Pending";
      case 1:
        return "Processing";
      case 2:
        return "Shipped";
      case 3:
        return "Delivered";
      default:
        return "Pending";
    }
  }

  // ✅ DATE FORMAT
  function formatDate(dateString) {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // ✅ STATUS UI
  const statusConfig = {
    Delivered: {
      color: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    },
    Processing: {
      color: "bg-blue-100 text-blue-700",
      icon: Package,
    },
    Shipped: {
      color: "bg-purple-100 text-purple-700",
      icon: Package,
    },
    Pending: {
      color: "bg-orange-100 text-orange-700",
      icon: Clock,
    },
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status];

    if (!config) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          {status}
        </span>
      );
    }

    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-max ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here is what's happening with your store today.
          </p>
        </div>

        <button className="bg-[#5B3DF5] hover:bg-[#4A2EE0] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-[#5B3DF5]/20 transition-all active:scale-95 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {allOrders.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl sm:rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {stat.value}
                </h3>
              </div>

              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Orders
            </h2>

            <button
              onClick={() => setActiveTab("orders")}
              className="text-[#5B3DF5] hover:text-[#4A2EE0] text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 sm:px-6 py-4">Order ID</th>
                  <th className="px-5 sm:px-6 py-4">Product</th>
                  <th className="px-5 sm:px-6 py-4">Status</th>
                  <th className="px-5 sm:px-6 py-4 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-5 sm:px-6 py-4 text-right">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                 <OrdersSkeleton />
                ) : (
                  recentOrders.map((order, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-5 sm:px-6 py-4 text-sm font-medium">
                        {order.id}
                      </td>

                      <td className="px-5 sm:px-6 py-4 text-sm text-slate-600 max-w-[220px] truncate">
                        {order.product}
                      </td>

                      <td className="px-5 sm:px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="px-5 sm:px-6 py-4 hidden sm:table-cell text-sm text-slate-500">
                        {order.date}
                      </td>

                      <td className="px-5 sm:px-6 py-4 text-right text-sm font-semibold">
                        {order.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full relative overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#5B3DF5] to-[#8C75F7]"></div>

          <div className="p-6 pt-0 flex-1 flex flex-col relative">
            <img
              src={user?.image ? baseURL + user.image : "/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white shadow-sm object-cover absolute -top-10 left-6 bg-white"
              data-testid="img-avatar-profile"
            />

            <div className="mt-12 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900" data-testid="text-profile-name">
                  {user?.name || "Guest"}
                </h2>
                <p className="text-slate-500 text-sm">Member since 2022</p>
              </div>

              <button
                onClick={() => setActiveTab("profile")}
                className="text-slate-400 hover:text-[#5B3DF5] transition-colors p-2 hover:bg-[#5B3DF5]/10 rounded-full cursor-pointer"
                data-testid="button-profile-settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="text-sm text-slate-800" data-testid="text-profile-email">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                  <LifeBuoy className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="text-sm text-slate-800" data-testid="text-profile-phone">
                    {user?.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Package className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium">Default Address</p>
                  <p className="text-sm text-slate-800 whitespace-pre-line" data-testid="text-profile-address">
                    {user?.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={() => setActiveTab("profile")}
                className="block w-full text-center py-2.5 px-4 border border-[#5B3DF5]/20 text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white rounded-lg text-sm font-medium transition-all focus:ring-4 focus:ring-[#5B3DF5]/10 cursor-pointer"
                data-testid="button-edit-profile"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}