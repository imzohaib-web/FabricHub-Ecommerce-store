import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import { productService } from "../../services/productService";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 15 }
  }
};

export default function BestSellers() {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await productService.fetchProducts({ featured: true });
        setProductsList(data);
      } catch (err) {
        console.error("Failed to load best sellers:", err);
      }
    };
    getProducts();
  }, []);

  // Filter products by isBestSeller
  const bestSellers = productsList.filter((p) => p.isBestSeller).slice(0, 4);

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-24 bg-[#F5F3EE] border-y border-brand-sand/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 text-left">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">
              Coveted Classics
            </span>
            <h2 className="font-serif text-3xl font-light tracking-wide text-brand-dark">
              Best Sellers
            </h2>
            <p className="text-xs text-brand-muted max-w-md font-light leading-relaxed">
              Our most-desired silhouettes and signature tailored items, crafted from premium fabrics.
            </p>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-dark hover:text-brand-gold transition-colors mt-6 sm:mt-0"
          >
            Shop The Best Sellers
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid with staggered animations */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {bestSellers.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
