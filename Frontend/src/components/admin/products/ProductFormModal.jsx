import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "../../../data/categories";

function getInitialState(editingProduct) {
  if (editingProduct) {
    return {
      name: editingProduct.name || "",
      price: editingProduct.price || "",
      discountPrice: editingProduct.discountPrice !== undefined ? editingProduct.discountPrice : "",
      category: editingProduct.category || "ready-to-wear",
      description: editingProduct.description || "",
      sizes: editingProduct.sizes || [],
      inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
      stock: editingProduct.stock !== undefined ? editingProduct.stock : 0,
      featured: editingProduct.isFeatured || false,
    };
  }
  return {
    name: "",
    price: "",
    discountPrice: "",
    category: "ready-to-wear",
    description: "",
    sizes: ["S", "M", "L"],
    inStock: true,
    stock: 0,
    featured: false,
  };
}

function ProductFormModalContent({ editingProduct, onClose, onSubmit }) {
  const initial = getInitialState(editingProduct);
  const [name, setName] = useState(initial.name);
  const [price, setPrice] = useState(initial.price);
  const [discountPrice, setDiscountPrice] = useState(initial.discountPrice);
  const [category, setCategory] = useState(initial.category);
  const [description, setDescription] = useState(initial.description);
  const [sizes, setSizes] = useState(initial.sizes);
  const [inStock, setInStock] = useState(initial.inStock);
  const [stock, setStock] = useState(initial.stock);
  const [featured, setFeatured] = useState(initial.featured);

  // Existing image states (from db)
  const [existingPrimaryImage, setExistingPrimaryImage] = useState(
    editingProduct?.rawImages?.find((img) => img.isPrimary) || null
  );
  const [existingAdditionalImages, setExistingAdditionalImages] = useState(
    editingProduct?.rawImages?.filter((img) => !img.isPrimary) || []
  );

  // New files uploaded locally
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(
    editingProduct?.rawImages?.find((img) => img.isPrimary)?.url || ""
  );
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (primaryImagePreview && primaryImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(primaryImagePreview);
      }
      additionalImagePreviews.forEach((item) => {
        if (item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [primaryImagePreview, additionalImagePreviews]);

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid file type: ${file.name}. Only JPG, JPEG, PNG, and WEBP images are allowed.`);
      return false;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(`File too large: ${file.name}. Maximum file size is 5MB.`);
      return false;
    }
    return true;
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (validateFile(file)) {
      setPrimaryImageFile(file);
      setPrimaryImagePreview(URL.createObjectURL(file));
      setExistingPrimaryImage(null); // Mark existing primary to be replaced
    }
    e.target.value = null; // Reset input
  };

  const handleRemovePrimaryImage = () => {
    setPrimaryImageFile(null);
    setPrimaryImagePreview("");
    setExistingPrimaryImage(null);
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
        validPreviews.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    });

    setAdditionalImageFiles((prev) => [...prev, ...validFiles]);
    setAdditionalImagePreviews((prev) => [...prev, ...validPreviews]);
    e.target.value = null; // Reset input
  };

  const handleRemoveNewAdditionalImage = (index) => {
    const previewToRemove = additionalImagePreviews[index];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.previewUrl);
    }
    setAdditionalImageFiles((prev) => prev.filter((_, idx) => idx !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveExistingAdditionalImage = (publicId) => {
    setExistingAdditionalImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const handleSizeToggle = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Primary image is required
    if (!primaryImageFile && !existingPrimaryImage) {
      alert("A primary product image is required.");
      return;
    }

    // Validation: Discount price must be less than price if provided
    if (discountPrice !== "" && Number(discountPrice) >= Number(price)) {
      alert("Discount price must be less than the regular price.");
      return;
    }

    const productData = {
      id: editingProduct ? editingProduct.id : "p_" + Date.now(),
      name,
      price: Number(price),
      discountPrice: discountPrice !== "" ? Number(discountPrice) : "",
      category,
      description,
      sizes,
      inStock,
      stock: Number(stock),
      isFeatured: featured,
      primaryImageFile,
      additionalImageFiles,
      existingImages: [
        ...(existingPrimaryImage ? [existingPrimaryImage] : []),
        ...existingAdditionalImages
      ],
      colors: editingProduct
        ? editingProduct.colors
        : [
            { name: "Default Neutral", value: "#E3D9D1" },
            { name: "Charcoal", value: "#2A2A2A" },
          ],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
      details: editingProduct
        ? editingProduct.details
        : ["Premium quality blend", "Dry clean recommended", "Imported"],
    };

    onSubmit(productData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-dark"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white max-w-lg w-full p-6 shadow-2xl relative rounded-sm border border-brand-sand/30 z-10 max-h-[90vh] overflow-y-auto text-left"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark">
          <X size={18} />
        </button>

        <h4 className="font-serif text-lg font-light text-brand-dark mb-4">
          {editingProduct ? "Modify Product details" : "Create New Product"}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Product Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-brand-sand/50 text-xs py-2.5 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark capitalize"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Discount Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Price (PKR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="1"
                className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Discount Price (PKR - Optional)</label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                min="0"
                className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark"
              />
            </div>
          </div>

          {/* Stock & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Status</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-1.5 text-xs text-brand-dark font-medium cursor-pointer">
                  <input type="radio" checked={inStock} onChange={() => setInStock(true)} className="accent-brand-gold" />
                  In Stock
                </label>
                <label className="flex items-center gap-1.5 text-xs text-brand-dark font-medium cursor-pointer">
                  <input type="radio" checked={!inStock} onChange={() => setInStock(false)} className="accent-brand-gold" />
                  Out of Stock
                </label>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Featured Product</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-1.5 text-xs text-brand-dark font-medium cursor-pointer">
                  <input type="radio" checked={featured} onChange={() => setFeatured(true)} className="accent-brand-gold" />
                  Yes
                </label>
                <label className="flex items-center gap-1.5 text-xs text-brand-dark font-medium cursor-pointer">
                  <input type="radio" checked={!featured} onChange={() => setFeatured(false)} className="accent-brand-gold" />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Product Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark resize-none"
            />
          </div>

          {/* Available Sizes */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted block mb-2">Available Sizes</label>
            <div className="flex gap-2">
              {["XS", "S", "M", "L", "XL", "OS"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`w-9 h-9 border text-[10px] font-bold rounded-sm flex items-center justify-center transition-colors ${
                    sizes.includes(size)
                      ? "border-brand-dark bg-brand-dark text-white"
                      : "border-brand-sand/50 text-brand-dark hover:bg-brand-champagne"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Image Uploads */}
          <div className="border-t border-brand-champagne/45 pt-4 space-y-4">
            {/* Primary Image */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                Primary Image (Required - JPG, JPEG, PNG, WEBP max 5MB)
              </label>
              {primaryImagePreview ? (
                <div className="relative w-28 h-36 bg-brand-champagne rounded-sm overflow-hidden border border-brand-sand/30 group">
                  <img src={primaryImagePreview} alt="Primary Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemovePrimaryImage}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold uppercase tracking-widest"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-brand-sand/50 rounded-sm cursor-pointer hover:bg-brand-champagne/10 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <Upload size={18} className="text-brand-muted mb-1" />
                      <p className="text-[9px] font-bold uppercase tracking-wider text-brand-muted">Select Primary Image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handlePrimaryImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                Additional Images (Optional - JPG, JPEG, PNG, WEBP max 5MB)
              </label>
              
              <div className="flex flex-wrap gap-3 mb-2">
                {/* Existing Additional Images */}
                {existingAdditionalImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative w-20 h-24 bg-brand-champagne rounded-sm overflow-hidden border border-brand-sand/20 group">
                    <img src={img.url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingAdditionalImage(img.publicId)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                      title="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                
                {/* Newly Selected Additional Images */}
                {additionalImagePreviews.map((previewObj, idx) => (
                  <div key={`new-${idx}`} className="relative w-20 h-24 bg-brand-champagne rounded-sm overflow-hidden border border-brand-sand/20 group">
                    <img src={previewObj.previewUrl} alt={`New ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewAdditionalImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                      title="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {/* Always show additional upload button/slot */}
                <label className="flex flex-col items-center justify-center w-20 h-24 border border-dashed border-brand-sand/50 rounded-sm cursor-pointer hover:bg-brand-champagne/10 transition-colors">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload size={14} className="text-brand-muted mb-1" />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-brand-muted">Add Image</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleAdditionalImagesChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-dark hover:bg-brand-charcoal text-white text-[10px] font-semibold uppercase tracking-widest rounded-sm transition-colors"
          >
            {editingProduct ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ProductFormModal({ isOpen, editingProduct, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <ProductFormModalContent
      key={editingProduct?.id ?? "new"}
      editingProduct={editingProduct}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
