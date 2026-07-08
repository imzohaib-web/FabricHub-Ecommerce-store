import React from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import WhatsAppButton from "./components/WhatsAppButton";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-brand-dark selection:bg-brand-gold selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
