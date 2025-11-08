// src/pages/NewsTable.jsx
import { useState, useMemo } from "react";
import { Table, Button, Popconfirm } from "antd";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import {
  useDeleteNewsMutation,
  useGetAllNewsQuery,
} from "../../redux/features/news/news";
import NewsViewModal from "../../component/ui/Modal/NewsViewModal";
import UpdateNewsModal from "../../component/ui/Modal/news/UpdateNewsModal";
import CreateNewsModal from "../../component/ui/Modal/news/CreateNewsModal";

export default function NewsTable() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const {
    data: newsData = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAllNewsQuery();
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation();

  const rows = (newsData?.data ?? []).map(
    ({ _id, title, headerImage, reads }) => ({
      id: _id,
      name: title,
      image: headerImage,
      reads: reads ?? 0,
    })
  );

  const busy = isLoading || isFetching || isDeleting;

  const handleConfirmDelete = async (id) => {
    try {
      await deleteNews(id).unwrap();
      await refetch();
    } catch (e) {
      console.error(e);
    }
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
      render: (src) =>
        src ? (
          <img
            src={src}
            alt="news"
            className="w-28 h-16 object-cover rounded-md border"
          />
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              setEditId(record.id);
              setOpenEdit(true);
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <Popconfirm
            title="Are you sure you want to delete?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true, loading: isDeleting }}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleConfirmDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
          >
            <Button
              danger
              disabled={isDeleting}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Popconfirm>

          <Button
            type="text"
            className="text-gray-600 hover:text-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              setViewItem(record);
              setOpenView(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-end justify-end mb-4">
        <Button
          className="bg-black text-white"
          icon={<Plus size={16} />}
          onClick={() => setOpenCreate(true)}
          disabled={busy}
        >
          Create new News
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={busy}
        onRow={(record) => ({
          onClick: () => {
            setEditId(record.id);
            setOpenEdit(true);
          },
        })}
      />

      {/* Create Modal */}
      <CreateNewsModal
        open={openCreate}
        onClose={async () => {
          setOpenCreate(false);
          await refetch();
        }}
      />

      {/* Update Modal */}
      <UpdateNewsModal
        open={openEdit}
        id={editId}
        onClose={async () => {
          setOpenEdit(false);
          setEditId(null);
          await refetch();
        }}
      />

      {/* View Modal */}
      <NewsViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        item={viewItem}
      />
    </div>
  );
}
