import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "../../../data/categories";

export default function MobileMenu({ isOpen, onClose, currentUser, logout, navigate }) {
  const [showCategories, setShowCategories] = useState(false);

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
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-50 p-6 flex flex-col justify-between shadow-2xl"
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif text-xl font-semibold tracking-wider text-brand-dark">
              FABRIC<span className="text-brand-gold">HUB</span>
            </span>
            <button onClick={onClose} className="text-brand-dark">
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 text-xs font-semibold uppercase tracking-widest text-brand-dark text-left">
            <Link to="/" onClick={onClose} className="py-1.5 border-b border-brand-sand/15 hover:text-brand-gold transition-colors">Home</Link>
            <Link to="/shop" onClick={onClose} className="py-1.5 border-b border-brand-sand/15 hover:text-brand-gold transition-colors">Shop</Link>
            
            {/* Collapsible Categories Accordion */}
            <div>
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="w-full flex items-center justify-between py-1.5 border-b border-brand-sand/15 hover:text-brand-gold transition-colors uppercase font-semibold text-xs tracking-widest cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown size={14} className={`transform transition-transform duration-300 ${showCategories ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden pl-4 flex flex-col space-y-2 mt-2"
                  >
                    {categories.filter(c => ["new-arrivals", "sale", "monochrome", "unstitched", "ready-to-wear", "formal", "shawl"].includes(c.slug)).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="text-[10px] text-brand-dark py-1 hover:text-brand-gold transition-colors font-medium"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <div className="border-t border-brand-champagne/50 my-1"></div>
                    {categories.filter(c => ["lawn-collection", "luxury-pret", "embroidered", "wedding-wear", "silk-collection", "winter-collection"].includes(c.slug)).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="text-[10px] text-brand-muted py-1 hover:text-brand-gold transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link to="/category/sale" onClick={onClose} className="py-1.5 border-b border-brand-sand/15 text-red-600 font-bold hover:text-brand-gold transition-colors">Sale</Link>
          </nav>
        </div>
        {currentUser ? (
          <div className="border-t border-brand-sand/40 pt-4">
            <p className="text-xs font-semibold text-brand-dark">{currentUser.name}</p>
            <button
              onClick={() => {
                logout();
                onClose();
                navigate("/");
              }}
              className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 border-t border-brand-sand/40 pt-4">
            <Link
              to="/login"
              onClick={onClose}
              className="w-full py-2 bg-brand-dark text-white text-center text-xs font-semibold tracking-widest uppercase"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="w-full py-2 border border-brand-dark text-brand-dark text-center text-xs font-semibold tracking-widest uppercase"
            >
              Create Account
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
}
