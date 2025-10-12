// File: src/pages/Favorites.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Loader2, HeartOff } from "lucide-react";
import userService from "../services/userService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await userService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError("Failed to load favorites");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favorite) => {
    // Pass whole favorite object
    if (!confirm("Remove this recipe from favorites?")) return;

    setDeletingId(favorite.id);

    try {
      await userService.removeFavorite(favorite.recipe_id); // Use recipe_id instead of favorite.id
      setFavorites(favorites.filter((fav) => fav.id !== favorite.id));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      alert("Failed to remove favorite");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-gray-800">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? "recipe" : "recipes"}{" "}
            saved
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <HeartOff className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding recipes to your favorites to see them here
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <Link to={`/recipe/${favorite.recipe_id}`}>
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={favorite.recipe_image}
                      alt={favorite.recipe_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                      {favorite.recipe_name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                      Added {new Date(favorite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                {/* Remove Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleRemoveFavorite(favorite)}
                    disabled={deletingId === favorite.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === favorite.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
