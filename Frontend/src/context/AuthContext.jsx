import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleClientId, setGoogleClientId] = useState(null);

  // Load Google configuration on mount
  useEffect(() => {
    const fetchGoogleConfig = async () => {
      try {
        const config = await authService.getGoogleConfig();
        setGoogleClientId(config.googleClientId);
      } catch (err) {
        console.error("Failed to load Google OAuth configuration:", err.message);
      }
    };
    fetchGoogleConfig();
  }, []);

  // Initialize session and restore user from backend on mount/refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const localToken = localStorage.getItem("fh_access_token");
        if (localToken) {
          try {
            // 1. Attempt to fetch profile using existing access token
            const user = await authService.getMe(localToken);
            setCurrentUser(user);
            setLoading(false);
            return;
          } catch (err) {
            console.log("Access token expired/invalid, attempting token refresh...");
          }
        }

        // 2. Access token is missing or expired, attempt refresh via HTTP-only cookie
        const newAccessToken = await authService.refreshToken();
        localStorage.setItem("fh_access_token", newAccessToken);
        const user = await authService.getMe(newAccessToken);
        setCurrentUser(user);
      } catch (err) {
        console.log("No active backend authentication session found:", err.message);
        localStorage.removeItem("fh_access_token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in credentials async.
   */
  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      localStorage.setItem("fh_access_token", res.accessToken);
      setCurrentUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  /**
   * Register new user profile async.
   */
  const register = async (name, email, password) => {
    try {
      const res = await authService.register(name, email, password);
      localStorage.setItem("fh_access_token", res.accessToken);
      setCurrentUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  /**
   * Log out active session async.
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem("fh_access_token");
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      console.error("Logout request error:", err.message);
    } finally {
      // Always clear local session variables
      localStorage.removeItem("fh_access_token");
      setCurrentUser(null);
    }
  };

  /**
   * Log in / Register using Google access token.
   */
  const loginWithGoogle = async (googleAccessToken) => {
    try {
      const res = await authService.googleLogin(googleAccessToken);
      localStorage.setItem("fh_access_token", res.accessToken);
      setCurrentUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loginWithGoogle,
    googleClientId,
    isAdmin: currentUser?.role === "admin",
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
