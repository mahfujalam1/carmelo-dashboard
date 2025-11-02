import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import CategoryTable from "../../component/Main/category/CategoryTable";
import CategoryModal from "../../component/ui/Modal/CategoryModal";
import ConfirmModal from "../../component/ui/Modal/ConfirmModal";
import CategoryForm from "../../component/Main/category/CategoryForm";
import { RxDropdownMenu } from "react-icons/rx";

export default function CategoryPage() {
  // demo rows (API থেকে আনলে replace করুন)
  const seed = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        name: "Foods",
        imageUrl:
          "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=256&q=60&auto=format&fit=crop",
      })),
    []
  );

  const [rows, setRows] = useState(seed);
  const [addingOpen, setAddingOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row | null
  const [confirm, setConfirm] = useState({ open: false, row: null });

  // CRUD helpers (এখানে API কল হুক করতে পারেন)
  const upsertRow = (payload, id = null) => {
    if (id) {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...payload } : r))
      );
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
  };
  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="w-56 pb-5">
          <label className="relative flex">
            <select className="w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm cursor-pointer">
              <option>Category</option>
              <option>Foods</option>
              <option>Drinks</option>
            </select>
            <div className="absolute right-3 top-3 cursor-pointer">
              <RxDropdownMenu />
            </div>
          </label>
        </div>

        <button
          onClick={() => setAddingOpen(true)}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          <span>Add Category</span>
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Table (props দিয়ে actions পাঠানো হচ্ছে) */}
      <CategoryTable
        rows={rows}
        onEdit={(row) => setEditing(row)}
        onDelete={(row) => setConfirm({ open: true, row })}
      />

      {/* Add Modal */}
      <CategoryModal
        open={addingOpen}
        onClose={() => setAddingOpen(false)}
        title="Add Categories"
      >
        <CategoryForm
          initial={{ name: "", imageUrl: "" }}
          submitText="Submit"
          onSubmit={(payload) => {
            upsertRow(payload, null);
            setAddingOpen(false);
          }}
        />
      </CategoryModal>

      {/* Edit Modal */}
      <CategoryModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Categories"
        size="max-w-xl"
      >
        {editing && (
          <CategoryForm
            initial={{ name: editing.name, imageUrl: editing.imageUrl }}
            submitText="Submit"
            onSubmit={(payload) => {
              upsertRow(payload, editing.id);
              setEditing(null);
            }}
          />
        )}
      </CategoryModal>

      {/* Delete Confirm (reusable) */}
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, row: null })}
        onConfirm={() => {
          if (confirm.row) removeRow(confirm.row.id);
          setConfirm({ open: false, row: null });
        }}
        title="Are you sure?"
        message="You want to delete this Content"
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
}
