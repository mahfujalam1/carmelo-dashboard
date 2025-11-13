import React from "react";
import ProductRow from "./ProductRow";

export default function ProductTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 font-semibold">Image</th>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows?.map((r) => (
            <ProductRow key={r?._id} item={r} />
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
