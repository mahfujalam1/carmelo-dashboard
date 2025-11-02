import React, { useState, useEffect } from "react";
import { Modal } from "antd";

const ProductViewModal = ({ open, onClose, product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ✅ Reset selected image when modal opens or product changes
  useEffect(() => {
    if (product?.images?.length) setSelectedIndex(0);
  }, [product, open]);

  if (!product) return null;

  const sizes =
    product?.sizes && product.sizes.length
      ? product.sizes
      : [
          { label: "ALL", price: "$10" },
          { label: "US S", price: "ASK" },
          { label: "US L", price: "$9" },
          { label: "AS M", price: "ASK" },
          { label: "US XL", price: "$10" },
          { label: "US XXL", price: "ASK" },
        ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      title={null}
      bodyStyle={{ padding: "2rem" }}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Section: Image Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-xl border">
            <img
              src={product.images?.[selectedIndex]}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-300"
            />
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                  selectedIndex === i
                    ? "ring-2 ring-gray-800 scale-105"
                    : "hover:ring-1 hover:ring-gray-400"
                }`}
              >
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Product Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.title}</p>
            </div>
            <div className="text-xl font-bold text-gray-900">
              ${product.price ?? "—"}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            {product.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut eros eget justo efficitur feugiat."}
            <span className="ml-1 cursor-pointer text-gray-500 hover:underline">
              See more...
            </span>
          </p>

          <div>
            <h4 className="mt-4 mb-2 text-sm font-semibold text-gray-700">
              Available Size:
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {sizes.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="text-gray-500">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductViewModal;
