import React from "react";

export default function ProductImageGallery({ images, mainImage, onSelectImage, productName }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[3/4] w-full overflow-hidden bg-brand-champagne rounded-sm shadow-sm relative">
        <img src={mainImage} alt={productName} className="w-full h-full object-cover" />
      </div>

      {images && images.length > 1 && (
        <div className="flex gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelectImage(img)}
              className={`w-20 h-24 bg-brand-champagne overflow-hidden rounded-sm border transition-colors ${
                mainImage === img ? "border-brand-dark" : "border-brand-sand/30"
              }`}
            >
              <img src={img} alt={`${productName} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
