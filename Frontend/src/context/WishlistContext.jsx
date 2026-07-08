import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { wishlistService } from "../services/wishlistService";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext();

/**
 * Custom hook to consume Wishlist Context
 */
export const useWishlistContext = () => useContext(WishlistContext);

/**
 * Global Wishlist Provider wrapping the application to manage wishlist items from DB.
 */
export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load wishlist when user mounts or changes log state
  useEffect(() => {
    const loadWishlist = async () => {
      const token = localStorage.getItem("fh_access_token");
      if (!currentUser || !token) {
        setWishlistItems([]);
        return;
      }

      setLoading(true);
      try {
        const wishlist = await wishlistService.fetchWishlist(token);
        // Normalize IDs to make checks simple
        const productIds = (wishlist.products || []).map((p) => p._id || p.id || p);
        setWishlistItems(productIds);
      } catch (err) {
        console.error("Failed to load wishlist from database:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [currentUser]);

  /**
   * Add or remove an item. Synchronizes with backend database.
   */
  const toggleWishlist = async (productId) => {
    if (!currentUser) {
      // Redirect guest to login
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("fh_access_token");
    if (!token) return;

    // Optimistic Update: toggle locally first for a snappier feel
    const isPresent = wishlistItems.includes(productId);
    if (isPresent) {
      setWishlistItems((prev) => prev.filter((id) => id !== productId));
    } else {
      setWishlistItems((prev) => [...prev, productId]);
    }

    try {
      const updatedWishlist = await wishlistService.toggleWishlist(productId, token);
      const productIds = (updatedWishlist.products || []).map((p) => p._id || p.id || p);
      setWishlistItems(productIds);
    } catch (err) {
      console.error("Failed to toggle wishlist item on backend:", err.message);
      // Revert optimistic toggle state on API request failure
      if (isPresent) {
        setWishlistItems((prev) => [...prev, productId]);
      } else {
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
      }
    }
  };

  const value = {
    wishlistItems,
    toggleWishlist,
    loading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
