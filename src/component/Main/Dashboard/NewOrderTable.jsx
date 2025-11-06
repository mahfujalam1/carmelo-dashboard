import React from "react";
import { Button, Table, Tag } from "antd";
import { useGetNewOrderQuery } from "../../../redux/features/dashboard/dashboardApi";

const STATUS_STYLES = {
  Pending: "purple",
  Packing: "cyan",
  Processing: "orange",
  Shipping: "blue",
  Shipped: "green",
};

export default function NewOrdersTable() {
  const { data: newOrdersData } = useGetNewOrderQuery();
  const data = newOrdersData?.data || [];

  const currency = (v) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const columns = [
    {
      title: "Order No",
      dataIndex: "_id",
      key: "orderNo",
      render: (text) => `#${text}`,
    },
    {
      title: "User Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items?.length || 0,
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "total",
      key: "price",
      render: (price) => currency(price),
      align: "right",
    },
    {
      title: "Tnx Status",
      dataIndex: "transactionID",
      key: "transactionID",
      render: (text, record) =>
        record.paymentStatus
          ? record.paymentStatus === "unpaid"
            ? "unpaid"
            : "paid"
          : "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => {
        const currentStatus = record.status;
        return <Tag color={STATUS_STYLES[currentStatus]}>{currentStatus}</Tag>;
      },
      align: "center",
    },
  ];

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-base font-semibold">New Order</span>
        <Button type="link" className="text-sm text-gray-600">
          View all
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={false}
        className="border-t"
      />
    </div>
  );
}
