// ===== FILE 3: src/services/recipeService.js =====
// TheMealDB API calls
import axios from 'axios';

const MEALDB_API_URL = import.meta.env.VITE_MEALDB_API_URL || 'https://www.themealdb.com/api/json/v1/1';

const recipeService = {
  // Search recipes by name
  searchByName: async (query) => {
    try {
      const response = await axios.get(`${MEALDB_API_URL}/search.php?s=${query}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search recipes');
    }
  },

  // Get recipe by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${MEALDB_API_URL}/lookup.php?i=${id}`);
      return response.data.meals?.[0] || null;
    } catch (error) {
      console.error('Get recipe error:', error);
      throw new Error('Failed to get recipe details');
    }
  },

  // Get random recipe
  getRandom: async () => {
    try {
      const response = await axios.get(`${MEALDB_API_URL}/random.php`);
      return response.data.meals?.[0] || null;
    } catch (error) {
      console.error('Get random recipe error:', error);
      throw new Error('Failed to get random recipe');
    }
  },

  // Filter by category
  filterByCategory: async (category) => {
    try {
      const response = await axios.get(`${MEALDB_API_URL}/filter.php?c=${category}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Filter error:', error);
      throw new Error('Failed to filter recipes');
    }
  },

  // Filter by area/cuisine
  filterByArea: async (area) => {
    try {
      const response = await axios.get(`${MEALDB_API_URL}/filter.php?a=${area}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Filter error:', error);
      throw new Error('Failed to filter recipes by area');
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${MEALDB_API_URL}/categories.php`);
      return response.data.categories || [];
    } catch (error) {
      console.error('Get categories error:', error);
      throw new Error('Failed to get categories');
    }
  },

  // Get all areas/cuisines
  getAreas: async () => {
    try {
      const response = await axios.get(`${MEALDB_API_URL}/list.php?a=list`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Get areas error:', error);
      throw new Error('Failed to get areas');
    }
  },
};

export default recipeService;