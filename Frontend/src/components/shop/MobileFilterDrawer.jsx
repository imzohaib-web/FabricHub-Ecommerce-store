import React from "react";
import { motion } from "framer-motion";
import Filter from "../products/Filter";

export default function MobileFilterDrawer({ isOpen, onClose, filterProps }) {
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
        className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-50 p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <span className="font-serif text-lg font-semibold text-brand-dark">Filter</span>
          <button onClick={onClose} className="text-brand-dark">Close</button>
        </div>
        <Filter {...filterProps} />
      </motion.div>
    </>
  );
}
