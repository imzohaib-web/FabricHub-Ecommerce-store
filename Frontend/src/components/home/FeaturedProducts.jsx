import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import { ArrowRight } from "lucide-react";
import { productService } from "../../services/productService";

export default function FeaturedProducts() {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await productService.fetchProducts({ featured: true });
        setProductsList(data);
      } catch (err) {
        console.error("Failed to load featured products:", err);
      }
    };
    getProducts();
  }, []);

  // Select featured products
  const featured = productsList.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 text-left">
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            Season Essentials
          </span>
          <h2 className="font-serif text-3xl font-light tracking-wide text-brand-dark">
            Featured Pieces
          </h2>
        </div>
        <Link
          to="/shop"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-dark hover:text-brand-gold transition-colors mt-4 sm:mt-0"
        >
          Explore All Items
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
