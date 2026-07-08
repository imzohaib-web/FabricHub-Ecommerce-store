import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Filter from "../components/products/Filter";
import ProductGrid from "../components/products/ProductGrid";
import SearchBar from "../components/products/SearchBar";
import ShopHeader from "../components/shop/ShopHeader";
import MobileFilterDrawer from "../components/shop/MobileFilterDrawer";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { filterProducts, sortProducts } from "../utils/productUtils";
import { productService } from "../services/productService";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Shop() {
  const location = useLocation();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState(60000);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useScrollToTop();

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
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    const categoryParam = params.get("category");

    if (searchParam) setSearchQuery(decodeURIComponent(searchParam));
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [location.search]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("");
    setPriceRange(60000);
    setSortBy("featured");
    setSearchQuery("");
  };

  const filterProps = {
    selectedCategory,
    setSelectedCategory,
    selectedSize,
    setSelectedSize,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters,
  };

  const filteredProducts = useMemo(() => {
    return filterProducts(productsList, {
      category: selectedCategory,
      size: selectedSize,
      priceRange,
      searchQuery,
    });
  }, [productsList, selectedCategory, selectedSize, priceRange, searchQuery]);

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortBy);
  }, [filteredProducts, sortBy]);

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
        <p className="text-xs uppercase font-bold tracking-widest text-red-600">Error Loading Products</p>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <ShopHeader />

      <div className="flex sm:hidden justify-between items-center gap-4 mb-6">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm"
        >
          <SlidersHorizontal size={14} />
          Filter
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28">
            <Filter {...filterProps} />
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />
            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-muted text-left">
              Showing {sortedProducts.length} pieces
            </p>
          </div>

          <ProductGrid products={sortedProducts} />
        </div>
      </div>

      <AnimatePresence>
        {mobileFilterOpen && (
          <MobileFilterDrawer
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            filterProps={filterProps}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
