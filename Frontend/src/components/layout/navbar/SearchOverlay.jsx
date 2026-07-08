import React from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "../../../utils/productUtils";

export default function SearchOverlay({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex justify-center items-start pt-16 px-4"
    >
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
        className="bg-white w-full max-w-2xl shadow-2xl p-6 rounded-sm relative z-10 border border-brand-sand/30"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={onSubmit} className="mt-4">
          <label className="text-[10px] uppercase font-bold tracking-widest text-brand-muted">
            Search Collection
          </label>
          <div className="flex border-b border-brand-dark pb-2 mt-2">
            <input
              type="text"
              placeholder="Search by product, category, size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-brand-dark text-base"
              autoFocus
            />
            <button type="submit" className="text-brand-dark">
              <Search size={20} />
            </button>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
              Suggested Products
            </h4>
            <div className="divide-y divide-brand-champagne">
              {searchResults.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 py-3 group hover:bg-brand-beige/50 px-2 transition-colors rounded-sm"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-12 h-14 object-cover rounded-sm border border-brand-sand/10"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-brand-dark group-hover:text-brand-gold transition-colors">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-brand-muted capitalize">{p.category}</p>
                  </div>
                  <span className="text-xs font-medium text-brand-dark">{formatPrice(p.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
