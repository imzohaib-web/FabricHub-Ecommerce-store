const BASE_URL = "http://localhost:5000/api/v1/auth";

/**
 * Authentication service wrapping full-stack integration APIs.
 * Utilizes fetch with credentials: "include" to enable refresh token cookies.
 */
export const authService = {
  /**
   * Register a new user profile on the backend
   */
  async register(name, email, password) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // Required to receive HTTP-only cookies cross-origin
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data; // { accessToken, data: { user } }
  },

  /**
   * Login credentials validation
   */
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // Required to receive HTTP-only cookies cross-origin
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data; // { accessToken, data: { user } }
  },

  /**
   * Log out active session
   */
  async logout(token) {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      credentials: "include" // Required to clear/send HTTP-only cookies cross-origin
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Logout failed");
    }
    return true;
  },

  /**
   * Retrieve current user profile details
   */
  async getMe(token) {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to retrieve user profile");
    }
    return data.data.user;
  },

  /**
   * Refresh access token via HTTP-only refresh token cookie
   */
  async refreshToken() {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: "POST",
      credentials: "include" // Send current refresh token cookie
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Session expired");
    }
    return data.accessToken;
  }
};
