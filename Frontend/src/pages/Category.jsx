import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { categories } from "../data/categories";
import ProductCard from "../components/products/ProductCard";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { productService } from "../services/productService";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Category() {
  const { slug } = useParams();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Find category detail
  const categoryInfo = categories.find((cat) => cat.slug === slug);

  useScrollToTop([slug]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.fetchProducts();
        setProductsList(data);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [slug]);

  // Filter products by category
  const filtered = productsList.filter((product) => product.category === slug);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark"></div>
        <p className="text-xs uppercase font-bold tracking-widest text-brand-muted mt-4">Loading Collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
        <p className="text-xs uppercase font-bold tracking-widest text-red-600">Error Loading Category</p>
        <p className="text-sm text-brand-muted">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-light text-brand-dark">Category Not Found</h2>
        <Link to="/shop" className="text-xs font-bold text-brand-gold uppercase tracking-widest hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Back button */}
      <div className="text-left mb-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand-muted hover:text-brand-dark transition-colors"
        >
          <ChevronLeft size={12} />
          Back to Shop
        </Link>
      </div>

      {/* Category Editorial Hero Banner */}
      <div className="relative overflow-hidden aspect-[21/9] md:aspect-[32/10] bg-brand-champagne flex flex-col justify-center p-6 sm:p-12 mb-12 rounded-sm">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply"
          style={{ backgroundImage: `url(${categoryInfo.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-champagne/90 via-brand-champagne/40 to-transparent" />
        <div className="relative z-10 text-left max-w-xl space-y-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-gold">Collection</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-dark capitalize">{categoryInfo.name}</h1>
          <p className="text-xs text-brand-muted leading-relaxed font-light">{categoryInfo.description}</p>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">Products</h3>
          <span className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">
            {filtered.length} Items Found
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-widest">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
