"use client";
import React, { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import InfiniteScroll from "react-infinite-scroll-component";
import styles from './page.module.css';
import Card from '@/components/Card/Card';
import PopUpCard from '@/components/PopUpCard/PopUpCard';
import http from '@/services/http';
import { useRouter } from 'next/navigation';
import { getFavorites, toggleFavorite as toggleFavoriteInLS } from '@/services/localStorage';
import { debuglog } from 'util';
const PAGE_SIZE = 6;

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

  // Fetch all recipes and categories when the component mounts
  useEffect(() => {
    fetchCategories();
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    if (showFavorites) {
      fetchFavoriteRecipes();  // Fetch favorite recipes when showing favorites
    } else {
      fetchRecipes(false);  // Fetch all recipes when not showing favorites
    }
  }, [showFavorites, favorites]);

  const fetchRecipes = async (more:boolean=true) => {
    console.log("Fetching recipes");
    try {
      const currentPage=more?page:1;
      const response = await http.get(`/recipes?category=${selectedCategories.join(", ")}&search=${searchQuery}&page=${currentPage}&pageSize=${PAGE_SIZE}`);
      if (response.data.length === 0) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      const recipesWithId = response.data.map((recipe: any) => ({
        ...recipe,
        id: recipe._id,
      }));
      if(more){
        setRecipes(prevState => [...prevState,...recipesWithId]);   
        setPage(page + 1);
      }
      else{
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

  useEffect(() => { fetchRecipes(false) }, [searchQuery, selectedCategories]);

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
    <div>
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
        next={fetchRecipes}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        >
          
        <div className={styles.recipeGrid}>
          {recipes.map((recipe,index) => (
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

      {/* <div className={styles.pagination}>
        {`1-${recipes.length} of ${recipes.length}`}
      </div> */}
    </div>
  );
};

export default RecipePage;
