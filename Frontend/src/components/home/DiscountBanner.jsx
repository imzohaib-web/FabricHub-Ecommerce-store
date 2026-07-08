import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DiscountBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-[#362E2A] text-white overflow-hidden rounded-sm py-16 px-8 sm:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg border border-brand-sand/10"
      >
        {/* Subtle decorative geometric background lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="10%" x2="100%" y2="90%" stroke="white" strokeWidth="2" />
            <line x1="100%" y1="10%" x2="0" y2="90%" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Content Group */}
        <div className="text-left space-y-4 max-w-xl z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
            Limited Invitation
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-light tracking-wide leading-tight">
            The Mid-Season Solstice Edit
          </h3>
          <p className="text-xs text-brand-sand leading-relaxed font-light">
            Enjoy exclusive savings of 15% across our new ready-to-wear dresses, pure silk slips, and luxury unstitched collection.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-sand bg-white/10 px-3 py-1.5 rounded-sm">
              Use Code: <span className="text-brand-gold font-bold">SOLSTICE15</span>
            </span>
          </div>
        </div>

        {/* CTA Button Group */}
        <div className="shrink-0 z-10 w-full md:w-auto text-left">
          <Link
            to="/shop?category=sale"
            className="inline-flex w-full md:w-auto items-center justify-center gap-2.5 px-8 py-4 bg-brand-gold text-white hover:bg-white hover:text-brand-dark text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm shadow-md hover:shadow-lg"
          >
            Explore The Sale
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
