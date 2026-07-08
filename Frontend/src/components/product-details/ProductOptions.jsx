import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import QuantitySelector from "./QuantitySelector";

export default function ProductOptions({
  product,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
  quantity,
  onDecreaseQuantity,
  onIncreaseQuantity,
  isWishlisted,
  onWishlistToggle,
  onSubmit,
  addedMessage,
}) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6 pt-4 border-t border-brand-champagne">
        {product.colors && product.colors.length > 0 && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block mb-2">
              Selected Color: <span className="text-brand-dark font-semibold">{selectedColor?.name}</span>
            </label>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onSelectColor(c)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center p-0.5 ${
                    selectedColor?.name === c.name ? "border-brand-dark scale-110" : "border-brand-sand/40"
                  }`}
                >
                  <span className="w-full h-full rounded-full" style={{ backgroundColor: c.value }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block mb-2">
              Selected Size: <span className="text-brand-dark font-semibold">{selectedSize}</span>
            </label>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSelectSize(s)}
                  className={`w-10 h-10 border text-xs font-bold rounded-sm flex items-center justify-center transition-colors ${
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
        )}

        <div className="flex items-center gap-4">
          <QuantitySelector
            quantity={quantity}
            onDecrease={onDecreaseQuantity}
            onIncrease={onIncreaseQuantity}
          />

          <div className="flex-1 flex flex-col justify-end pt-5">
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!product.inStock}
                className="flex-1 h-12 bg-brand-dark hover:bg-brand-charcoal disabled:bg-brand-sand/70 text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm flex items-center justify-center"
              >
                {product.inStock ? "Add to Bag" : "Out of Stock"}
              </button>
              <button
                type="button"
                onClick={onWishlistToggle}
                className="w-12 h-12 border border-brand-sand/50 hover:bg-brand-champagne/40 rounded-sm flex items-center justify-center text-brand-dark transition-all"
                aria-label="Wishlist toggle"
              >
                <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-brand-dark"} />
              </button>
            </div>
          </div>
        </div>
      </form>

      {addedMessage && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-green-700 font-bold uppercase tracking-wider bg-green-50 p-3 border border-green-200 rounded-sm"
        >
          Item successfully added to your bag. Click Shopping Bag to view.
        </motion.p>
      )}
    </>
  );
}
