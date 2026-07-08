import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../hooks/useWishlist";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "../../utils/productUtils";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist(product.id);
  const [hovered, setHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
    if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
  }, [product]);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAddClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length === 1 && product.sizes[0] === "OS") {
      // If one size (like accessories), directly add to cart
      const res = await addToCart(product, "OS", product.colors[0], 1);
      if (res && !res.success) alert(res.message);
    } else {
      setQuickAddOpen(true);
    }
  };

  const submitQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize || !selectedColor) return;
    const res = await addToCart(product, selectedSize, selectedColor, 1);
    if (res && !res.success) {
      alert(res.message);
    } else {
      setQuickAddOpen(false);
    }
  };

  return (
    <>
      <div
        className="group flex flex-col bg-white rounded-sm overflow-hidden border border-brand-sand/15 relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Images & Overlays */}
        <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-brand-champagne">
          {/* Primary / Secondary Image Swap */}
          <img
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-[1000ms] ease-out scale-100 group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isFeatured && (
              <span className="bg-brand-dark text-white text-[9px] uppercase tracking-widest font-bold py-1 px-2.5 rounded-sm">
                Featured
              </span>
            )}
            {!product.inStock && (
              <span className="bg-red-600 text-white text-[9px] uppercase tracking-widest font-bold py-1 px-2.5 rounded-sm">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-brand-dark hover:text-brand-gold rounded-full transition-all duration-300 shadow-sm hover:shadow z-10 backdrop-blur-sm"
            aria-label="Add to wishlist"
          >
            <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : "text-brand-dark"} />
          </button>

          {/* Quick Add CTA Bar (Slide up on hover) */}
          {product.inStock && (
            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
              <button
                onClick={handleQuickAddClick}
                className="w-full py-2.5 bg-brand-dark/90 hover:bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 rounded-sm backdrop-blur-sm transition-all"
              >
                <ShoppingBag size={12} />
                Quick Add
              </button>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="p-4 flex flex-col text-left space-y-1.5">
          {/* Category */}
          <span className="text-[9px] font-semibold text-brand-muted uppercase tracking-widest">
            {product.category}
          </span>
          
          {/* Title */}
          <Link
            to={`/product/${product.id}`}
            className="text-xs font-semibold text-brand-dark hover:text-brand-gold transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Price & Rating */}
          <div className="flex justify-between items-center pt-1 border-t border-brand-champagne/45">
            <span className="text-xs font-bold text-brand-dark">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-1 text-[10px] text-brand-dark font-medium">
              <Star size={11} className="fill-brand-gold text-brand-gold" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {quickAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddOpen(false)}
              className="fixed inset-0 bg-brand-dark"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-sm w-full p-6 shadow-2xl relative rounded-sm border border-brand-sand/30 z-10 text-left"
            >
              <button
                onClick={() => setQuickAddOpen(false)}
                className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark"
              >
                <X size={18} />
              </button>

              <div className="flex gap-4 mb-5 pb-4 border-b border-brand-champagne">
                <img src={product.images[0]} alt={product.name} className="w-16 h-20 object-cover rounded-sm" />
                <div className="flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-brand-dark">{product.name}</h4>
                  <p className="text-sm font-semibold text-brand-gold mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>

              <form onSubmit={submitQuickAdd} className="space-y-4">
                {/* Colors */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted block mb-2">
                    Color: <span className="text-brand-dark font-semibold">{selectedColor?.name}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center p-0.5 ${
                          selectedColor?.name === c.name ? "border-brand-dark scale-110" : "border-brand-sand/40"
                        }`}
                      >
                        <span className="w-full h-full rounded-full" style={{ backgroundColor: c.value }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted block mb-2">
                    Size: <span className="text-brand-dark font-semibold">{selectedSize}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`w-9 h-9 border text-[10px] font-bold rounded-sm flex items-center justify-center transition-colors ${
                          selectedSize === s
                            ? "border-brand-dark bg-brand-dark text-white"
                            : "border-brand-sand/50 text-brand-dark hover:bg-brand-champagne"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Button */}
                <button
                  type="submit"
                  disabled={!selectedSize || !selectedColor}
                  className="w-full py-3 bg-brand-dark text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-brand-charcoal transition-colors rounded-sm mt-2 disabled:bg-brand-sand disabled:cursor-not-allowed"
                >
                  Confirm & Add to Bag
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
