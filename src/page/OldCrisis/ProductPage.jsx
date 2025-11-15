import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input, Pagination, Select } from "antd";
import { useGetAllProductsQuery } from "../../redux/features/product/productApi";
import { useGetCategoriesQuery } from "../../redux/features/categories/categories";
import ProductCreateModal from "../../component/ui/Modal/ProductCreateModal";
import StatsBar from "../../component/Main/Crisis/StatsBar";
import ProductTable from "../../component/Main/Crisis/ProductTable";

export default function ProductsPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Filters + Pagination
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch categories
  const { data: catData } = useGetCategoriesQuery();
  const categories = catData?.data || [];

  // Fetch products with all params
  const { data, isLoading } = useGetAllProductsQuery({
    category,
    query,
    page,
    limit,
  });

  const products = data?.data?.products || [];
  const total = data?.data?.total || 0;

  const onAdd = () => setOpenCreateModal(true);
  const closeModal = () => {
    setOpenCreateModal(false);
    refetch();
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      refetch();
    }, 400);

    return () => clearTimeout(delay);
  }, [query, category]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center gap-4">
        <Select
          className="w-60"
          placeholder="Filter by category"
          allowClear
          value={category || undefined}
          onChange={(value) => {
            setCategory(value || "");
          }}
          options={categories.map((c) => ({
            value: c.name,
            label: c.name,
          }))}
        />

        <Input
          placeholder="Search products..."
          className="w-80"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          allowClear
        />

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          Add Product <Plus className="h-4 w-4" />
        </button>
      </div>

      <StatsBar total={products.length} published={products.length} />

      <ProductTable rows={products} loading={isLoading} />

      <div className="flex justify-center py-4">
        <Pagination
          current={page}
          total={total}
          pageSize={limit}
          onChange={(num) => {
            setPage(num);
            refetch();
          }}
        />
      </div>

      {openCreateModal && (
        <ProductCreateModal onClose={closeModal} onSave={closeModal} />
      )}
    </div>
  );
}
