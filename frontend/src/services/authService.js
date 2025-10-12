// ===== FILE 2: src/services/authService.js =====
// Authentication API calls
import api from "./api";

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log("🔍 Login request:", credentials);
      console.log("🔍 API URL:", api.defaults.baseURL);

      const response = await api.post("/auth/login", credentials);
      console.log("✅ Login response:", response.data);

      const { access_token, refresh_token, user } = response.data;

      // Save tokens to localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      return { user, access_token, refresh_token };
    } catch (error) {
      console.error("❌ Full error object:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error data:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error message:", error.message);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      throw { message: errorMessage, status: error.response?.status };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get user" };
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      return access_token;
    } catch (error) {
      throw error.response?.data || { message: "Token refresh failed" };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },
};

export default authService;
