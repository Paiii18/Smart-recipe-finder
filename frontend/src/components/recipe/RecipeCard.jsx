import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import userService from '../../services/userService';

const RecipeCard = ({ recipe, userFavorites = [], onFavoriteUpdate }) => {
  const { isAuthenticated } = useAuthStore();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check dari userFavorites prop
  useEffect(() => {
    const found = userFavorites.some(fav => fav.recipe_id === recipe.idMeal);
    setIsFavorited(found);
  }, [userFavorites, recipe.idMeal]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to save favorites');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isFavorited) {
        await userService.removeFavorite(recipe.idMeal);
        setIsFavorited(false);
      } else {
        await userService.addFavorite({
          recipe_id: recipe.idMeal,
          recipe_name: recipe.strMeal,
          recipe_image: recipe.strMealThumb,
        });
        setIsFavorited(true);
      }
      
      // Notify parent to reload favorites
      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
      alert(error.message || 'Failed to update favorite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      to={`/recipe/${recipe.idMeal}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            } disabled:opacity-50`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        )}

        {recipe.strCategory && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
              {recipe.strCategory}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition">
          {recipe.strMeal}
        </h3>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-green-600 font-semibold text-sm group-hover:text-green-700">
            View Recipe →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;