import React, { useEffect } from "react";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BestSellers from "../components/home/BestSellers";
import DiscountBanner from "../components/home/DiscountBanner";
import Banner from "../components/home/Banner";
import { motion } from "framer-motion";

export default function Home() {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col min-h-screen bg-[#FAF9F6]"
    >
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <DiscountBanner />
      <BestSellers />
      <Banner />
    </motion.div>
  );
}
