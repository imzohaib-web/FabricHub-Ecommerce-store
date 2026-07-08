const BASE_URL = "http://localhost:5000/api/v1/cart";

/**
 * Service to interact with the backend Cart API.
 */
export const cartService = {
  /**
   * Fetch user's cart from database.
   */
  async fetchCart(token) {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch cart");
    }
    return data.data.cart; // Returns { user, items: [...] }
  },

  /**
   * Add a product item to the user's cart in database.
   */
  async addToCart(productId, quantity, size, color, token) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity, size, color })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add item to cart");
    }
    return data.data.cart;
  },

  /**
   * Update quantity of an item in user's cart.
   */
  async updateCartItem(productId, size, colorName, quantity, token) {
    const response = await fetch(`${BASE_URL}/item`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId, size, colorName, quantity })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update cart item quantity");
    }
    return data.data.cart;
  },

  /**
   * Remove a specific item configuration from user's cart.
   */
  async removeFromCart(productId, size, colorName, token) {
    const response = await fetch(`${BASE_URL}/item/remove`, {
      method: "POST", // matches the POST route we mapped on the backend
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId, size, colorName })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to remove item from cart");
    }
    return data.data.cart;
  },

  /**
   * Merge guest local storage items with database cart.
   */
  async mergeCart(items, token) {
    const response = await fetch(`${BASE_URL}/merge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to merge carts");
    }
    return data.data.cart;
  },

  /**
   * Empty all items in the user's cart.
   */
  async clearCart(token) {
    const response = await fetch(BASE_URL, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to clear cart");
    }
    return data.data.cart;
  }
};
