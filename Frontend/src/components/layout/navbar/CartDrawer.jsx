import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../../context/CartContext";
import { formatPrice } from "../../../utils/productUtils";

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-dark z-50"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.35 }}
        className="fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 p-6 flex flex-col justify-between shadow-2xl"
      >
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-brand-champagne mb-4">
            <span className="font-serif text-lg font-medium text-brand-dark flex items-center gap-2">
              <ShoppingBag size={18} className="text-brand-gold" />
              Your Bag ({cartCount})
            </span>
            <button onClick={onClose} className="text-brand-dark hover:text-brand-gold transition-colors">
              <X size={20} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag size={48} className="text-brand-sand mb-4 stroke-1" />
              <p className="text-sm font-medium text-brand-dark">Your bag is currently empty.</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-brand-dark text-white text-xs font-semibold tracking-widest uppercase hover:bg-brand-charcoal transition-colors rounded-sm"
              >
                Shop Collection
              </Link>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[60vh] pr-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color.name}`}
                  className="flex gap-4 py-2 border-b border-brand-champagne/40"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-sm border border-brand-sand/15"
                  />
                  <div className="flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex justify-between">
                        <h5 className="text-xs font-bold text-brand-dark line-clamp-1">{item.name}</h5>
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.color.name)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-[10px] text-brand-muted mt-0.5">
                        Size: {item.size} | Color: {item.color.name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-brand-sand border-opacity-40 rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color.name, item.quantity - 1)
                          }
                          className="p-1 text-brand-dark hover:bg-brand-champagne"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-2 text-xs font-medium text-brand-dark">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color.name, item.quantity + 1)
                          }
                          className="p-1 text-brand-dark hover:bg-brand-champagne"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-brand-dark">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-brand-champagne pt-4 mt-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-brand-muted uppercase tracking-wider">Subtotal</span>
              <span className="text-sm font-semibold text-brand-dark">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="text-[10px] text-brand-muted text-left mb-4">
              Shipping and taxes are calculated at checkout.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/cart"
                onClick={onClose}
                className="w-full py-3 bg-brand-dark text-white text-center text-xs font-semibold tracking-widest uppercase hover:bg-brand-charcoal transition-colors rounded-sm"
              >
                Checkout Securely
              </Link>
              <button
                onClick={onClose}
                className="w-full py-2 bg-transparent text-brand-dark text-center text-xs font-semibold tracking-widest uppercase border border-brand-sand hover:bg-brand-beige transition-colors rounded-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
