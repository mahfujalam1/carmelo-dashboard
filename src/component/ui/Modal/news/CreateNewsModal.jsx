// src/component/ui/Modal/CreateNewsModal.jsx
import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Image as ImageIcon } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { useCreateNewsMutation } from "../../../../redux/features/news/news";

export default function CreateNewsModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [addNews, { isLoading: creating }] = useCreateNewsMutation();

  useEffect(() => {
    if (!open) {
      setName("");
      setDesc("");
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [open]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("title", name);
    fd.append("content", desc);
    if (imageFile) fd.append("headerImage", imageFile);
    return fd;
  };

  const handleSubmit = async () => {
    if (!name) return toast.warning("Title দরকার।");
    if (!imageFile) return toast.warning("Image দরকার।");

    try {
      await addNews(buildFormData()).unwrap();
      toast.success("News created");
      onClose?.();
    } catch (e) {
      console.error(e);
      toast.error("Create failed");
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
      onCancel={creating ? undefined : onClose}
      footer={null}
      centered
      width={800}
      title="Create News"
      bodyStyle={{ padding: "2rem" }}
      destroyOnClose
      maskClosable={!creating}
    >
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
            disabled={creating}
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
        disabled={creating}
      />

      {/* Content */}
      <ReactQuill
        theme="snow"
        value={desc}
        onChange={setDesc}
        placeholder="Write content..."
        className="mb-6"
        readOnly={creating}
      />

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-gray-800 px-8 py-2 text-sm font-medium text-white hover:bg-gray-900 transition disabled:opacity-60"
          disabled={creating}
        >
          {creating ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
          disabled={creating}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
