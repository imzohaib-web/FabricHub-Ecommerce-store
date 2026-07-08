import React from "react";
import { Link } from "react-router-dom";
import { LogOut, Sliders, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function UserMenu({ onClose, currentUser, isAdmin, logout, navigate }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute right-0 mt-2 w-52 bg-white shadow-xl border border-brand-sand/30 py-2 z-50 rounded-sm"
      >
        {currentUser ? (
          <>
            <div className="px-4 py-2 border-b border-brand-champagne text-left">
              <p className="text-xs font-semibold text-brand-dark">{currentUser.name}</p>
              <p className="text-[10px] text-brand-muted truncate">{currentUser.email}</p>
            </div>
            <Link
              to="/my-orders"
              className="flex items-center gap-2 px-4 py-2 text-xs text-brand-dark hover:bg-brand-champagne transition-colors"
            >
              <Package size={14} className="text-brand-gold" />
              My Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 text-xs text-brand-dark hover:bg-brand-champagne transition-colors"
              >
                <Sliders size={14} className="text-brand-gold" />
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block px-4 py-2 text-xs text-brand-dark hover:bg-brand-champagne transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 text-xs text-brand-dark hover:bg-brand-champagne transition-colors"
            >
              Create Account
            </Link>
          </>
        )}
      </motion.div>
    </>
  );
}
