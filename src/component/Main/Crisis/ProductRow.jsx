import React from "react";
import ProductActions from "./ProductAction";

export default function ProductRow({ item, onEdit, onDelete, onView }) {
  const money = (v) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

    console.log(item)

  return (
    <tr className="hover:bg-gray-50/60">
      <td className="px-4 py-3 text-gray-800 font-medium">{item.id}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-gray-200/70 px-2 py-1">
            {item.images.slice(0, 3).map((src, i) => (
              <img
                key={i}
                src={src}
                className="h-10 w-10 rounded object-cover"
                alt=""
              />
            ))}
          </div>
          <span className="text-gray-700">{item.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">{item.category}</td>
      <td className="px-4 py-3">{item.type}</td>
      <td className="px-4 py-3 tabular-nums">{money(item.price)}</td>
      <td className="px-4 py-3">
        <div className="flex justify-end">
          <ProductActions
          data={item}
            onEdit={() => onEdit?.(item)}
            onDeleteConfirm={() => onDelete?.(item)}
            onView={() => onView?.(item)}
          />
        </div>
      </td>
    </tr>
  );
}
