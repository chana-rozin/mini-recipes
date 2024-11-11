"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Card from "@/components/Card/Card";
import PopUpCard from "@/components/PopUpCard/PopUpCard";
import http from "@/services/http";
import { useRouter } from "next/navigation";

const RecipePage = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<null | any>(null);

  const router = useRouter();

  // Fetch data from the server
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await http.get("/recipes");
        const recipesWithId = response.data.documents.map((recipe: any) => ({
          ...recipe,
          id: recipe._id, // Map _id to id
        }));
        setRecipes(recipesWithId);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // Fetch categories based on your data
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(recipes.flatMap((recipe) => recipe.category))
    );
    setCategories(uniqueCategories);
  }, [recipes]);

  useEffect(() => {
    let filtered = recipes;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.category.some((cat: string) => selectedCategories.includes(cat))
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((recipe) =>
        recipe.mealName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (showFavorites) {
      filtered = filtered.filter((recipe) => favorites.includes(recipe.id));
    }

    setFilteredRecipes(filtered);
  }, [recipes, selectedCategories, searchQuery, showFavorites, favorites]);

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
        <select
          multiple
          onChange={(e) =>
            setSelectedCategories(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

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
        {filteredRecipes.map((recipe) => (
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
          mealName={selectedRecipe.mealName}
          category={selectedRecipe.category}
          ingredients={selectedRecipe.ingredients}
          instructions={selectedRecipe.instructions}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onClose={closePopUp}
        />
      )}

      <div className={styles.pagination}>
        {`1-${filteredRecipes.length} of ${filteredRecipes.length}`}
      </div>
    </div>
  );
};

export default RecipePage;
