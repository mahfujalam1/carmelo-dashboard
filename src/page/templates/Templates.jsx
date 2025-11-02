import React, { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import ConfirmModal from "../../component/ui/Modal/ConfirmModal";
import AddCategoryModal from "../../component/ui/Modal/AddCategoryModal";

export default function Templates() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]); // ✅ store all added categories

  // ✅ Add new category
  const handleSubmit = (data) => {
    setCategories((prev) => [
      ...prev,
      {
        id: data.id,
        logo: data.logo,
        price: data.price,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setOpen(false);
  };

  // ✅ Open delete confirmation
  const handleDelete = (id) => {
    setProductToDelete(id);
    setOpenDeleteModal(true);
  };

  // ✅ Confirm delete
  const handleConfirmDelete = () => {
    setCategories((prev) => prev.filter((item) => item.id !== productToDelete));
    setOpenDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="p-6">
      {/* Upload Template Button */}
      <div className="flex justify-end pb-3">
        <button
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Template
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full table-auto text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-sm text-gray-500">SN</th>
              <th className="py-3 px-5 text-sm text-gray-500">Image</th>
              <th className="py-3 px-5 text-sm text-gray-500">Price</th>
              <th className="py-3 px-5 text-sm text-gray-500">Date</th>
              <th className="py-3 px-5 text-sm text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No categories uploaded yet.
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-5 text-sm text-gray-700">
                    0{index + 1}
                  </td>
                  <td className="py-3 px-5">
                    <img
                      src={cat.logo}
                      alt="Category"
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </td>
                  <td className="py-3 px-5 text-sm text-gray-700">
                    ${cat.price}
                  </td>
                  <td className="py-3 px-5 text-sm text-gray-700">
                    {cat.date}
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
