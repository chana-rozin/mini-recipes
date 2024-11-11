"use client";

import React, { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import styles from './page.module.css';
import Card from '@/components/Card/Card';
import PopUpCard from '@/components/PopUpCard/PopUpCard';
import http from '@/services/http';
import { useRouter } from 'next/navigation';
import { getFavorites, toggleFavorite as toggleFavoriteInLS } from '@/services/localStorage';

const RecipePage = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<null | any>(null);

  const router = useRouter();

  // Fetch all recipes and categories when the component mounts
  useEffect(() => {
    fetchCategories();
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    if (showFavorites) {
      fetchFavoriteRecipes();  // Fetch favorite recipes when showing favorites
    } else {
      fetchRecipes();  // Fetch all recipes when not showing favorites
    }
  }, [showFavorites, favorites]);

  const fetchRecipes = async () => {
    try {
      const response = await http.get("/recipes");
      const recipesWithId = response.data.map((recipe: any) => ({
        ...recipe,
        id: recipe._id,
      }));
      setRecipes(recipesWithId);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchFavoriteRecipes = async () => {
    try {
      const favoriteRecipes = await Promise.all(
        favorites.map((favoriteId) =>
          http.get(`/recipes/${favoriteId}`).then((response) => response.data)
        )
      );
      const recipesWithId = favoriteRecipes.map((recipe: any) => ({
        ...recipe,
        id: recipe._id,
      }));
      setRecipes(recipesWithId);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await http.get('/categories');
      const categories = response.data.data.documents;
      const options = categories.map((category: any) => ({
        value: category.name,
        label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
      }));
      setCategoryOptions(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch recipes based on search query or selected categories
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      try {
        if (searchQuery) {
          const response = await http.get(`/recipes?search=${searchQuery}`);
          const recipesWithId = response.data.map((recipe: any) => ({
            ...recipe,
            id: recipe._id,
          }));
          setRecipes(recipesWithId);
          setSelectedCategories([]); // Clear categories when searching
        } else if (selectedCategories.length > 0) {
          const response = await http.get(`/recipes?category=${selectedCategories.join(',')}`);
          const recipesWithId = response.data.map((recipe: any) => ({
            ...recipe,
            id: recipe._id,
          }));
          setRecipes(recipesWithId);
          setSearchQuery(""); // Clear search when filtering by categories
        } else {
          fetchRecipes(); // Fetch all recipes if no filters are applied
        }
      } catch (error) {
        console.error("Error fetching filtered recipes:", error);
      }
    };

    fetchFilteredRecipes();
  }, [searchQuery, selectedCategories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Set search query and clear categories
  };

  const handleCategoryChange = (selectedOptions: MultiValue<{ value: string; label: string; }>) => {
    const categories = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedCategories(categories); // Set selected categories and clear search query
  };

  const handleToggleFavorite = (id: string) => {
    const updatedFavorites = toggleFavoriteInLS(id); 
    setFavorites(updatedFavorites); 
  };

  const handleReadMore = (recipe: any) => {
    setSelectedRecipe(recipe);
  };

  const closePopUp = () => {
    setSelectedRecipe(null);
  };

  return (
    <div>
      <div className={styles.header}>
        <Select
          isMulti
          options={categoryOptions}
          className="category-select"
          placeholder="Select categories"
          onChange={handleCategoryChange}
          value={categoryOptions.filter(option =>
            selectedCategories.includes(option.value)
          )}
        />

        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <button
          className={styles.addRecipeButton}
          onClick={() => router.push("/recipes/new")}
        >
          Add Recipe
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setShowFavorites(false)}
          className={!showFavorites ? styles.active : ""}
        >
          All Recipes
        </button>
        <button
          onClick={() => setShowFavorites(true)}
          className={showFavorites ? styles.active : ""}
        >
          Favorites
        </button>
      </div>

      <div className={styles.recipeGrid}>
        {recipes.map((recipe) => (
          <Card
            key={recipe.id}
            imageUrl={recipe.imageUrl}
            mealName={recipe.mealName}
            category={recipe.category}
            isFavorite={favorites.includes(recipe.id)}
            onReadMore={() => handleReadMore(recipe)}
            onFavoriteToggle={() => handleToggleFavorite(recipe.id)}
          />
        ))}
      </div>

      {selectedRecipe && (
        <PopUpCard
          imageUrl={selectedRecipe.imageUrl}
          mealName={selectedRecipe.mealName}
          category={selectedRecipe.category}
          ingredients={selectedRecipe.ingredients}
          instructions={selectedRecipe.instructions}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onClose={closePopUp}
          onFavoriteToggle={() => handleToggleFavorite(selectedRecipe.id)}
        />
      )}

      <div className={styles.pagination}>
        {`1-${recipes.length} of ${recipes.length}`}
      </div>
    </div>
  );
};

export default RecipePage;
