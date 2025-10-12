// File: src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../services/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const { user, access_token, refresh_token } = await authService.login(
            credentials
          );

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });

          return { success: false, error: error.message };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(userData);

          set({
            isLoading: false,
            error: null,
          });

          return { success: true, data: response };
        } catch (error) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });

          return { success: false, error: error.message };
        }
      },

      // Logout
      logout: () => {
        authService.logout();

        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Get current user (saat app load)
      getCurrentUser: async () => {
        // Check if token exists
        if (!authService.isAuthenticated()) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authService.getCurrentUser();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Token invalid or expired
          authService.logout();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Update user data
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      // Initialize auth on app load
      initializeAuth: async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
          await get().getCurrentUser();
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
