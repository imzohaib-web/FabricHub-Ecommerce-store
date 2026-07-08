const BASE_URL = "http://localhost:5000/api/v1/orders";

/**
 * Service to interact with the backend Orders API.
 */
export const orderService = {
  /**
   * Submit checkout order creation details.
   */
  async createOrder(customerName, customerEmail, shippingDetails, token) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ customerName, customerEmail, shippingDetails })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to place order.");
    }
    return data.data.order; // Returns { orderId, totalAmount, ... }
  },

  /**
   * Fetch logged-in user's order history.
   */
  async fetchMyOrders(token) {
    const response = await fetch(`${BASE_URL}/my-orders`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch order history.");
    }
    return data.data.orders; // Array of orders
  },

  /**
   * Fetch single order details by id or orderId.
   */
  async fetchOrderDetails(orderId, token) {
    const response = await fetch(`${BASE_URL}/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch order details.");
    }
    return data.data.order;
  },

  /**
   * Admin: Fetch all orders across the platform.
   */
  async fetchAllOrders(token) {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders.");
    }
    return data.data.orders; // Array of all orders
  },

  /**
   * Admin: Update fulfillment status or payment status of an order.
   */
  async updateOrderStatus(orderId, status, paymentStatus, token) {
    const response = await fetch(`${BASE_URL}/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status, paymentStatus })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update order status.");
    }
    return data.data.order;
  }
};
