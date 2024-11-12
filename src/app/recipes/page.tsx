"use client";
import React, { useState, useEffect , CSSProperties } from 'react';
import Select, { MultiValue } from 'react-select';
import InfiniteScroll from "react-infinite-scroll-component";
import styles from './page.module.css';
import BeatLoader from "react-spinners/BeatLoader";
import Card from '@/components/Card/Card';
import PopUpCard from '@/components/PopUpCard/PopUpCard';
import http from '@/services/http';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { getFavorites, toggleFavorite as toggleFavoriteInLS } from '@/services/localStorage';
import { getRecipes } from '@/services/recipes.ts';

const PAGE_SIZE = 10;
const override: CSSProperties = {
  display: "block",
  margin: "auto"
};

const poppins = Poppins({
  weight: ['300','400', '500', '600', '700'], 
  subsets: ['latin'],
  display: 'swap', 
});

const RecipePage = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<null | any>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  


  const router = useRouter();

  //Fetch all recipes and categories when the component mounts
  useEffect(() => {
    fetchCategories();
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    if (showFavorites) {
      fetchFavoriteRecipes();
    } else {
      fetchRecipes(false);
    }
  }, [showFavorites,favorites,searchQuery, selectedCategories]);

  const fetchRecipes = async (more: boolean) => {
    try {
      const currentPage = more ? page+1 : 1;
      const response = await getRecipes(selectedCategories, searchQuery, currentPage, PAGE_SIZE);
      if (response.length === 0) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      const recipesWithId = response.map((recipe: any) => ({
        ...recipe,
        id: recipe._id,
      }));
      if (more) {
        setRecipes(prevState => [...prevState, ...recipesWithId]);
        setPage(page + 1);
      }
      else {
        setRecipes(recipesWithId);
        setPage(1);
      }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
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
    <div className={poppins.className}>
      <h1 className={styles.pagetitle}>Recipes</h1>
      <div className={styles.header}>
        <Select
          isMulti
          options={categoryOptions}
          className={`${styles.categorySelect} category-select`} /* Updated class */
          placeholder="Pick a Category"
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
          className={styles.headerInput}
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
          onClick={() =>  setShowFavorites(false)}
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

      <InfiniteScroll
        dataLength={recipes.length}
        next={()=>{fetchRecipes(true)}}
        hasMore={hasMore}
        loader={<BeatLoader
          color={'#6200ea'}
          cssOverride={override}
        />}
        endMessage={!showFavorites&&
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >

        <div className={styles.recipeGrid}>
          {recipes.map((recipe, index) => (
            <Card
              key={index}
              imageUrl={recipe.imageUrl}
              mealName={recipe.mealName}
              category={recipe.category}
              isFavorite={favorites.includes(recipe.id)}
              onReadMore={() => handleReadMore(recipe)}
              onFavoriteToggle={() => handleToggleFavorite(recipe.id)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default RecipePage;
