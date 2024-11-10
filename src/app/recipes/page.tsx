"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Card from '@/components/Card/Card';
import sampleRecipes from '../../services/staticData';

// Main Page Component
const RecipePage = () => {
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState(sampleRecipes);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(sampleRecipes.map(recipe => recipe.category)));
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    let filtered = recipes;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(recipe => selectedCategories.includes(recipe.category));
    }

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
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
  };

  const handleReadMore = (recipeId: number) => {
    // Placeholder for a "Read More" action, e.g., redirect to recipe details page
    console.log("Read more about recipe ${recipeId}");
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

        <button className={styles.addRecipeButton}>Add Recipe</button>
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
            name={recipe.name}
            category={recipe.category}
            description={recipe.description}
            isFavorite={favorites.includes(recipe.id)}
            onReadMore={() => handleReadMore(recipe.id)}
            onFavoriteToggle={() => toggleFavorite(recipe.id)}
          />
        ))}
      </div>

      <div className={styles.pagination}>1-10 of {filteredRecipes.length}</div>
    </div>
  );
};

export default RecipePage;