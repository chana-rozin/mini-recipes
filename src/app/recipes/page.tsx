// RecipePage.tsx
"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Card from '@/components/Card/Card';
import sampleRecipes from '../../services/staticData';
import { useRouter } from 'next/navigation';
import PopUpCard from '@/components/PopUpCard/PopUpCard';  // Import PopUpCard

const RecipePage = () => {
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState(sampleRecipes);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<null | any>(null); // Manage selected recipe for popup

  const router = useRouter();

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
            name={recipe.name}
            category={recipe.category}
            description={recipe.description}
            isFavorite={favorites.includes(recipe.id)}
            onReadMore={() => handleReadMore(recipe)} // Pass recipe data to handleReadMore
            onFavoriteToggle={() => toggleFavorite(recipe.id)}
          />
        ))}
      </div>

      {selectedRecipe && (
        <PopUpCard
          mealName={selectedRecipe.name}
          category={selectedRecipe.category}
          ingredients={selectedRecipe.ingredients}
          instructions={selectedRecipe.instructions}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onClose={closePopUp} // Pass closePopUp function to PopUpCard
        />
      )}

      <div className={styles.pagination}>1-10 of {filteredRecipes.length}</div>
    </div>
  );
};

export default RecipePage;
