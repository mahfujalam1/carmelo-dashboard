import { ChevronDown } from "lucide-react";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "../../redux/features/order/order";

export default function OrderTable() {
  const { data, isLoading } = useGetOrdersQuery({
    order: "desc",
    sortBy: "createdAt",
    page: 1,
    limit: 10,
  });

  const [updateStatus] = useUpdateOrderStatusMutation();

  if (isLoading) return <p>Loading...</p>;

  const orders = data?.data?.orders || [];
  console.log(orders)

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-900 font-semibold">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">SL.NO</th>
            <th className="px-4 py-3 whitespace-nowrap">Order ID</th>
            <th className="px-4 py-3 whitespace-nowrap">User Email</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">
              Order Type
            </th>
            <th className="px-4 py-3 whitespace-nowrap text-center">
              Total Items
            </th>
            <th className="px-4 py-3 whitespace-nowrap text-center">
              Total Price
            </th>
            <th className="px-4 py-3 whitespace-nowrap text-center">Payment</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order._id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {order._id}
              </td>
              <td className="px-4 py-3">{order.user?.email}</td>
              <td className="px-4 py-3 text-center">{order.orderType}</td>
              <td className="px-4 py-3 text-center">{order.totalQuantity}</td>
              <td className="px-4 py-3 text-center">${order.total}</td>
              <td className="px-4 py-3 text-center capitalize">
                {order.paymentStatus}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="relative inline-block">
                  <select
                    defaultValue={order?.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="appearance-none bg-purple-50 border border-purple-200 text-purple-700 
                      text-sm rounded-md px-3 pr-8 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
