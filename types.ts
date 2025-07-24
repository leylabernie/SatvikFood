
export enum RecipeCategory {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snacks = 'Snacks',
  Sandwich = 'Sandwich',
}

export enum Cuisine {
  Punjabi = 'Punjabi',
  SouthIndian = 'South Indian',
  Bengali = 'Bengali',
  Gujarati = 'Gujarati',
  Rajasthani = 'Rajasthani',
  Maharashtrian = 'Maharashtrian',
  IndianFusion = 'Indian Fusion',
  Sandwich = 'Sandwich',
}

export enum Dietary {
    Jain = 'Jain',
    Swaminarayan = 'Swaminarayan',
    Farali = 'Farali', // Fasting
    Vegan = 'Vegan',
    GlutenFree = 'Gluten-Free',
    KidFriendly = 'Kid-Friendly',
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface ShoppingListItem extends Ingredient {
  id: string; // Unique ID for stable list operations
  checked: boolean;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // e.g., 1-5
  comment: string;
  date: string; // e.g., "2023-10-27"
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  cuisine: Cuisine;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
  imageUrl: string;
  dietary?: Dietary[];
  reviews?: Review[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  provider: string;
  type: 'Cooking Class' | 'Meal Prep' | 'Nutrition Consultation';
  price: string;
  imageUrl: string;
}

export interface User {
  name: string;
  email: string;
  isPremium: boolean;
}

export interface GeneratedRecipe {
    recipeName: string;
    description: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    ingredients: string[];
    instructions: string[];
}