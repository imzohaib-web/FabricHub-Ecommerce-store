import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../../data/categories";
import { ArrowUpRight } from "lucide-react";
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 15 }
  }
};

export default function CategorySection() {
  const requestedSlugs = [
    "new-arrivals",
    "ready-to-wear",
    "unstitched",
    "shawl",
    "formal",
    "monochrome",
    "sale",
    "lawn-collection",
    "luxury-pret",
    "embroidered",
    "wedding-wear",
    "silk-collection",
    "winter-collection"
  ];
  
  // Keep original order of requested categories
  const list = requestedSlugs
    .map(slug => categories.find(cat => cat.slug === slug))
    .filter(Boolean);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-transparent">
      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">Curated Edits</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-brand-dark">Shop by Category</h2>
        <p className="text-xs text-brand-muted leading-relaxed font-light">
          Explore our collection of pure silk slip dresses, unstitched linen panels, fine gold accents, and heritage shawls.
        </p>
      </div>

      {/* Elegant Grid with Framer Motion Staggered entrance */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {list.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <Link
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden aspect-[3/4] bg-brand-champagne flex flex-col justify-end p-6 rounded-sm shadow-sm block"
            >
              {/* Background Image with Zoom on Hover */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-95" />

              {/* Content overlay */}
              <div className="relative z-10 text-left text-white space-y-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-xl font-light tracking-wide">{category.name}</h3>
                  <span className="p-1 border border-white/30 rounded-full text-white bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
                <p className="text-[10px] text-brand-sand font-light leading-relaxed tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
