import React from "react";
import { Pencil, Trash2 } from "lucide-react";

/** Pure table component. Parent handles actions via props */
export default function CategoryTable({ rows = [], onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 font-medium">S.No</th>
            <th className="px-4 py-3 font-medium">Category Image</th>
            <th className="px-4 py-3 font-medium">Category Name</th>
            <th className="px-4 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, idx) => (
            <tr key={r.id} className="hover:bg-gray-50/50">
              <td className="px-4 py-3">{idx + 1}</td>
              <td className="px-4 py-3">
                <img
                  src={r?.image}
                  alt={r.name}
                  className="h-10 w-10 object-cover  "
                />
              </td>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onEdit?.(r)}
                    className="rounded p-1 text-gray-700 hover:bg-gray-100"
                    aria-label="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete?.(r)}
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
