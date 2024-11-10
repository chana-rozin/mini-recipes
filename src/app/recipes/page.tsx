"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Card from '@/components/Card/Card';
import sampleRecipes from '../../services/staticData';
import { useRouter } from 'next/navigation';
import PopUpCard from '@/components/PopUpCard/PopUpCard';  // Import PopUpCard
import http from '@/services/http'; 

const RecipePage = () => {
const [recipes, setRecipes] = useState<any[]>([]);  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<null | any>(null); // Manage selected recipe for popup

  const router = useRouter();

 // Fetch data from the server
 useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await http.get('/recipes'); // Adjust the URL to match your API route
        setRecipes(response.data); // Set the recipes data
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);
/*
  // Fetch categories based on your data
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(recipes.flatMap(recipe => recipe.category)));
    setCategories(uniqueCategories);
  }, [recipes]);

  /*useEffect(() => {
    let filtered = recipes;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(recipe =>
        recipe.category.some(cat => selectedCategories.includes(cat))
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.mealName.toLowerCase().includes(searchQuery.toLowerCase()) // Adjusted to use mealName
      );
    }

    if (showFavorites) {
      filtered = filtered.filter(recipe => favorites.includes(recipe.id));
    }

    setFilteredRecipes(filtered);
  }, [recipes, selectedCategories, searchQuery, showFavorites, favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter(favId => favId !== id)
        : [...prevFavorites, id]
    );
  };*/

  const handleReadMore = (recipe: any) => {
    setSelectedRecipe(recipe); // Set selected recipe for popup
  };

  const closePopUp = () => {
    setSelectedRecipe(null); // Close popup by resetting selectedRecipe
  };

  return (
    <div>
      <div className={styles.header}>
        <select
          multiple
          onChange={(e) =>
            setSelectedCategories(Array.from(e.target.selectedOptions, (option) => option.value))
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

        <button className={styles.addRecipeButton} onClick={() => router.push('/recipes/new')}>Add Recipe</button>
      </div>

      <div className={styles.tabs}>
        <button onClick={() => setShowFavorites(false)}>All Recipes</button>
        <button onClick={() => setShowFavorites(true)}>Favorites</button>
      </div>

      <div className={styles.recipeGrid}>
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            imageUrl={recipe.imageUrl}
            mealName={recipe.mealName} // Updated to use mealName
            category={recipe.category}
            isFavorite={favorites.includes(recipe.id)}
            onReadMore={() => handleReadMore(recipe)} // Pass recipe data to handleReadMore
            onFavoriteToggle={() =>{}}
          />
        ))}
      </div>

      {selectedRecipe && (
        <PopUpCard
          mealName={selectedRecipe.mealName} // Pass mealName to PopUpCard
          category={selectedRecipe.category}
          ingredients={selectedRecipe.ingredients}
          instructions={selectedRecipe.instructions}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onClose={closePopUp} // Pass closePopUp function to PopUpCard
        />
      )}

      <div className={styles.pagination}>
        {`1-${filteredRecipes.length} of ${filteredRecipes.length}`}
      </div>
    </div>
  );
};

export default RecipePage;
