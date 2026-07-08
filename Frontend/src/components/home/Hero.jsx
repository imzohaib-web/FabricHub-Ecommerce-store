import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "../../data/banners";

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[600px] overflow-hidden bg-brand-champagne">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Left Column: Text Content */}
          <div className={`relative flex flex-col justify-center order-2 lg:order-1 h-[240px] sm:h-[260px] lg:h-full p-6 sm:p-12 lg:p-20 pb-16 lg:pb-20 ${banners[current].bgColor} ${banners[current].textColor} transition-colors duration-500 overflow-hidden`}>
            {/* Soft background glow accents for luxury texture */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-rose/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-20 max-w-lg space-y-2.5 sm:space-y-4">
              {/* Subtitle */}
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-[9px] sm:text-xs font-bold tracking-[0.25em] uppercase text-brand-gold block"
              >
                {banners[current].subtitle}
              </motion.span>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light tracking-wide leading-tight"
              >
                {banners[current].title}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className={`text-[10px] sm:text-xs lg:text-sm font-light leading-relaxed tracking-wide ${banners[current].taglineColor}`}
              >
                {banners[current].tagline}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="pt-1.5 sm:pt-3"
              >
                <Link
                  to={banners[current].link}
                  className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-brand-gold text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] hover:bg-white ${
                    banners[current].textColor === "text-white" ? "hover:text-brand-dark" : "hover:text-brand-dark border-brand-gold/20"
                  } transition-all duration-300 rounded-sm shadow-md hover:shadow-lg`}
                >
                  {banners[current].cta}
                  <ArrowRight size={12} />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Image Content */}
          <div className="relative h-[280px] sm:h-[340px] lg:h-full w-full overflow-hidden bg-brand-champagne order-1 lg:order-2">
            <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none" />
            <motion.img
              initial={{ scale: 1.05, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={banners[current].image}
              alt={banners[current].title}
              className={`absolute inset-0 w-full h-full object-cover ${banners[current].imagePosition} transition-all duration-[1200ms] ease-out`}
              loading="eager"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-5 right-6 sm:bottom-8 sm:right-8 flex space-x-2 sm:space-x-3 z-30">
        <button
          onClick={prevSlide}
          className={`p-2 sm:p-3 border rounded-full transition-colors backdrop-blur-sm ${
            banners[current].textColor === "text-white"
              ? "border-white/30 text-white hover:bg-white hover:text-brand-dark"
              : "border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-white"
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={nextSlide}
          className={`p-2 sm:p-3 border rounded-full transition-colors backdrop-blur-sm ${
            banners[current].textColor === "text-white"
              ? "border-white/30 text-white hover:bg-white hover:text-brand-dark"
              : "border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-white"
          }`}
          aria-label="Next slide"
        >
          <ChevronRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-6 sm:bottom-8 sm:left-8 flex space-x-1.5 sm:space-x-2 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              current === index 
                ? "w-6 sm:w-8 bg-brand-gold" 
                : banners[current].textColor === "text-white"
                  ? "w-1.5 sm:w-2 bg-white/40"
                  : "w-1.5 sm:w-2 bg-brand-dark/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
