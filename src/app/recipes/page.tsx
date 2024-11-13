"use client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import InfiniteScroll from "react-infinite-scroll-component";
import styles from './page.module.css';
import BeatLoader from "react-spinners/BeatLoader";
import Card from '@/components/Card/Card';
import PopUpCard from '@/components/PopUpCard/PopUpCard';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { getFavorites, toggleFavorite as toggleFavoriteInLS } from '@/services/localStorage';
import { getRecipes, getRecipe } from '@/services/recipes';
import { getCategories } from '@/services/categories';

const PAGE_SIZE = 10;


const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
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
  }, [showFavorites]);

  useEffect(() => {
    fetchRecipes(false);
    setShowFavorites(false);
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    if (showFavorites) {
      fetchFavoriteRecipes();
    }
  }, [favorites])

  const fetchRecipes = async (more: boolean) => {
    try {
      const currentPage = more ? page + 1 : 1;
      const response = await getRecipes(selectedCategories, searchQuery, currentPage, PAGE_SIZE);
      let recipesWithId: [] = [];
      if (response.length === 0) {
        setHasMore(false);
      }
      else {
        setHasMore(true);
        recipesWithId = response.map((recipe: any) => ({
          ...recipe,
          id: recipe._id,
        }));
      }

      if (more) {
        setRecipes(prevState => [...prevState, ...recipesWithId]);
        setPage(page + 1);
      }
      else {

        setRecipes(recipesWithId);
        setPage(1);
      }


    } catch (error: any) {
      toast.error(`Error fetching recipes: ${error.message}`);
    }
  };

  const fetchFavoriteRecipes = async () => {
    try {
      const favoriteRecipes = await Promise.all(
        favorites.map(favoriteId =>
          getRecipe(favoriteId)
        )
      );
      const recipesWithId = favoriteRecipes.map((recipe: any) => ({
        ...recipe,
        id: recipe._id,
      }));
      setRecipes(recipesWithId);
    } catch (error: any) {
      toast.error(`Error fetching favorite recipes: ${error.message}`);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      const categories = response;
      const options = categories.map((category: any) => ({
        value: category.name,
        label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
      }));
      setCategoryOptions(options);
    } catch (error: any) {
      toast.error(`Error fetching categories: ${error.message}`);
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
          styles={{
            control: (base, state) => ({
              ...base,
              width: '100%',
              padding: '0 10px',
              height: '36px', // Consistent height
              borderColor: state.isFocused ? '#6200ea' : '#ddd',
              borderRadius: '4px',
              boxShadow: state.isFocused ? '0 0 0 2px rgba(98, 0, 234, 0.2)' : '0 3px 8px rgba(0, 0, 0, 0.15)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
            }),
            placeholder: (base) => ({
              ...base,
              color: '#999',
              fontSize: '16px',
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              borderRadius: '4px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            }),
            option: (base, state) => ({
              ...base,
              padding: '10px',
              backgroundColor: state.isSelected ? '#6200ea' : state.isFocused ? '#f2f2f2' : 'white',
              color: state.isSelected ? 'white' : '#333',
              '&:hover': { backgroundColor: '#f2f2f2' },
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: '#6200ea',
              color: 'white',
              borderRadius: '4px',
              padding: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: 'white',
              fontSize: '14px',
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: 'white',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#4e00bc',
                color: 'white',
              },
            }),
          }}
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

      <ToastContainer />

      <InfiniteScroll
        dataLength={recipes.length}
        next={() => { fetchRecipes(true) }}
        hasMore={hasMore}
        loader={!showFavorites &&
          <div className={styles.loaderWrapper}>
            <BeatLoader color="#6200ea" />
          </div>}
        endMessage={!showFavorites &&
          <p style={{ textAlign: 'center' }}>
            {recipes.length === 0 ? <b>Sorry... looks like we found nothing today :(</b> : <b>Yay! You have seen it all :)</b>}
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
