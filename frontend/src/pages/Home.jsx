import { useState, useEffect } from 'react';
import { Search, Loader2, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // ← STEP 1: Import hook
import recipeService from '../services/recipeService';
import userService from '../services/userService';
import RecipeCard from '../components/recipe/RecipeCard';
import useAuthStore from '../store/authStore';

const Home = () => {
  const { t } = useTranslation(); // ← STEP 2: Initialize hook
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    loadCategories();
    loadRandomRecipes();
    if (isAuthenticated) {
      loadUserFavorites();
    }
  }, [isAuthenticated]);

  const loadUserFavorites = async () => {
    try {
      const data = await userService.getFavorites();
      setUserFavorites(data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await recipeService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadRandomRecipes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const randomRecipes = [];
      const seenIds = new Set();
      
      while (randomRecipes.length < 6) {
        const recipe = await recipeService.getRandom();
        if (recipe && !seenIds.has(recipe.idMeal)) {
          randomRecipes.push(recipe);
          seenIds.add(recipe.idMeal);
        }
      }
      
      setRecipes(randomRecipes);
    } catch (err) {
      setError(t('home.loadError')); // ← STEP 3: Replace text
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');
    setSelectedCategory('');

    try {
      const results = await recipeService.searchByName(searchQuery);
      if (results.length === 0) {
        setError(t('home.noResults')); // ← Replace text
      }
      setRecipes(results);
    } catch (err) {
      setError(t('home.searchFailed')); // ← Replace text
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setIsLoading(true);
    setError('');

    try {
      const results = await recipeService.filterByCategory(category);
      setRecipes(results);
    } catch (err) {
      setError(t('home.categoryLoadFailed')); // ← Replace text
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    loadRandomRecipes();
  };

  const handleFavoriteUpdate = () => {
    if (isAuthenticated) {
      loadUserFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-4 sm:mb-6">
              <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t('home.heroTitle')} {/* ← Translated */}
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-6 sm:mb-8">
              {t('home.subtitle')} {/* ← Translated */}
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('home.searchPlaceholder')} // ← Translated
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-14 text-gray-800 rounded-full focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg text-sm sm:text-base"
                />
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 sm:p-3 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  aria-label={t('home.searchButton')}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Categories & Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Categories */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {t('home.categories')} {/* ← Translated */}
            </h2>
            {(selectedCategory || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {t('home.clearFilters')} {/* ← Translated */}
              </button>
            )}
          </div>

          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat.idCategory}
                  onClick={() => handleCategoryClick(cat.strCategory)}
                  className={`px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition text-sm sm:text-base ${
                    selectedCategory === cat.strCategory
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.strCategory}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            {selectedCategory
              ? `${selectedCategory} ${t('home.recipes')}`
              : searchQuery
              ? `${t('home.searchResultsFor')} "${searchQuery}"`
              : t('home.featuredRecipes')} {/* ← Translated */}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 animate-spin mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">
                {t('home.loading')} {/* ← Translated */}
              </p>
            </div>
          ) : recipes.length === 0 && !error ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-gray-600 text-base sm:text-lg">
                {t('home.noRecipes')} {/* ← Translated */}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.idMeal} 
                  recipe={recipe}
                  userFavorites={userFavorites}
                  onFavoriteUpdate={handleFavoriteUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;