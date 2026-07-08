const BASE_URL = "http://localhost:5000/api/v1/wishlist";

/**
 * Service to interact with the backend Wishlist API.
 */
export const wishlistService = {
  /**
   * Fetch user's wishlist from backend.
   * @param {string} token - JWT Access Token.
   */
  async fetchWishlist(token) {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch wishlist");
    }
    return data.data.wishlist; // Returns { user, products: [...] }
  },

  /**
   * Add or remove a product from user's wishlist in backend database.
   * @param {string} productId - Product ID (Mongoose ObjectId).
   * @param {string} token - JWT Access Token.
   */
  async toggleWishlist(productId, token) {
    const response = await fetch(`${BASE_URL}/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle wishlist item");
    }
    return data.data.wishlist; // Returns updated wishlist { user, products: [...] }
  }
};
