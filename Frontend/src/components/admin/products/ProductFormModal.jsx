import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { buildProductPayload } from "../../../utils/productUtils";
import { categories } from "../../../data/categories";

function getInitialState(editingProduct) {
  if (editingProduct) {
    return {
      name: editingProduct.name,
      price: editingProduct.price,
      category: editingProduct.category,
      description: editingProduct.description,
      imageUrl1: editingProduct.images[0] || "",
      imageUrl2: editingProduct.images[1] || "",
      sizes: editingProduct.sizes || [],
      inStock: editingProduct.inStock,
    };
  }
  return {
    name: "",
    price: "",
    category: "ready-to-wear",
    description: "",
    imageUrl1: "",
    imageUrl2: "",
    sizes: ["S", "M", "L"],
    inStock: true,
  };
}

function ProductFormModalContent({ editingProduct, onClose, onSubmit }) {
  const initial = getInitialState(editingProduct);
  const [name, setName] = useState(initial.name);
  const [price, setPrice] = useState(initial.price);
  const [category, setCategory] = useState(initial.category);
  const [description, setDescription] = useState(initial.description);
  const [imageUrl1, setImageUrl1] = useState(initial.imageUrl1);
  const [imageUrl2, setImageUrl2] = useState(initial.imageUrl2);
  const [sizes, setSizes] = useState(initial.sizes);
  const [inStock, setInStock] = useState(initial.inStock);

  const handleSizeToggle = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = buildProductPayload(
      { name, price, category, description, imageUrl1, imageUrl2, sizes, inStock },
      editingProduct
    );
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
        className="bg-white max-w-lg w-full p-6 shadow-2xl relative rounded-sm border border-brand-sand/30 z-10 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark">
          <X size={18} />
        </button>

        <h4 className="font-serif text-lg font-light text-brand-dark mb-4">
          {editingProduct ? "Modify Product details" : "Create New Product"}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark capitalize"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1 font-bold">Status</label>
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

          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Primary Image URL</label>
              <input
                type="url"
                value={imageUrl1}
                onChange={(e) => setImageUrl1(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">
                Secondary Image URL (Hover swap)
              </label>
              <input
                type="url"
                value={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="border border-brand-sand/50 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark"
              />
            </div>
          </div>

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
