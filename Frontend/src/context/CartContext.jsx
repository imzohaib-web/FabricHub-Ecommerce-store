import React, { createContext, useContext, useState, useEffect } from "react";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { getStoredJSON, setStoredJSON } from "../hooks/useLocalStorage";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cartService";
import {
  calcCartSubtotal,
  calcDiscountAmount,
  calcShipping,
  calcCartTotal,
  calcCartCount,
} from "../utils/cartUtils";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

/**
 * Mapper to normalize database cart items into the shape expected by the frontend components.
 */
const mapBackendCartItem = (dbItem) => {
  if (!dbItem || !dbItem.product) return null;
  const prod = dbItem.product;
  return {
    id: prod._id || prod.id,
    name: prod.title || prod.name,
    price: prod.price,
    image: prod.image || (prod.images && prod.images[0]) || "",
    size: dbItem.size,
    color: dbItem.color,
    quantity: dbItem.quantity,
    _id: dbItem._id
  };
};

const mapBackendCart = (dbCart) => {
  if (!dbCart || !dbCart.items) return [];
  return dbCart.items.map(mapBackendCartItem).filter(Boolean);
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load and merge cart on user login/status change
  useEffect(() => {
    const syncCartSession = async () => {
      const token = localStorage.getItem("fh_access_token");
      
      if (currentUser && token) {
        setLoading(true);
        try {
          const guestCart = getStoredJSON(STORAGE_KEYS.CART, []);
          
          if (guestCart.length > 0) {
            console.log("Merging guest cart into database cart...");
            // Merge guest cart items to database cart
            const mergedCart = await cartService.mergeCart(guestCart, token);
            setCartItems(mapBackendCart(mergedCart));
            // Wipe guest cart from localStorage
            localStorage.removeItem(STORAGE_KEYS.CART);
          } else {
            // Fetch database cart
            const dbCart = await cartService.fetchCart(token);
            setCartItems(mapBackendCart(dbCart));
          }
        } catch (err) {
          console.error("Failed to sync cart session with backend:", err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Load guest cart from local storage
        const savedCart = getStoredJSON(STORAGE_KEYS.CART, []);
        setCartItems(savedCart);
      }
    };

    syncCartSession();
  }, [currentUser]);

  /**
   * Save cart helper for guest sessions
   */
  const saveGuestCart = (items) => {
    setCartItems(items);
    setStoredJSON(STORAGE_KEYS.CART, items);
  };

  /**
   * Add item to cart (asynchronous support for stock checking)
   */
  const addToCart = async (product, size, color, quantity = 1) => {
    const token = localStorage.getItem("fh_access_token");
    const reqQty = Number(quantity);

    if (currentUser && token) {
      try {
        const updatedCart = await cartService.addToCart(product.id, reqQty, size, color, token);
        setCartItems(mapBackendCart(updatedCart));
        setIsCartOpen(true);
        return { success: true };
      } catch (err) {
        console.error("Add to cart API error:", err.message);
        return { success: false, message: err.message };
      }
    } else {
      // Guest local storage mode
      const itemsCopy = [...cartItems];
      const existingIndex = itemsCopy.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === size &&
          (!color?.name || item.color?.name === color.name)
      );

      if (existingIndex > -1) {
        itemsCopy[existingIndex].quantity += reqQty;
      } else {
        itemsCopy.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || product.image,
          size: size,
          color: color,
          quantity: reqQty,
        });
      }
      saveGuestCart(itemsCopy);
      setIsCartOpen(true);
      return { success: true };
    }
  };

  /**
   * Remove an item config from cart
   */
  const removeFromCart = async (id, size, colorName) => {
    const token = localStorage.getItem("fh_access_token");

    if (currentUser && token) {
      try {
        const updatedCart = await cartService.removeFromCart(id, size, colorName, token);
        setCartItems(mapBackendCart(updatedCart));
        return { success: true };
      } catch (err) {
        console.error("Remove from cart API error:", err.message);
        return { success: false, message: err.message };
      }
    } else {
      // Guest local storage mode
      const updatedCart = cartItems.filter(
        (item) => !(item.id === id && item.size === size && (!colorName || item.color.name === colorName))
      );
      saveGuestCart(updatedCart);
      return { success: true };
    }
  };

  /**
   * Update quantity of cart item
   */
  const updateQuantity = async (id, size, colorName, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("fh_access_token");

    if (currentUser && token) {
      try {
        const updatedCart = await cartService.updateCartItem(id, size, colorName, newQuantity, token);
        setCartItems(mapBackendCart(updatedCart));
        return { success: true };
      } catch (err) {
        console.error("Update quantity API error:", err.message);
        return { success: false, message: err.message };
      }
    } else {
      // Guest local storage mode
      const updatedCart = cartItems.map((item) => {
        if (item.id === id && item.size === size && (!colorName || item.color.name === colorName)) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      saveGuestCart(updatedCart);
      return { success: true };
    }
  };

  /**
   * Clear all items in cart
   */
  const clearCart = async () => {
    const token = localStorage.getItem("fh_access_token");

    if (currentUser && token) {
      try {
        await cartService.clearCart(token);
        setCartItems([]);
      } catch (err) {
        console.error("Clear cart API error:", err.message);
      }
    } else {
      saveGuestCart([]);
    }
    setPromoCode("");
    setDiscountPercent(0);
  };

  const applyPromo = (code) => {
    const formattedCode = code.trim().toUpperCase();
    if (formattedCode === "FABRIC10") {
      setPromoCode("FABRIC10");
      setDiscountPercent(10);
      return { success: true, message: "10% Promo Code Applied" };
    } else if (formattedCode === "FABRIC20") {
      setPromoCode("FABRIC20");
      setDiscountPercent(20);
      return { success: true, message: "20% Promo Code Applied" };
    }
    return { success: false, message: "Invalid promo code" };
  };

  const removePromo = () => {
    setPromoCode("");
    setDiscountPercent(0);
  };

  const cartSubtotal = calcCartSubtotal(cartItems);
  const discountAmount = calcDiscountAmount(cartSubtotal, discountPercent);
  const shipping = calcShipping(cartSubtotal);
  const cartTotal = calcCartTotal(cartSubtotal, discountAmount, shipping);
  const cartCount = calcCartCount(cartItems);

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo,
    promoCode,
    discountPercent,
    discountAmount,
    shipping,
    cartSubtotal,
    cartTotal,
    cartCount,
    loading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
