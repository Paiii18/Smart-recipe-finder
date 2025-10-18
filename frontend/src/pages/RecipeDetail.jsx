import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Clock, Users, ChefHat, Loader2 } from "lucide-react";
import recipeService from "../services/recipeService";
import userService from "../services/userService";
import useAuthStore from "../store/authStore";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecipe();
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated]);

  // ✅ Optimized: Use /check endpoint instead of fetching all favorites
  const checkFavoriteStatus = async () => {
    try {
      const result = await userService.isFavorite(id);
      setIsFavorited(result);
    } catch (err) {
      console.error("Failed to check favorite:", err);
      // Fallback: if isFavorite endpoint fails, try getting all favorites
      try {
        const favorites = await userService.getFavorites();
        const found = favorites.some((fav) => fav.recipe_id === id);
        setIsFavorited(found);
      } catch (fallbackErr) {
        console.error("Fallback check also failed:", fallbackErr);
      }
    }
  };

  const loadRecipe = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await recipeService.getById(id);
      if (!data) {
        setError("Recipe not found");
        return;
      }
      setRecipe(data);
    } catch (err) {
      setError("Failed to load recipe");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ OPTIMISTIC UPDATE: Update UI first, API in background
  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      alert("Please login to save favorites");
      return;
    }

    // Prevent double-click spam
    if (isProcessing) return;
    setIsProcessing(true);

    // ✅ OPTIMISTIC: Update UI INSTANTLY
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
    } catch (error) {
      // ❌ ROLLBACK on error
      console.error("Failed to update favorite:", error);
      setIsFavorited(previousState);
      alert(error.message || "Failed to update favorite. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Parse ingredients
  const getIngredients = () => {
    if (!recipe) return [];

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }
    return ingredients;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 text-lg mb-4">
          {error || "Recipe not found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const ingredients = getIngredients();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {isAuthenticated && (
          <div className="absolute top-6 right-6">
            <button
              onClick={handleFavoriteClick}
              disabled={isProcessing}
              className={`p-3 rounded-full transition-all duration-200 ${
                isFavorited
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/90 text-gray-800 hover:bg-white hover:scale-110"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-6 h-6 transition-all duration-200 ${
                  isFavorited ? "fill-current scale-110" : ""
                }`}
              />
            </button>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {recipe.strMeal}
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold">
              {recipe.strCategory}
            </span>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
              {recipe.strArea}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-green-600" />
                Ingredients
              </h2>
              <ul className="space-y-3">
                {ingredients.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <span className="font-semibold">{item.measure}</span>{" "}
                      {item.ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Instructions
              </h2>
              <div className="prose prose-green max-w-none">
                {recipe.strInstructions.split("\n").map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p
                        key={index}
                        className="text-gray-700 mb-4 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    )
                )}
              </div>
            </div>

            {/* Video */}
            {recipe.strYoutube && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Video Tutorial
                </h2>
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${
                      recipe.strYoutube.split("v=")[1]
                    }`}
                    title="Recipe Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;