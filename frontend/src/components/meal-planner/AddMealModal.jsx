// File: src/components/meal-planner/AddMealModal.jsx
import { useState, useEffect } from 'react';
import { X, Search, Loader2, Heart } from 'lucide-react';
import { format } from 'date-fns';
import recipeService from '../../services/recipeService';
import userService from '../../services/userService';

const AddMealModal = ({ isOpen, onClose, selectedDate, mealType, onMealAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'favorites'
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = async () => {
    try {
      const data = await userService.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await recipeService.searchByName(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMeal = async (recipe) => {
    setIsAdding(true);
    try {
      await userService.addMealPlan({
        recipe_id: recipe.idMeal || recipe.recipe_id,
        recipe_name: recipe.strMeal || recipe.recipe_name,
        recipe_image: recipe.strMealThumb || recipe.recipe_image,
        planned_date: format(selectedDate, 'yyyy-MM-dd'),
        meal_type: mealType,
      });
      
      onMealAdded();
      onClose();
    } catch (err) {
      console.error('Failed to add meal:', err);
      alert(err.message || 'Failed to add meal to planner');
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-800">Add Meal</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <p className="text-gray-600">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')} - {mealType}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-6 py-3 font-semibold transition ${
              activeTab === 'search'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Search Recipes
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 px-6 py-3 font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'favorites'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            My Favorites
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'search' ? (
            <div>
              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for recipes..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {searchResults.map((recipe) => (
                    <RecipeItem
                      key={recipe.idMeal}
                      recipe={recipe}
                      onAdd={handleAddMeal}
                      isAdding={isAdding}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery ? 'No recipes found' : 'Search for recipes to add to your meal plan'}
                </div>
              )}
            </div>
          ) : (
            <div>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {favorites.map((favorite) => (
                    <RecipeItem
                      key={favorite.id}
                      recipe={favorite}
                      onAdd={handleAddMeal}
                      isAdding={isAdding}
                      isFavorite
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No favorite recipes yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Recipe Item Component
const RecipeItem = ({ recipe, onAdd, isAdding, isFavorite = false }) => {
  const recipeName = isFavorite ? recipe.recipe_name : recipe.strMeal;
  const recipeImage = isFavorite ? recipe.recipe_image : recipe.strMealThumb;
  const recipeCategory = recipe.strCategory;

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-green-300 transition">
      <img
        src={recipeImage}
        alt={recipeName}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{recipeName}</h4>
        {recipeCategory && (
          <span className="text-sm text-gray-600">{recipeCategory}</span>
        )}
      </div>
      <button
        onClick={() => onAdd(recipe)}
        disabled={isAdding}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isAdding ? 'Adding...' : 'Add'}
      </button>
    </div>
  );
};

export default AddMealModal;