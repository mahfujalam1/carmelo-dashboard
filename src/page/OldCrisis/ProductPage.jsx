import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import SearchInput from "../../component/ui/Modal/SearchInput";
import Select from "../../component/ui/Modal/Select";
import StatsBar from "../../component/Main/Crisis/StatsBar";
import ProductTable from "../../component/Main/Crisis/ProductTable";
import ProductModal from "../../component/ui/Modal/AddProductModal";

export default function ProductsPage() {
   const seed = useMemo(
     () =>
       Array.from({ length: 8 }).map((_, i) => ({
         id: `#${12300 + i}`,
         name: "Cucumber",
         category: "T–Shirts",
         type: "T–Shirts",
         price: 15,
         images: [
           "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=256&q=60&auto=format&fit=crop",
           "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=256&q=60&auto=format&fit=crop",
           "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=256&q=60&auto=format&fit=crop",
         ],
       })),
     []
   );

   const [rows, setRows] = useState(seed);
   const [q, setQ] = useState("");
   const [cat, setCat] = useState("");
   const [openModal, setOpenModal] = useState(false);

   const categories = [{ value: "T–Shirts", label: "T–Shirts" }];

   const filtered = rows.filter((r) => {
     const byQ = q
       ? (r.name + r.category + r.id).toLowerCase().includes(q.toLowerCase())
       : true;
     const byCat = cat ? r.category === cat : true;
     return byQ && byCat;
   });

   const onAdd = () => setOpenModal(true);
   const onEdit = (row) => alert("Edit: " + row.name);
   const onDelete = (row) => setRows((prev) => prev.filter((p) => p !== row));
   const onView = (row) => alert("View: " + row.name);

   const handleAddProduct = (newProduct) => {
     setRows((prev) => [...prev, newProduct]);
     setOpenModal(false);
   };

  return (
    <div>
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,1fr),minmax(0,320px),auto]">
        <SearchInput value={q} onChange={setQ} />
        <Select
          value={cat}
          onChange={setCat}
          options={categories}
          placeholder="Category"
        />
        <button
          onClick={onAdd}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          Add Product <Plus className="h-4 w-4" />
        </button>
      </div>

      <StatsBar total={rows.length} published={16} />

      <ProductTable
        rows={filtered}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />

      {openModal && (
        <ProductModal
          onClose={() => setOpenModal(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  );
}
