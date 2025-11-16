import { useEffect, useState } from "react";

// Image Modal Component
export const ImageModal = ({ images, currentIndex, onClose }) => {
  const [index, setIndex] = useState(currentIndex);

  const handlePrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
      >
        ×
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ›
          </button>
        </>
      )}

      <div
        className="max-w-6xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`Preview ${index + 1}`}
          className="max-w-full max-h-[85vh] object-contain mx-auto"
        />
        {images.length > 1 && (
          <div className="text-white text-center mt-4">
            {index + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};
