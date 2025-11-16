import { Table, Select, Tag, Empty, Button } from "antd";
import { FileText } from "lucide-react";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../redux/features/order/order";

const STATUS_STYLES = {
  processing: "orange",
  shipped: "blue",
  completed: "green",
};

const PAYMENT_STYLES = {
  paid: "success",
  pending: "warning",
  failed: "error",
  unpaid: "default",
};

export default function OrderTable() {
  const { data, isLoading } = useGetOrdersQuery({
    order: "desc",
    sortBy: "createdAt",
    page: 1,
    limit: 10,
  });

  const [updateStatus] = useUpdateOrderStatusMutation();

  const orders = data?.data?.orders || [];

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const currency = (v) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const columns = [
    {
      title: "SL.NO",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => `#${id}`,
    },
    {
      title: "User Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Order Type",
      dataIndex: "orderType",
      key: "orderType",
      render: (type) => <span className="capitalize">{type}</span>,
      align: "center",
    },
    {
      title: "Total Items",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center",
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      render: (price) => currency(price),
      align: "right",
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={PAYMENT_STYLES[status]} className="capitalize">
          {status}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
          style={{ width: 130 }}
          size="small"
        >
          <Select.Option value="processing">
            <Tag color="orange">Processing</Tag>
          </Select.Option>
          <Select.Option value="shipped">
            <Tag color="blue">Shipped</Tag>
          </Select.Option>
          <Select.Option value="completed">
            <Tag color="green">Completed</Tag>
          </Select.Option>
        </Select>
      ),
      align: "center",
    },
  ];

  // Custom empty state
  const customEmpty = (
    <Empty
      image={
        <div className="flex justify-center mb-3">
          <FileText className="w-16 h-16 text-gray-300" />
        </div>
      }
      description={
        <div className="text-gray-500">
          <p className="text-lg font-semibold">No Orders Found</p>
        </div>
      }
    />
  );

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-base font-semibold">All Orders</span>
        
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} orders`,
        }}
        locale={{ emptyText: customEmpty }}
        scroll={{ x: 1200 }}
        className="border-t"
      />
    </div>
  );
}
