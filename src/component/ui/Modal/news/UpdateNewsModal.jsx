// src/component/ui/Modal/UpdateNewsModal.jsx
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Image as ImageIcon } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import {
  useGetSingleNewsQuery,
  useUpdateNewsMutation,
} from "../../../../redux/features/news/news";

export default function UpdateNewsModal({ open, onClose, id }) {
  const { data, isFetching, isLoading, refetch } = useGetSingleNewsQuery(id, {
    skip: !open || !id,
  });
  const newsData = data?.data || null;
  const [updateNews, { isLoading: updating }] = useUpdateNewsMutation();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Normalize inbound API -> UI
  useEffect(() => {
    if (!open) return;
    if (newsData) {
      const title = newsData.title || newsData.name || "";
      const content = newsData.content || newsData.description || "";
      const img =
        newsData.imageUrl ||
        newsData.image ||
        newsData.headerImage ||
        newsData.thumbnail ||
        "";
      setName(title);
      setDesc(content);
      setPreviewUrl(img);
      setImageFile(null);
    } else {
      setName("");
      setDesc("");
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [newsData, open]);

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("title", name);
    fd.append("content", desc);
    if (imageFile instanceof File) fd.append("headerImage", imageFile);
    try {
      const data = {
        id,
        formData: fd,
      };
      const res = await updateNews(data).unwrap();
      console.log(res);
      toast.success("News updated");
      onClose?.();
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  return (
    <Modal
      open={open}
      onCancel={updating ? undefined : onClose}
      footer={null}
      centered
      width={800}
      title="Edit News"
      bodyStyle={{ padding: "2rem" }}
      destroyOnClose
      maskClosable={!updating}
      afterOpenChange={(opened) => {
        if (opened && id) refetch?.();
      }}
    >
      {/* Loading state */}
      {(isLoading || isFetching) && (
        <p className="text-sm text-gray-500 mb-3">Loading...</p>
      )}

      {/* Upload Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Upload Image</label>
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition relative overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-8 w-8 text-gray-500" />
              <span className="text-sm text-gray-700 mt-2">Browse Image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={updating}
          />
        </label>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="News title..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 outline-none"
        disabled={updating}
      />

      {/* Content */}
      <ReactQuill
        theme="snow"
        value={desc}
        onChange={setDesc}
        placeholder="Write content..."
        className="mb-6"
        readOnly={updating}
      />

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-gray-800 px-8 py-2 text-sm font-medium text-white hover:bg-gray-900 transition disabled:opacity-60"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update"}
        </button>
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
          disabled={updating}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
