"use client";

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './page.module.css';
import Card from '@/components/Card/Card';
import PopUpCard from '@/components/PopUpCard/PopUpCard';
import http from '@/services/http';
import { useRouter } from 'next/navigation';

const RecipePage = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<null | any>(null);

  const router = useRouter();

  // Fetch data from the server
  useEffect(() => {

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

    fetchRecipes();
    fetchCategories();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await http.get("/recipes");
      console.log("before", response.data);
      const recipesWithId = response.data.map((recipe: any) => ({
        ...recipe,
        id: recipe._id, // Map _id to id
      }));
      setRecipes(recipesWithId);
      console.log("after", recipesWithId);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    const fetchRecipesByCategory = async (selectedCategories: string[]) => {
      try {
        const response = await http.get(`/recipes?category=${selectedCategories.join(',')}`);
        const recipesWithId = response.data.map((recipe: any) => ({
          ...recipe,
          id: recipe._id, // Map _id to id
        }));
        setRecipes(recipesWithId);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    if (selectedCategories.length > 0) {
      console.log('fetchRecipesByCategory');
      fetchRecipesByCategory(selectedCategories);
    } else
      fetchRecipes();


    if (searchQuery) {
      console.log('searchQuery');
    }

  }, [ selectedCategories, searchQuery]);

  const toggleFavorite = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
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
          onChange={(selectedOptions) =>
            setSelectedCategories(selectedOptions ? selectedOptions.map(option => option.value) : [])
          }
          value={categoryOptions.filter(option =>
            selectedCategories.includes(option.value)
          )}
        />

        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
            onFavoriteToggle={() => toggleFavorite(recipe.id)}
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
        />
      )}

      <div className={styles.pagination}>
        {`1-${recipes.length} of ${recipes.length}`}
      </div>
    </div>
  );
};

export default RecipePage;
