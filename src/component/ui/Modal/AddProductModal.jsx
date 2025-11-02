import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductModal({
  onClose,
  onSave,
  initialData = null, // ← pass product object when editing
  mode = "create", // "create" | "edit"
}) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("Foods");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([null, null, null]);

  // 🔹 Preload existing data when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setTitle(initialData.title || "");
      setType(initialData.type || "");
      setCategory(initialData.category || "Foods");
      setPrice(initialData.price?.toString() || "");
      setSize(initialData.size || "");
      setCondition(initialData.condition || "");
      setDescription(initialData.description || "");

      // Load images
      if (initialData.images?.length) {
        const mapped = initialData.images.map((url) => ({ file: null, url }));
        setFiles([...mapped, null, null].slice(0, 3));
      }
    }
  }, [initialData]);

  // 🔹 Handle individual image upload
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newFiles = [...files];
    newFiles[index] = { file, url: URL.createObjectURL(file) };
    setFiles(newFiles);
  };

  // 🔹 Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      id: initialData?.id || "#" + Math.floor(Math.random() * 100000),
      title,
      type:name,
      category,
      size,
      condition,
      price: parseFloat(price),
      description,
      images: files.filter(Boolean).map((f) => f.url),
    };

    onSave(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold">
            {mode === "edit" ? "Edit Product" : "Create Product"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Product Image
              </label>
              <div className="grid grid-cols-3 gap-3 border-2 border-dashed border-gray-300 p-3 rounded-xl">
                {files.map((file, i) => (
                  <label
                    key={i}
                    className="relative flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 overflow-hidden"
                  >
                    {file ? (
                      <img
                        src={file.url}
                        alt="preview"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-sm text-green-600 font-medium mt-1">
                          Browse Image
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileChange(e, i)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Product Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="type here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Product Type
                </label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="type here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Type Name</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g. T–Shirt"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="$100"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Product Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Select Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="Foods">Foods</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write here..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Condition
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. New / Used"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="submit"
              className="rounded-lg bg-gray-800 px-8 py-2 font-medium text-white hover:bg-gray-900"
            >
              {mode === "edit" ? "Update" : "Publish"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-8 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
