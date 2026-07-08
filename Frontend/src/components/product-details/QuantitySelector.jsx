import React from "react";
import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex flex-col">
      <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted mb-2">Quantity</label>
      <div className="inline-flex items-center border border-brand-sand/50 rounded-sm bg-[#FAF9F6] h-12">
        <button
          type="button"
          onClick={onDecrease}
          className="px-3 h-full text-brand-dark hover:bg-brand-champagne transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="px-4 text-xs font-bold text-brand-dark">{quantity}</span>
        <button
          type="button"
          onClick={onIncrease}
          className="px-3 h-full text-brand-dark hover:bg-brand-champagne transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}
