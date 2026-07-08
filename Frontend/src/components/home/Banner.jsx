import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Banner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative bg-brand-dark overflow-hidden rounded-sm aspect-[16/9] md:aspect-[21/9] flex items-center p-6 sm:p-12 lg:p-20 text-left">
        {/* Background Image with elegant overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-100 hover:scale-[1.02] transition-transform duration-[2000ms]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-md space-y-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
            Sustainability Focus
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-light tracking-wide text-white leading-tight">
            Mindfully Crafted, Timelessly Styled
          </h3>
          <p className="text-xs text-brand-sand leading-relaxed font-light">
            Every garment in our catalog is engineered to endure, woven from premium French flax linen, organic merino wool, and toxin-free Mulberry silks.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border-b border-brand-gold text-brand-gold hover:text-white hover:border-white text-xs font-semibold uppercase tracking-widest pb-1 transition-colors"
            >
              Learn Our Philosophy
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
