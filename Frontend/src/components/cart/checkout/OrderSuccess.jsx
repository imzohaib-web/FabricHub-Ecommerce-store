import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccess({ orderId }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto px-4 py-20 text-center space-y-6"
    >
      <div className="flex justify-center text-green-600">
        <CheckCircle2 size={64} className="stroke-1" />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">Order Complete</span>
        <h1 className="font-serif text-3xl font-light text-brand-dark">Thank You for Your Order</h1>
        <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed font-light">
          Your transaction has been processed. A confirmation receipt and tracking updates will be emailed shortly.
        </p>
      </div>
      <div className="bg-brand-champagne/40 p-6 rounded-sm border border-brand-sand/30 inline-block w-full text-left">
        <div className="flex justify-between border-b border-brand-champagne/80 pb-2 mb-2 text-xs font-semibold text-brand-dark">
          <span>Order Reference</span>
          <span className="text-brand-gold">{orderId}</span>
        </div>
        <div className="flex justify-between text-xs text-brand-muted">
          <span>Status</span>
          <span className="uppercase font-bold tracking-wider text-[10px] text-amber-700">
            Pending Fulfillment
          </span>
        </div>
      </div>
      <div className="pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark hover:bg-brand-charcoal text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-all shadow-md"
        >
          Continue Shopping
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
