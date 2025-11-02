import React, { useState } from "react";
import { Modal } from "antd";
import { Image as ImageIcon } from "lucide-react";

const AddCategoryModal = ({ open, onClose, onSubmit }) => {
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile({
        file: selected,
        url: URL.createObjectURL(selected),
      });
    }
  };

  const handleSubmit = () => {
    if (!file || !price) {
      alert("Please upload an image and enter price!");
      return;
    }

    const data = {
      id: "#" + Math.floor(Math.random() * 10000),
      logo: file.url,
      price,
    };

    onSubmit(data);
    onClose();
    setFile(null);
    setPrice("");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      title={null}
      bodyStyle={{ padding: "2rem" }}
    >
      <h2 className="text-lg font-semibold mb-4">Add Categories</h2>

      {/* Upload Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Logo</label>
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100/70 hover:bg-gray-200 transition relative overflow-hidden">
          {file ? (
            <img
              src={file.url}
              alt="Preview"
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

      {/* Price Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Price</label>
        <input
          type="text"
          placeholder="$120.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 outline-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-gray-800 px-8 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
