import React from "react";
import ProductCard from "../products/ProductCard";

export default function RelatedProducts({ products }) {
  if (products.length === 0) return null;

  return (
    <div className="pt-12 border-t border-brand-champagne/70 text-left">
      <div className="mb-8">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-gold">Complete the Look</span>
        <h3 className="font-serif text-2xl font-light text-brand-dark mt-1">You May Also Like</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
