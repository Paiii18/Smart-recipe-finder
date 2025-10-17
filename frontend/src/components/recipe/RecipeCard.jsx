import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import userService from '../../services/userService';

const RecipeCard = ({ recipe, userFavorites = [], onFavoriteUpdate }) => {
  const { isAuthenticated } = useAuthStore();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

    // Prevent double-click spam
    if (isProcessing) return;
    setIsProcessing(true);

    // ✅ OPTIMISTIC UPDATE: Update UI INSTANTLY
    const previousState = isFavorited;
    const newState = !isFavorited;
    setIsFavorited(newState);
    
    try {
      if (previousState) {
        // Was favorited, now remove
        await userService.removeFavorite(recipe.idMeal);
      } else {
        // Was not favorited, now add
        await userService.addFavorite({
          recipe_id: recipe.idMeal,
          recipe_name: recipe.strMeal,
          recipe_image: recipe.strMealThumb,
        });
      }
      
      // ✅ Notify parent with the action details (no re-fetch!)
      if (onFavoriteUpdate) {
        onFavoriteUpdate({
          action: newState ? 'add' : 'remove',
          recipe: {
            recipe_id: recipe.idMeal,
            recipe_name: recipe.strMeal,
            recipe_image: recipe.strMealThumb,
          }
        });
      }
    } catch (error) {
      // ❌ ROLLBACK on error
      console.error('Failed to update favorite:', error);
      setIsFavorited(previousState);
      alert(error.message || 'Failed to update favorite. Please try again.');
    } finally {
      setIsProcessing(false);
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
            disabled={isProcessing}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorited
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-200 ${
                isFavorited ? 'fill-current scale-110' : ''
              }`} 
            />
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