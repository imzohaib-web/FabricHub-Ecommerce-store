import React from "react";
import { Star } from "lucide-react";
import { formatPrice } from "../../utils/productUtils";

export default function ProductInfo({ product }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold capitalize">
        {product.category}
      </span>
      <h1 className="font-serif text-3xl font-light text-brand-dark leading-tight">{product.name}</h1>
      <div className="flex items-center gap-4 pt-1">
        <span className="text-xl font-bold text-brand-dark">{formatPrice(product.price)}</span>
        <span className="text-brand-sand/65">|</span>
        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark">
          <Star size={12} className="fill-brand-gold text-brand-gold" />
          <span>{product.rating} / 5.0</span>
          <span className="text-brand-muted font-medium">({product.reviewsCount} reviews)</span>
        </div>
      </div>
      <p className="text-xs text-brand-muted leading-relaxed font-light">{product.description}</p>
    </div>
  );
}
