export enum DietaryTag {
  VEGAN = 'Vegan',
  GLUTEN_FREE = 'Gluten-Free',
  NUT_FREE = 'Nut-Free',
  JAIN = 'Jain',
  QUICK = 'Quick < 30min'
}

export enum Cuisine {
    PUNJABI = 'Punjabi',
    SOUTH_INDIAN = 'South Indian',
    GUJARATI = 'Gujarati',
    MAHARASHTRIAN = 'Maharashtrian',
    RAJASTHANI = 'Rajasthani',
    INDO_CHINESE = 'Indo-Chinese',
    KIDS = "Kid's Friendly",
    SANDWICH = 'Sandwich',
    MUGHLAI = 'Mughlai',
    JAIN = 'Jain',
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  caloriesPerUnit: number;
  pricePerUnit: number;
}

export interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  totalTimeInMinutes?: number;
  servings: number;
  caloriesPerServing: number;
  dietaryTags: DietaryTag[];
  cuisine: Cuisine[];
  rating: number; // out of 5
  numberOfRatings: number;
}

export interface CartItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  recipeName: string;
}

export type Meal = 'breakfast' | 'lunch' | 'dinner';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface MealSlot {
  recipeId: number | null;
}

export interface DailyMeals {
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
}

export type MealPlan = {
  [key in Day]?: DailyMeals;
};