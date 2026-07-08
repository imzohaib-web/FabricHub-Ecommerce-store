import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Instagram, Facebook, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#1C1B19] text-white border-t border-brand-sand/10 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Editorial Brand / Newsletter */}
        <div className="md:col-span-2 space-y-6 text-left">
          <Link to="/" className="font-serif text-2xl tracking-[0.1em] text-white">
            FABRIC<span className="text-brand-gold">HUB</span>
          </Link>
          <p className="text-xs text-[#A6A29E] leading-relaxed max-w-sm">
            Sign up for our newsletter to receive early access to collection drops, exclusive editorial edits, and style advice.
          </p>

          <form onSubmit={handleSubscribe} className="relative max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#272624] text-white text-xs border border-transparent focus:border-brand-gold focus:outline-none py-3 pl-4 pr-12 rounded-sm"
              required
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-gold hover:text-white transition-colors p-1"
              aria-label="Subscribe"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          {subscribed && (
            <p className="text-[10px] text-brand-gold font-medium tracking-wide uppercase">
              Thank you for subscribing to the edit.
            </p>
          )}
        </div>

        {/* Column 2: Collections */}
        <div className="text-left space-y-4">
          <h5 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">Collections</h5>
          <ul className="space-y-2 text-xs text-[#A6A29E]">
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">Shop All</Link>
            </li>
            <li>
              <Link to="/category/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link>
            </li>
            <li>
              <Link to="/category/lawn-collection" className="hover:text-white transition-colors">Lawn Collection</Link>
            </li>
            <li>
              <Link to="/category/ready-to-wear" className="hover:text-white transition-colors">Ready-to-Wear</Link>
            </li>
            <li>
              <Link to="/category/unstitched" className="hover:text-white transition-colors">Unstitched</Link>
            </li>
            <li>
              <Link to="/category/luxury-pret" className="hover:text-white transition-colors">Luxury Pret</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div className="text-left space-y-4">
          <h5 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">Customer Care</h5>
          <ul className="space-y-2 text-xs text-[#A6A29E]">
            <li>
              <a href="#" className="hover:text-white transition-colors">Shipping & Returns</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Sizing Guide</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">FAQs</a>
            </li>
            <li>
              <Link to="/admin" className="hover:text-white transition-colors">Staff Login</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#2C2B29] flex flex-col sm:flex-row items-center justify-between text-[#7F7B78] text-[10px] uppercase tracking-[0.15em]">
        <p>&copy; {new Date().getFullYear()} FabricHub. All rights reserved.</p>
        
        {/* Social Icons */}
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
            <Facebook size={16} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Pinterest">
            <span className="font-bold text-[11px] font-serif lowercase">pin</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
