
export default function OrdersSkeletonTable() {
  return (
  <>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <tr
          key={item}
          className="animate-pulse border-b border-slate-100 last:border-b-0"
        >
          {/* Order ID */}
          <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </td>

          {/* Product */}
          <td className="px-5 sm:px-6 py-4">
            <div className="h-4 w-52 bg-slate-100 rounded"></div>
          </td>

          {/* Status */}
          <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
            <div className="h-7 w-24 bg-slate-200 rounded-full"></div>
          </td>

          {/* Date */}
          <td className="px-5 sm:px-6 py-4 hidden sm:table-cell whitespace-nowrap">
            <div className="h-4 w-24 bg-slate-100 rounded"></div>
          </td>

          {/* Amount */}
          <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
          </td>

          {/* Action */}
          <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-center">
            <div className="w-9 h-9 bg-slate-200 rounded-lg mx-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
