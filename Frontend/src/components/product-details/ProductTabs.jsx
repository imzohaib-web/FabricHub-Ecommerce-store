import React from "react";
import { ShieldCheck, CornerDownLeft, RotateCcw } from "lucide-react";

export default function ProductTabs({ product, activeTab, setActiveTab }) {
  return (
    <div className="pt-8 space-y-4">
      <div className="flex border-b border-brand-champagne text-[10px] uppercase font-bold tracking-wider">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 pr-6 border-b transition-all ${
            activeTab === "description"
              ? "border-brand-dark text-brand-dark"
              : "border-transparent text-brand-muted"
          }`}
        >
          Composition & Care
        </button>
        <button
          onClick={() => setActiveTab("shipping")}
          className={`pb-2 pr-6 border-b transition-all ${
            activeTab === "shipping"
              ? "border-brand-dark text-brand-dark"
              : "border-transparent text-brand-muted"
          }`}
        >
          Shipping & Returns
        </button>
      </div>

      <div className="text-xs text-brand-muted font-light leading-relaxed min-h-[80px]">
        {activeTab === "description" && (
          <ul className="list-disc pl-4 space-y-1.5">
            {product.details ? (
              product.details.map((detail, idx) => <li key={idx}>{detail}</li>)
            ) : (
              <>
                <li>100% fine materials</li>
                <li>Dry clean only</li>
                <li>Ethically engineered in Italy</li>
              </>
            )}
          </ul>
        )}
        {activeTab === "shipping" && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-brand-gold" /> Free ground shipping on orders over Rs. 5000.
            </p>
            <p className="flex items-center gap-1.5">
              <RotateCcw size={14} className="text-brand-gold" /> Easy returns within 14 days in original, unworn condition.
            </p>
            <p className="flex items-center gap-1.5">
              <CornerDownLeft size={14} className="text-brand-gold" /> Order processing time: 1-2 business days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
