// ===== FILE 4: src/services/userService.js =====
// User-related API calls (favorites, meal plans)
import api from "./api";

const userService = {
  // ========== FAVORITES ==========

  // Get user's favorites
  getFavorites: async () => {
    try {
      const response = await api.get("/favorites/"); // Tambah trailing slash
      return response.data.data; // Backend return { data: [...] }
    } catch (error) {
      throw error.response?.data || { message: "Failed to get favorites" };
    }
  },

   // Check if recipe is favorited
  isFavorite: async (recipeId) => {
    try {
      const response = await api.get(`/favorites/check/${recipeId}`);
      return response.data.is_favorite;
    } catch (error) {
      throw error.response?.data || { message: "Failed to Check Favorite"};
    }
  },

  // Add recipe to favorites
  addFavorite: async (recipeData) => {
    try {
      const response = await api.post("/favorites/add", recipeData); // Ubah ke /add
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to add favorite" };
    }
  },

  // Remove recipe from favorites
  removeFavorite: async (recipeId) => {
    // Parameter ubah jadi recipeId
    try {
      const response = await api.delete(`/favorites/remove/${recipeId}`); // Ubah ke /remove/
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to remove favorite" };
    }
  },

 

  // ========== MEAL PLANS ==========

  // Get user's meal plans
  getMealPlans: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get("/meal-plans", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get meal plans" };
    }
  },

  // Add meal plan
  addMealPlan: async (mealPlanData) => {
    try {
      const response = await api.post("/meal-plans", mealPlanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to add meal plan" };
    }
  },

  // Update meal plan
  updateMealPlan: async (planId, mealPlanData) => {
    try {
      const response = await api.put(`/meal-plans/${planId}`, mealPlanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update meal plan" };
    }
  },

  // Delete meal plan
  deleteMealPlan: async (planId) => {
    try {
      const response = await api.delete(`/meal-plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete meal plan" };
    }
  },

  // Get meal plans by date
  getMealPlansByDate: async (date) => {
    try {
      const response = await api.get(`/meal-plans/date/${date}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to get meal plans for date" }
      );
    }
  },
};

// Profile API
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/profile/password', passwordData);
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await api.delete('/profile', { data: { password } });
  return response.data;
};

export default userService;
