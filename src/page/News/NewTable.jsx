import { useState, useMemo } from "react";
import { Table, Input, Button } from "antd";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import ConfirmModal from "../../component/ui/Modal/ConfirmModal";
import NewsViewModal from "../../component/ui/Modal/NewsViewModal";
import NewsModal from "../../component/ui/Modal/NewsModal";

export default function NewsTable() {
  const [openModal, setOpenModal] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Filter logic for search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  // ✅ Create or update news
  const handleSave = (values) => {
    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...values } : item
        )
      );
    } else {
      const newNews = {
        id: "#" + Math.floor(Math.random() * 100000),
        ...values,
      };
      setData((prev) => [...prev, newNews]);
    }
    setOpenModal(false);
    setEditingItem(null);
  };

  // ✅ Open delete confirmation
  const handleDelete = (record) => {
    setItemToDelete(record.id);
    setOpenDeleteModal(true);
  };

  // ✅ Confirm delete action
  const handleConfirmDelete = () => {
    setData((prev) => prev.filter((item) => item.id !== itemToDelete));
    setOpenDeleteModal(false);
    setItemToDelete(null);
  };

  const columns = [
    {
      title: "News no.",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src) => (
        <img
          src={src}
          alt="news"
          className="w-28 h-16 object-cover rounded-md border"
        />
      ),
    },
    {
      title: "News Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingItem(record);
              setOpenModal(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setViewItem(record);
              setOpenView(true);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Input.Search
          placeholder="Search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
          allowClear
        />
        <Button
          className="bg-black text-white"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingItem(null);
            setOpenModal(true);
          }}
        >
          Create new News
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Create / Edit Modal */}
      <NewsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        editingItem={editingItem}
      />

      {/* View Modal */}
      <NewsViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        item={viewItem}
      />

      {/* ✅ Confirm Delete Modal */}
      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete News"
        message="Are you sure you want to delete this news?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
