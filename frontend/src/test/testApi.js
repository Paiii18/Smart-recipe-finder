import recipeService from '../services/recipeService';
import authService from '../services/authService';

// Test TheMealDB API (tidak perlu backend)
export const testRecipeService = async () => {
  console.log('🧪 Testing Recipe Service...');
  
  try {
    // Test search
    const searchResults = await recipeService.searchByName('chicken');
    console.log('✅ Search results:', searchResults.length, 'recipes found');
    
    // Test random recipe
    const randomRecipe = await recipeService.getRandom();
    console.log('✅ Random recipe:', randomRecipe?.strMeal);
    
    // Test categories
    const categories = await recipeService.getCategories();
    console.log('✅ Categories:', categories.length, 'categories found');
    
    return true;
  } catch (error) {
    console.error('❌ Recipe Service Error:', error.message);
    return false;
  }
};

// Test Auth Service (perlu backend running)
export const testAuthService = async () => {
  console.log('🧪 Testing Auth Service...');
  
  try {
    // Check if authenticated
    const isAuth = authService.isAuthenticated();
    console.log('✅ Is Authenticated:', isAuth);
    
    return true;
  } catch (error) {
    console.error('❌ Auth Service Error:', error.message);
    return false;
  }
};