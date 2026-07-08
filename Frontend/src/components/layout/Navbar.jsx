import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { categories } from "../../data/categories";
import { searchProducts } from "../../utils/productUtils";
import { productService } from "../../services/productService";
import { ShoppingBag, User, Search, Menu, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import MobileMenu from "./navbar/MobileMenu";
import SearchOverlay from "./navbar/SearchOverlay";
import CartDrawer from "./navbar/CartDrawer";
import UserMenu from "./navbar/UserMenu";

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState([]);
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await productService.fetchProducts();
        setProductsList(data);
      } catch (err) {
        console.error("Failed to load products for Navbar search:", err);
      }
    };
    getProducts();
  }, []);

  const searchResults = searchProducts(productsList, searchQuery, 5);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location, setIsCartOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="bg-brand-dark text-white text-[11px] tracking-[0.15em] uppercase py-2 text-center font-medium">
        Free Shipping on Orders Over Rs. 5000 | Use Code: <span className="text-brand-gold font-bold">FABRIC10</span> for 10% Off
      </div>

      <header className="sticky top-0 z-40 w-full glassmorphism transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-brand-dark hover:text-brand-gold transition-colors"
          >
            <Menu size={22} />
          </button>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-[0.12em] uppercase text-brand-dark">
            <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
            
            {/* Hoverable Categories Dropdown */}
            <div className="relative group py-2">
              <span className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer">
                Categories
                <ChevronDown size={11} className="group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className="absolute top-full left-0 w-52 bg-white border border-brand-sand/15 shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-sm">
                {categories.filter(c => ["new-arrivals", "sale", "monochrome", "unstitched", "ready-to-wear", "formal", "shawl"].includes(c.slug)).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="block px-5 py-2 text-[10px] text-brand-dark hover:bg-brand-champagne hover:text-brand-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-brand-champagne my-2"></div>
                {categories.filter(c => ["lawn-collection", "luxury-pret", "embroidered", "wedding-wear", "silk-collection", "winter-collection"].includes(c.slug)).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="block px-5 py-2 text-[10px] text-brand-muted hover:bg-brand-champagne hover:text-brand-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/category/sale" className="hover:text-brand-gold text-red-600 transition-colors font-bold">Sale</Link>
          </nav>

          <div className="flex-1 md:flex-initial text-center md:text-left">
            <Link
              to="/"
              className="font-serif text-2xl sm:text-3xl font-medium tracking-[0.08em] text-brand-dark hover:opacity-90 transition-opacity"
            >
              FABRIC<span className="text-brand-gold">HUB</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-brand-dark hover:text-brand-gold transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-brand-dark hover:text-brand-gold transition-colors flex items-center gap-0.5"
                aria-label="User account"
              >
                <User size={20} />
                {currentUser && (
                  <span className="hidden sm:inline text-[11px] tracking-wider uppercase font-semibold ml-1">
                    {currentUser.name.split(" ")[0]}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <UserMenu
                    onClose={() => setIsUserMenuOpen(false)}
                    currentUser={currentUser}
                    isAdmin={isAdmin}
                    logout={logout}
                    navigate={navigate}
                  />
                )}
              </AnimatePresence>
            </div>

            {!currentUser && (
              <Link
                to="/login"
                className="hidden sm:inline-block px-4 py-2 border border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-300 rounded-sm"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-brand-dark hover:text-brand-gold transition-colors relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            currentUser={currentUser}
            logout={logout}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSubmit={handleSearchSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
