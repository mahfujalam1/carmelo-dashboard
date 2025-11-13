import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useGetAllProductsQuery } from "../../redux/features/product/productApi";
import ProductCreateModal from "../../component/ui/Modal/ProductCreateModal";
import StatsBar from "../../component/Main/Crisis/StatsBar";
import ProductTable from "../../component/Main/Crisis/ProductTable";

export default function ProductsPage() {
  const { data, refetch } = useGetAllProductsQuery();
  const products = data?.data?.products || [];

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const onAdd = () => {
    setOpenCreateModal(true);
  };

  const closeModal = () => {
    setOpenCreateModal(false);
  };

  return (
    <div>
      <div className="flex">
        <button
          onClick={onAdd}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          Add Product <Plus className="h-4 w-4" />
        </button>
      </div>

      <StatsBar total={products.length} published={products.length} />

      <ProductTable rows={products} />

      {openCreateModal && (
        <ProductCreateModal onClose={closeModal} onSave={closeModal} />
      )}
    </div>
  );
}
