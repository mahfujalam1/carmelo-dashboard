import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Image as ImageIcon } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewsModal = ({ open, onClose, onSave, editingItem }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setDesc(editingItem.description || "");
      setFile(editingItem.image ? { url: editingItem.image } : null);
    } else {
      setName("");
      setDesc("");
      setFile(null);
    }
  }, [editingItem]);

  const handleSubmit = () => {
    if (!name || !file) {
      alert("Please provide a name and upload an image!");
      return;
    }
    onSave({
      name,
      description: desc,
      image: file.url,
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile({
        file: selected,
        url: URL.createObjectURL(selected),
      });
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      title={editingItem ? "Edit News" : "Create News"}
      bodyStyle={{ padding: "2rem" }}
    >
      {/* Upload Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Upload Image</label>
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition relative overflow-hidden">
          {file ? (
            <img
              src={file.url}
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
          />
        </label>
      </div>

      {/* Name Input */}
      <input
        type="text"
        placeholder="News name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 outline-none"
      />

      {/* Description Editor */}
      <ReactQuill
        theme="snow"
        value={desc}
        onChange={setDesc}
        placeholder="Write description..."
        className="mb-6"
      />

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-gray-800 px-8 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
        >
          {editingItem ? "Update" : "Save"}
        </button>
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default NewsModal;
