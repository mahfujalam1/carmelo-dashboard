import React, { useEffect, useState } from "react";

/** Reusable Add/Edit Category form */
export default function CategoryForm({
  initial = { name: "", imageUrl: "" },
  onSubmit,
  submitText = "Submit",
}) {
  const [name, setName] = useState(initial.name || "");
  const [preview, setPreview] = useState(initial.imageUrl || "");
  const [file, setFile] = useState(null);

  useEffect(() => {
    setName(initial.name || "");
    setPreview(initial.imageUrl || "");
  }, [initial]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ name: name.trim(), imageUrl: preview, file });
    console.log(first)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Category Image
      </label>
      <label className="flex h-36 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="h-24 w-24 rounded-full object-cover ring-1 ring-gray-200"
          />
        ) : (
          <span className="text-sm text-gray-500">Browse Image</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Food"
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none ring-gray-200 focus:ring"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-800 px-4 py-2.5 font-medium text-white hover:bg-gray-900"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
