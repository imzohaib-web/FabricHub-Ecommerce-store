import React from "react";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
  const whatsappNumber = "923082148607";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pointer-events-none md:bottom-8 md:right-8">
      {/* Tooltip / Label Container */}
      <motion.div
        className="pointer-events-auto hidden md:flex items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glassmorphism flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-brand-dark shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-brand-sand/30 hover:border-brand-gold/50 transition-all duration-300 group cursor-pointer"
          whileHover={{ x: -4 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="group-hover:text-brand-gold transition-colors duration-300">
            Need help? Chat with us
          </span>
        </motion.a>
      </motion.div>

      {/* Floating Action Button */}
      <div className="relative pointer-events-auto">
        {/* Pulse rings for high visual prominence */}
        <div className="absolute inset-0 -m-1.5 rounded-full bg-emerald-500/20 blur-[1px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute inset-0 -m-3 rounded-full bg-emerald-500/10 blur-[2px] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          initial={{ opacity: 0, scale: 0.3, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.8,
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 10px 40px rgba(37, 211, 102, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-7 h-7 md:w-8 md:h-8 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.067 5.248 5.311 0 11.777 0c3.136 0 6.085 1.22 8.3 3.432A11.666 11.666 0 0 1 23.5 11.892c-.004 6.644-5.248 11.893-11.716 11.893-2.007-.001-3.98-.515-5.725-1.499L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.405 0 9.803-4.303 9.806-9.593.001-2.56-1.002-4.97-2.824-6.79C16.528 2.408 14.12 1.4 11.782 1.4 6.378 1.4 1.98 5.703 1.977 10.994c-.001 1.702.469 3.364 1.358 4.803l-.993 3.629 3.715-.972zm11.233-5.267c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.776.975-.951 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.496-1.783-1.671-2.083-.175-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.628-.926-2.228-.244-.588-.491-.508-.676-.518-.175-.008-.375-.01-.576-.01-.2 0-.525.075-.8 0-.376-.275-1.076-1.126-1.076-2.478s.976-2.653 1.176-2.928c.2-.275 1.921-2.933 4.653-4.113.65-.28 1.157-.447 1.553-.573.654-.208 1.25-.178 1.72-.248.524-.078 1.603-.656 1.828-1.288.225-.633.225-1.176.15-1.288-.075-.113-.275-.175-.575-.325z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
