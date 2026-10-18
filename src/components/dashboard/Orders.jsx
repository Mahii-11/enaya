import { useEffect, useState } from "react";
import {
  Eye,
  CheckCircle2,
  Package,
  Clock,
  ChevronDown,
  XCircle,
  PauseCircle,
  RotateCcw,
} from "lucide-react";
import { getUserOrders } from "../../services/api"; 
import OrdersSkeletonTable from "./OrdersSkeletonTable";
import { Link } from "react-router-dom";

export default function Orders() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("0");

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await getUserOrders();

    //  console.log("ORDER API RESPONSE:", res);

      const ordersArray = res?.data?.data || res?.data || [];

      if (Array.isArray(ordersArray)) {
        const formattedOrders = ordersArray.map((item) => ({
          id: item.id,
          orderNo: `#ORD-${item.order_id}`,
          product:
            item.order_products?.[0]?.product_name ||
            "No Product Found",
          status: getOrderStatus(item.order_status),
          rawStatus: String(item.order_status),
          date: formatDate(item.created_at),
          amount: `৳${Number(item.total_amount).toLocaleString()}`,
        }));

        setAllOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } else {
        setAllOrders([]);
      }
    } catch (error) {
      console.error("Order fetch failed:", error);
      setAllOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

 useEffect(() => {
    if (status === "all") {
      setFilteredOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        (item) => item.rawStatus === status
      );
      setFilteredOrders(filtered);
    }
  }, [status, allOrders]);




  function getOrderStatus(status) {
    switch (Number(status)) {
      case 0:
        return "Pending";
      case 1:
        return "Processing";
      case 2:
        return "Courier";
      case 3:
        return "Completed";
      case 4:
        return "Cancelled";
      case 5:
        return "On Hold";
      case 6:
        return "Return";
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

  // ✅ STATUS BADGES
 
  const statusConfig = {
    Completed: {
      color: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    },
    Processing: {
      color: "bg-blue-100 text-blue-700",
      icon: Package,
    },
    Courier: {
      color: "bg-purple-100 text-purple-700",
      icon: Package,
    },
    Pending: {
      color: "bg-orange-100 text-orange-700",
      icon: Clock,
    },
    Cancelled: {
      color: "bg-red-100 text-red-700",
      icon: XCircle,
    },
    "On Hold": {
      color: "bg-yellow-100 text-yellow-700",
      icon: PauseCircle,
    },
    Return: {
      color: "bg-pink-100 text-pink-700",
      icon: RotateCcw,
    },
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    const Icon = config?.icon || Clock;

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-max ${
          config?.color || "bg-gray-100 text-gray-700"
        }`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };


   const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "0", label: "Pending" },
    { value: "1", label: "Processing" },
    { value: "2", label: "Courier" },
    { value: "3", label: "Completed" },
    { value: "4", label: "Cancelled" },
    { value: "5", label: "On Hold" },
    { value: "6", label: "Return" },
  ];

   


  

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Your Orders
          </h1>
          <p className="text-slate-500 mt-1">
            Track and manage all your orders in one place.
          </p>
        </div>

      <div className="relative self-start sm:self-auto">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="appearance-none bg-[#5B3DF5] hover:bg-[#4A2EE0] text-white px-4 py-2.5 pr-10 rounded-lg text-sm font-medium shadow-sm shadow-[#5B3DF5]/20 transition-all active:scale-95 cursor-pointer outline-none"
      >
        {statusOptions.map((item) => (
          <option
            key={item.value}
            value={item.value}
            className="text-black bg-white"
          >
            {item.label}
          </option>
        ))}
      </select>

      <ChevronDown className="w-4 h-4 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>









      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 sm:px-6 py-4 font-semibold">
                  Order ID
                </th>
                <th className="px-5 sm:px-6 py-4 font-semibold">
                  Product
                </th>
                <th className="px-5 sm:px-6 py-4 font-semibold">
                  Status
                </th>
                <th className="px-5 sm:px-6 py-4 font-semibold hidden sm:table-cell">
                  Date
                </th>
                <th className="px-5 sm:px-6 py-4 font-semibold">
                  Amount
                </th>
                <th className="px-5 sm:px-6 py-4 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
               <OrdersSkeletonTable />
              ) : allOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-slate-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {order.orderNo}
                    </td>

                    <td className="px-5 sm:px-6 py-4 text-sm text-slate-600 max-w-[220px] truncate">
                      {order.product}
                    </td>

                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">
                      {order.date}
                    </td>

                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                      {order.amount}
                    </td>

                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-center">
                      <Link to={`/order-details/${order.id}`}>
                        <button className="text-[#5B3DF5] hover:bg-[#5B3DF5]/10 p-2 rounded-lg transition-colors inline-flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}