import React, { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import { EditProductModal } from "../../ui/Modal/EditProductModal";
import ProductViewModal from "../../ui/Modal/ProductViewModal";

export default function ProductActions({
  onEdit,
  onDeleteConfirm,
  onView,
  data,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setUpdateModalOpen(true)}
        className="rounded p-1 hover:bg-gray-100"
        aria-label="Edit"
      >
        <Pencil className="h-5 w-5 text-gray-700" />
      </button>

      <button
        onClick={() => setConfirmOpen(true)}
        className="rounded p-1 text-red-600 hover:bg-red-50"
        aria-label="Delete"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <button
        onClick={()=> setOpen(true)}
        className="rounded p-1 hover:bg-gray-100"
        aria-label="View"
      >
        <Eye className="h-5 w-5 text-gray-700" />
      </button>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          onDeleteConfirm?.();
          setConfirmOpen(false);
        }}
        from="right"
        title="Delete product?"
        message="You want to delete this product."
        confirmText="Yes"
        cancelText="No"
      />

      {/* Edit modal */}
      <EditProductModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSave={(updated) => {
          onEdit?.(updated);
          setUpdateModalOpen(false);
        }}
        product={data}
      />

      <ProductViewModal
        open={open}
        onClose={() => setOpen(false)}
        product={data}
      />
    </>
  );
}
