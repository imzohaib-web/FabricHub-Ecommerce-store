import { useWishlistContext } from "../context/WishlistContext";

/**
 * Custom React hook consumed by ProductCard and ProductDetails.
 * Connects directly to the global database-synchronized WishlistContext.
 */
export function useWishlist(productId) {
  const { wishlistItems, toggleWishlist } = useWishlistContext();

  // If the product ID exists in our global wishlist items, mark it as wishlisted
  const isWishlisted = productId ? wishlistItems.includes(productId) : false;

  return { isWishlisted, toggleWishlist };
}
