import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <svg
          className="w-12 h-12 text-brand-sand mb-4 stroke-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">No Products Found</h3>
        <p className="text-xs text-brand-muted mt-1 max-w-xs leading-relaxed">
          We couldn't find any items matching your selected criteria. Try adjusting your filters or search keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
