import React from "react";
import { categories } from "../../data/categories";
import { RotateCcw, Check } from "lucide-react";
import { formatPrice } from "../../utils/productUtils";

export default function Filter({
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  resetFilters
}) {
  const sizes = ["XS", "S", "M", "L", "XL", "OS"];

  return (
    <div className="w-full space-y-8 text-left bg-white p-6 border border-brand-sand/15 rounded-sm shadow-sm">
      {/* Header with Reset */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-champagne">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">Filter Collection</h4>
        <button
          onClick={resetFilters}
          className="text-[10px] uppercase font-bold text-brand-gold hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          <RotateCcw size={10} />
          Reset
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-[#FAF9F6] border border-brand-sand/40 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark"
        >
          <option value="featured">Best Matches</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block">
          Categories
        </span>
        <div className="flex flex-col space-y-2 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-left py-1 hover:text-brand-gold transition-colors font-medium ${
              selectedCategory === "all" ? "text-brand-gold font-semibold" : "text-brand-dark"
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`text-left py-1 hover:text-brand-gold transition-colors font-medium capitalize ${
                selectedCategory === cat.slug ? "text-brand-gold font-semibold" : "text-brand-dark"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block">
          Filter by Size
        </span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((sz) => (
            <button
              key={sz}
              onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
              className={`w-9 h-9 border text-[10px] font-bold rounded-sm flex items-center justify-center transition-colors ${
                selectedSize === sz
                  ? "border-brand-dark bg-brand-dark text-white"
                  : "border-brand-sand/50 text-brand-dark hover:bg-brand-champagne"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          <span>Max Price</span>
          <span className="text-brand-dark">{formatPrice(priceRange)}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="60000"
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-brand-gold bg-brand-champagne h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-brand-muted font-bold">
          <span>{formatPrice(1000)}</span>
          <span>{formatPrice(60000)}</span>
        </div>
      </div>
    </div>
  );
}
