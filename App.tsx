
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Recipe, DietaryTag, CartItem, Ingredient, Cuisine, MealPlan, Day, Meal, DailyMeals } from './types';
import { recipes as allRecipes } from './services/recipeService';
import { getAIMealPlan } from './services/geminiService';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import RecipeDetailModal from './components/RecipeDetailModal';
import ShoppingCart from './components/ShoppingCart';
import RecipeSuggestion from './components/RecipeSuggestion';
import MealPlannerModal from './components/MealPlannerModal';
import { ShoppingCartIcon, CalendarIcon } from './components/icons';

const App: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>(allRecipes);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDietaryFilters, setActiveDietaryFilters] = useState<DietaryTag[]>([]);
    const [activeCuisineFilters, setActiveCuisineFilters] = useState<Cuisine[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMealPlannerOpen, setIsMealPlannerOpen] = useState(false);
    const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
        try {
            const savedPlan = localStorage.getItem('mealPlan');
            return savedPlan ? JSON.parse(savedPlan) : {};
        } catch (error) {
            console.error("Could not parse meal plan from localStorage", error);
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    }, [mealPlan]);

    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const matchesSearchTerm = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDietaryFilters = activeDietaryFilters.length === 0 ||
                activeDietaryFilters.every(filter => recipe.dietaryTags.includes(filter));

            const matchesCuisineFilters = activeCuisineFilters.length === 0 ||
                activeCuisineFilters.some(filter => recipe.cuisine.includes(filter));

            return matchesSearchTerm && matchesDietaryFilters && matchesCuisineFilters;
        });
    }, [recipes, searchTerm, activeDietaryFilters, activeCuisineFilters]);

    const handleDietaryFilterChange = (filter: DietaryTag) => {
        setActiveDietaryFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };
    
    const handleCuisineFilterChange = (filter: Cuisine) => {
        setActiveCuisineFilters(prev =>
            prev.includes(filter)
                ? prev.filter(c => c !== filter)
                : [...prev, filter]
        );
    };

    const addItemsToCart = useCallback((newItems: CartItem[]) => {
        setCartItems(prevItems => {
            const newCart = new Map<string, CartItem>();
    
            // Populate map with existing items, using name as key for aggregation
            prevItems.forEach(item => {
                newCart.set(item.name, { ...item });
            });
    
            // Process new items
            newItems.forEach(newItem => {
                if (newCart.has(newItem.name)) {
                    // Item exists, update it
                    const existingItem = newCart.get(newItem.name)!;
                    
                    // Assuming units are the same. A more complex app might need conversion.
                    existingItem.quantity += newItem.quantity;
                    existingItem.price += newItem.price;
    
                    // Use a Set to avoid duplicate recipe names
                    const recipeNames = new Set(existingItem.recipeName.split(', '));
                    recipeNames.add(newItem.recipeName);
                    existingItem.recipeName = Array.from(recipeNames).join(', ');
                } else {
                    // New item, add it to the map
                    newCart.set(newItem.name, { ...newItem });
                }
            });
    
            // Convert map back to an array for state
            return Array.from(newCart.values());
        });
    }, []);

    const handleAddToCart = useCallback((ingredients: Ingredient[], recipeName: string) => {
        const newItems: CartItem[] = ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            price: ing.quantity * ing.pricePerUnit,
            recipeName: recipeName,
        }));
        addItemsToCart(newItems);
    }, [addItemsToCart]);

    const handleRemoveFromCart = (itemName: string, recipeName: string) => {
        setCartItems(prev => prev.filter(item => !(item.name === itemName && item.recipeName.includes(recipeName.split(', ')[0]))));
    };

    const handleClearCart = () => {
        setCartItems([]);
    };
    
    const handleUpdateMealPlan = (day: Day, meal: Meal, recipeId: number | null) => {
        setMealPlan(prev => {
            const newPlan = { ...prev };
            if (!newPlan[day]) {
                newPlan[day] = {
                    breakfast: { recipeId: null },
                    lunch: { recipeId: null },
                    dinner: { recipeId: null },
                };
            }
            (newPlan[day] as DailyMeals)[meal].recipeId = recipeId;
            return newPlan;
        });
    };

    const handleGenerateAIMealPlan = async (preferences: string) => {
        const recipeNames = recipes.map(r => r.name);
        const aiPlan = await getAIMealPlan(preferences, recipeNames);
        if (aiPlan) {
            const newMealPlan: MealPlan = {};
            const days = Object.keys(aiPlan) as Day[];
            for(const day of days) {
                if (aiPlan[day]) {
                    newMealPlan[day] = {
                        breakfast: { recipeId: recipes.find(r => r.name === aiPlan[day]!.breakfast)?.id || null },
                        lunch: { recipeId: recipes.find(r => r.name === aiPlan[day]!.lunch)?.id || null },
                        dinner: { recipeId: recipes.find(r => r.name === aiPlan[day]!.dinner)?.id || null }
                    };
                }
            }
            setMealPlan(newMealPlan);
        }
    };
    
    const handleAddMealPlanToCart = () => {
        let allIngredients: {ing: Ingredient, name: string}[] = [];
        
        Object.values(mealPlan).forEach(day => {
            Object.values(day).forEach(mealSlot => {
                if (mealSlot.recipeId) {
                    const recipe = recipes.find(r => r.id === mealSlot.recipeId);
                    if (recipe) {
                        recipe.ingredients.forEach(ing => {
                           allIngredients.push({ing, name: recipe.name});
                        });
                    }
                }
            });
        });

        const newItems: CartItem[] = allIngredients.map(item => ({
            name: item.ing.name,
            quantity: item.ing.quantity,
            unit: item.ing.unit,
            price: item.ing.quantity * item.ing.pricePerUnit,
            recipeName: item.name,
        }));

        addItemsToCart(newItems);
        setIsMealPlannerOpen(false);
        setIsCartOpen(true);
    };

    const handleUpdateRating = (recipeId: number, userRating: number) => {
        setRecipes(prevRecipes =>
            prevRecipes.map(recipe => {
                if (recipe.id === recipeId) {
                    const totalRating = recipe.rating * recipe.numberOfRatings;
                    const newNumberOfRatings = recipe.numberOfRatings + 1;
                    const newAverageRating = (totalRating + userRating) / newNumberOfRatings;
                    const updatedRecipe = { 
                      ...recipe, 
                      rating: newAverageRating, 
                      numberOfRatings: newNumberOfRatings 
                    };
                    // Also update the selected recipe if it's the one being rated
                    if (selectedRecipe && selectedRecipe.id === recipeId) {
                        setSelectedRecipe(updatedRecipe);
                    }
                    return updatedRecipe;
                }
                return recipe;
            })
        );
    };


    useEffect(() => {
        if (selectedRecipe || isCartOpen || isMealPlannerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedRecipe, isCartOpen, isMealPlannerOpen]);

    return (
        <>
            <div className="min-h-screen bg-brand-bg">
                <header className="bg-white shadow-md p-4 sticky top-0 z-20 flex justify-between items-center">
                    <div className="text-2xl md:text-3xl font-bold text-brand-text font-serif">
                       <span className="text-brand-primary">Veg</span>Indian<span className="text-brand-secondary">Recipes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsMealPlannerOpen(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Open Meal Planner">
                            <CalendarIcon className="w-7 h-7 text-gray-700"/>
                        </button>
                        <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Open Shopping Cart">
                            <ShoppingCartIcon className="w-7 h-7 text-gray-700"/>
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-brand-accent text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                <main className="container mx-auto p-4 md:p-8">
                    <RecipeSuggestion recipes={recipes} onSelectRecipe={setSelectedRecipe} />
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        activeDietaryFilters={activeDietaryFilters}
                        onDietaryFilterChange={handleDietaryFilterChange}
                        activeCuisineFilters={activeCuisineFilters}
                        onCuisineFilterChange={handleCuisineFilterChange}
                    />
                    {filteredRecipes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredRecipes.map(recipe => (
                              <RecipeCard key={recipe.id} recipe={recipe} onSelect={setSelectedRecipe} />
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-700">No Recipes Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                      </div>
                    )}
                </main>

                <footer className="text-center p-4 mt-8 text-gray-500 text-sm border-t border-gray-200">
                    <p>&copy; {new Date().getFullYear()} Vegetarian Indian Recipe Hub. All rights reserved.</p>
                </footer>
            </div>

            <RecipeDetailModal
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                onAddToCart={(ingredients) => selectedRecipe && handleAddToCart(ingredients, selectedRecipe.name)}
                onUpdateRating={handleUpdateRating}
            />
            
            <MealPlannerModal
                isOpen={isMealPlannerOpen}
                onClose={() => setIsMealPlannerOpen(false)}
                recipes={recipes}
                mealPlan={mealPlan}
                onUpdateMealPlan={handleUpdateMealPlan}
                onGeneratePlan={handleGenerateAIMealPlan}
                onAddToCart={handleAddMealPlanToCart}
            />

            <ShoppingCart 
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </>
    );
};

export default App;
