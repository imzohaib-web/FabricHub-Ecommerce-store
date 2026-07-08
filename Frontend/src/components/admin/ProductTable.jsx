import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ProductTableRow from "./products/ProductTableRow";
import ProductFormModal from "./products/ProductFormModal";

export default function ProductTable({ productsList, onUpdateProducts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleSubmit = (productData) => {
    const updatedList = editingProduct
      ? productsList.map((p) => (p.id === editingProduct.id ? productData : p))
      : [productData, ...productsList];
    onUpdateProducts(updatedList);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onUpdateProducts(productsList.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="bg-white border border-brand-sand/15 rounded-sm shadow-sm p-6 text-left">
      <div className="flex justify-between items-center pb-4 border-b border-brand-champagne mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">Catalog Management</h3>
          <p className="text-[10px] text-brand-muted mt-1 uppercase tracking-wide">Manage products catalog lists</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark hover:bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
        >
          <Plus size={12} />
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-sand/30 text-[10px] uppercase font-bold tracking-wider text-brand-muted">
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-champagne/45 font-medium text-brand-dark">
            {productsList.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProductFormModal
            isOpen={isModalOpen}
            editingProduct={editingProduct}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
