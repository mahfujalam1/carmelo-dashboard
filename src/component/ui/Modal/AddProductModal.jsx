import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categories";
import { useAddProductMutation } from "../../../redux/features/product/productApi";

export default function ProductModal({
  onClose,
  onSave,
  initialData = null, // ← pass product object when editing
  mode = "create", // "create" | "edit"
}) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Foods");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("new"); // "new" or "gently_used"
  const [swappable, setSwappable] = useState(false); // true or false
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // Handle multiple files
  const [sizes, setSizes] = useState([]); // Sizes array (for storing "S", "M", "L", etc.)

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [addProduct] = useAddProductMutation(); // Assuming a hook to add a product

  // 🔹 Preload existing data when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setTitle(initialData.title || "");
      setCategory(initialData.category || "Foods");
      setPrice(initialData.price?.toString() || "");
      setCondition(initialData.condition || "new");
      setDescription(initialData.description || "");
      setSwappable(initialData.swappable || false);

      // Load images
      if (initialData.images?.length) {
        const mapped = initialData.images.map((url) => ({ file: null, url }));
        setFiles(mapped); // Preload image URLs
      }

      // Load sizes (stored as a string array)
      if (initialData.sizes?.length) {
        setSizes(initialData.sizes);
      }
    }
  }, [initialData]);

  // 🔹 Handle individual image upload (multiple files)
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // 🔹 Handle adding size input
  const handleAddSize = (size) => {
    if (size && !sizes.includes(size)) {
      setSizes((prevSizes) => [...prevSizes, size]);
    }
  };

  // 🔹 Handle removing a size
  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  // 🔹 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append basic fields
    formData.append("title", title);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("swappable", swappable);

    // Debugging: Check what is being appended to FormData
    console.log("Appending files:");
    files.forEach((file, index) => {
      console.log(`Appending file ${index}:`, file);
      formData.append(`images[${index}]`, file.file); // Ensure file.file is the correct File object
    });

    // Append sizes array
    console.log("Appending sizes:");
    sizes.forEach((size, index) => {
      console.log(`Appending size ${index}:`, size);
      formData.append("sizes[]", size); // Append each size in the array
    });

    // Debugging: Log the formData entries before sending
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      // Send data to the backend
      console.log("product form data=>", formData);
      await addProduct(formData).unwrap();
      onSave(); // Trigger the onSave callback after saving the product
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding product:", error);
    }
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
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Product Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mb-3"
              onChange={handleFileChange}
            />
            <div className="grid grid-cols-3 gap-3">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="relative flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 overflow-hidden"
                >
                  <img
                    src={file.url}
                    alt="preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = [...files];
                      newFiles.splice(i, 1);
                      setFiles(newFiles);
                    }}
                    className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="">
            {/* Right: Product Info */}
            <div className="grid grid-cols-2 gap-5">
              {/* Product Title */}
              <div>
                <label className="block text-sm font-medium">
                  Product Name
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

              {/* Product Title */}
              <div>
                <label className="block text-sm font-medium">
                  Product Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="type here..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium">
                  Product Size
                </label>
                <select
                  onChange={(e) => handleAddSize(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select Size</option>
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <ul className="mt-2 flex gap-2">
                  {sizes.map((size, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-sm bg-gray-200 px-1 text-black rounded-lg"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="text-red-600"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
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

              {/* Category */}
              <div>
                <label className="block text-sm font-medium">
                  Select Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {isCategoriesLoading ? (
                    <option>Loading...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="new">New</option>
                  <option value="gently_used">Gently Used</option>
                </select>
              </div>

              {/* Swappable */}
              <div>
                <label className="block text-sm font-medium">Swappable</label>
                <select
                  value={swappable}
                  onChange={(e) => setSwappable(e.target.value === "true")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
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

          {/* Submit Button */}
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
