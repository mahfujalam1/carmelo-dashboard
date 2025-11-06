"use client";
import React, { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { Popconfirm, Button } from "antd";
import AddCategoryModal from "../../component/ui/Modal/AddCategoryModal";
import { useDeleteTemplateMutation, useGetAllTemplatesQuery } from "../../redux/features/template/templates";

export default function Templates() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetAllTemplatesQuery();
  const [deleteTemplate, { isLoading: isDeleting }] =
    useDeleteTemplateMutation();

  const templates = data?.data?.templates || [];

  const handleConfirmDelete = async (id) => {
    try {
      console.log({id})
      const result = await deleteTemplate(id).unwrap();
      console.log(result)
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };


  return (
    <div className="p-6">
      {/* Upload Button */}
      <div className="flex justify-end pb-3">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Template
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-gray-600 font-semibold">SN</th>
              <th className="py-3 px-5 text-gray-600 font-semibold">Image</th>
              <th className="py-3 px-5 text-gray-600 font-semibold">Title</th>
              <th className="py-3 px-5 text-gray-600 font-semibold">Price</th>
              <th className="py-3 px-5 text-gray-600 font-semibold">Date</th>
              <th className="py-3 px-5 text-gray-600 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No templates available.
                </td>
              </tr>
            ) : (
              templates.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-5">{index + 1}</td>
                  <td className="py-3 px-5">
                    <img
                      src={item.image}
                      alt="Template"
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </td>
                  <td className="py-3 px-5">{item.title}</td>
                  <td className="py-3 px-5">${item.price}</td>
                  <td className="py-3 px-5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-5">
                    <Popconfirm
                      title="Are you sure you want to delete?"
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true, loading: isDeleting }}
                      onConfirm={() => handleConfirmDelete(item._id)}
                    >
                      <Button danger disabled={isDeleting}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Popconfirm>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Template Modal */}
      <AddCategoryModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
