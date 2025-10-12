// File: src/pages/MealPlanner.jsx
import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import {
  Calendar,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import userService from "../services/userService";
import AddMealModal from "../components/meal-planner/AddMealModal";

const MealPlanner = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [mealPlans, setMealPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );
  const mealTypes = ["breakfast", "lunch", "dinner"];

  // Emoji icons for meal types
  const mealIcons = {
    breakfast: "🍳",
    lunch: "🍽️",
    dinner: "🍕"
  };

  useEffect(() => {
    loadMealPlans();
  }, [currentWeekStart]);

  const loadMealPlans = async () => {
    setIsLoading(true);
    try {
      const startDate = format(currentWeekStart, "yyyy-MM-dd");
      const endDate = format(addDays(currentWeekStart, 6), "yyyy-MM-dd");
      const data = await userService.getMealPlans(startDate, endDate);
      setMealPlans(data);
    } catch (err) {
      console.error("Failed to load meal plans:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleAddMeal = (date, mealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setShowAddModal(true);
  };

  const handleMealAdded = () => {
    loadMealPlans();
  };

  const getMealsForDateAndType = (date, mealType) => {
    return mealPlans.filter(
      (plan) =>
        isSameDay(parseISO(plan.planned_date), date) &&
        plan.meal_type === mealType
    );
  };

  const handleDeleteMeal = async (planId) => {
    if (!confirm("Remove this meal from your plan?")) return;

    try {
      await userService.deleteMealPlan(planId);
      setMealPlans(mealPlans.filter((plan) => plan.id !== planId));
    } catch (err) {
      console.error("Failed to delete meal plan:", err);
      alert("Failed to remove meal");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
              Meal Planner
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Plan your meals for the week
          </p>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>

            <h2 className="text-base sm:text-xl font-bold text-gray-800 text-center">
              {format(currentWeekStart, "MMM d")} -{" "}
              {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
            </h2>

            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Desktop View - Calendar Grid (Hidden on mobile) */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Row - Days */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-gray-50 font-semibold text-gray-700">
              Meal Type
            </div>
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className={`p-4 text-center ${
                  isSameDay(day, new Date())
                    ? "bg-green-100 font-bold text-green-700"
                    : "bg-gray-50 font-semibold text-gray-700"
                }`}
              >
                <div className="text-sm">{format(day, "EEE")}</div>
                <div className="text-lg">{format(day, "d")}</div>
              </div>
            ))}
          </div>

          {/* Meal Rows */}
          {mealTypes.map((mealType) => (
            <div
              key={mealType}
              className="grid grid-cols-8 border-b border-gray-200 last:border-b-0"
            >
              {/* Meal Type Label */}
              <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-center">
                <span className="font-semibold text-gray-700 capitalize">
                  {mealIcons[mealType]} {mealType}
                </span>
              </div>

              {/* Day Cells */}
              {weekDays.map((day) => {
                const meals = getMealsForDateAndType(day, mealType);

                return (
                  <div
                    key={`${day}-${mealType}`}
                    className="p-3 border-r border-gray-200 last:border-r-0 min-h-[120px] hover:bg-gray-50 transition"
                  >
                    {meals.length > 0 ? (
                      <div className="space-y-2">
                        {meals.map((meal) => (
                          <div
                            key={meal.id}
                            className="bg-green-50 border border-green-200 rounded-lg p-2 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-medium text-gray-800 line-clamp-2 flex-1">
                                {meal.recipe_name}
                              </span>
                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-100 rounded"
                                aria-label="Delete meal"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMeal(day, mealType)}
                        className="w-full h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        aria-label={`Add ${mealType} for ${format(day, "EEE")}`}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Mobile & Tablet View - Card Layout (Visible only on mobile/tablet) */}
        <div className="lg:hidden space-y-3">
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                isSameDay(day, new Date()) ? "ring-2 ring-green-500" : ""
              }`}
            >
              {/* Date Header */}
              <div
                className={`p-3 sm:p-4 ${
                  isSameDay(day, new Date())
                    ? "bg-green-50"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 uppercase">
                      {format(day, "EEEE")}
                    </p>
                    <p
                      className={`text-lg sm:text-xl font-bold ${
                        isSameDay(day, new Date())
                          ? "text-green-700"
                          : "text-gray-800"
                      }`}
                    >
                      {format(day, "MMMM d, yyyy")}
                    </p>
                  </div>
                  {isSameDay(day, new Date()) && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                      Today
                    </span>
                  )}
                </div>
              </div>

              {/* Meals for this day */}
              <div className="p-3 sm:p-4 space-y-4">
                {mealTypes.map((mealType) => {
                  const meals = getMealsForDateAndType(day, mealType);

                  return (
                    <div
                      key={mealType}
                      className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-700 text-sm sm:text-base capitalize">
                          {mealIcons[mealType]} {mealType}
                        </h3>
                        <button
                          onClick={() => handleAddMeal(day, mealType)}
                          className="p-1.5 sm:p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                          aria-label={`Add ${mealType}`}
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {meals.length > 0 ? (
                        <div className="space-y-2">
                          {meals.map((meal) => (
                            <div
                              key={meal.id}
                              className="flex items-center gap-3 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              {meal.recipe_image && (
                                <img
                                  src={meal.recipe_image}
                                  alt={meal.recipe_name}
                                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
                                  {meal.recipe_name}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded transition flex-shrink-0"
                                aria-label="Delete meal"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-500 italic">
                            No meal planned
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Meal Modal */}
        <AddMealModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          selectedDate={selectedDate}
          mealType={selectedMealType}
          onMealAdded={handleMealAdded}
        />
      </div>
    </div>
  );
};

export default MealPlanner;