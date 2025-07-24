import React from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShoppingListProvider } from './context/ShoppingListContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import MealPlannerPage from './pages/MealPlannerPage';
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import ShoppingListPage from './pages/ShoppingListPage';
import PartyPlannerPage from './pages/PartyPlannerPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShoppingListProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipes/:recipeId" element={<RecipeDetailsPage />} />
              <Route path="/meal-planner" element={<MealPlannerPage />} />
              <Route path="/party-planner" element={<PartyPlannerPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              {/* Add more routes for blog, etc. as needed */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Layout>
        </Router>
      </ShoppingListProvider>
    </AuthProvider>
  );
};

export default App;