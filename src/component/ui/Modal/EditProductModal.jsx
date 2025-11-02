import ProductModal from "./AddProductModal";

export function EditProductModal({ open, onClose, onSave, product }) {
  if (!open) return null;

  return (
    <ProductModal
      mode="edit"
      onClose={onClose}
      onSave={onSave}
      initialData={product}
    />
  );
}
