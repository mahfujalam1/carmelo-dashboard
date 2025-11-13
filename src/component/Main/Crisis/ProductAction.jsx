import React, { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Popconfirm } from "antd";
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../../../redux/features/product/productApi";
import ProductEditModal from "../../ui/Modal/ProductEditModal";
import ProductViewModal from "../../ui/Modal/ProductViewModal";

export default function ProductActions({ product }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteProduct(product._id).unwrap();
      // Optionally, you can refetch the list or update UI after deletion
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Open Edit Modal
  const openEditModal = () => {
    setEditModalOpen(true);
  };

  // Open View Modal
  const openViewModal = () => {
    setViewModalOpen(true);
  };

  // Handle product update in Edit Modal
  const handleEditProduct = async (updatedProduct) => {
    try {
      await updateProduct({
        id: product._id,
        updatedData: updatedProduct,
      }).unwrap();
      setEditModalOpen(false); // Close modal after update
      console.log("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <button
        onClick={openEditModal} // Open Edit Modal
        className="rounded p-1 hover:bg-gray-100"
        aria-label="Edit"
      >
        <Pencil className="h-5 w-5 text-gray-700" />
      </button>

      <Popconfirm
        title="Are you sure you want to delete this product?"
        onConfirm={handleDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        okType="danger"
        placement="topRight"
      >
        <button
          className="rounded p-1 text-red-600 hover:bg-red-50"
          aria-label="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </Popconfirm>

      <button
        onClick={openViewModal} // Open View Modal
        className="rounded p-1 hover:bg-gray-100"
        aria-label="View"
      >
        <Eye className="h-5 w-5 text-gray-700" />
      </button>

      {/* Product Edit Modal */}
      {editModalOpen && (
        <ProductEditModal
          open={editModalOpen} // Modal open state for editing
          onClose={() => setEditModalOpen(false)} // Close edit modal
          onSave={handleEditProduct} // Pass the update handler
          initialData={product} // Pass the product data to the modal
        />
      )}

      {/* Product View Modal */}
      {viewModalOpen && (
        <ProductViewModal
          open={viewModalOpen} // Modal open state for viewing
          onClose={() => setViewModalOpen(false)} // Close view modal
          product={product} // Pass the product data to the modal
        />
      )}
    </>
  );
}
