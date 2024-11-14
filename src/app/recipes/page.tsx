"use client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { MultiValue } from 'react-select';
import RecipesContent from '../../components/RecipesContent/RecipesContent'
import RecipesHeader from '@/components/RecipesHeader/RecipesHeader';
import { Poppins } from 'next/font/google';
import { getFavorites, toggleFavorite as toggleFavoriteInLS } from '@/services/localStorage';
import { getRecipes, getRecipe } from '@/services/recipes';
import { getCategories } from '@/services/categories';
import { useDebouncedCallback } from 'use-debounce';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchDebounced = useDebouncedCallback(value => { setSearchQuery(value);},1500);

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
      if (response.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      recipesWithId = response.map((recipe: any) => ({
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


    } catch (error: any) {
      toast.error(`Error fetching recipes: ${error.message}`);
    }
  };

  const fetchFavoriteRecipes = async () => {
    try {
      const favoriteRecipes = await Promise.all(
        favorites.map((favoriteId) =>
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
      const categories = await getCategories();
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
    searchDebounced(e.target.value)
  };

  const handleCategoryChange = (selectedOptions: MultiValue<{ value: string; label: string; }>) => {
    const categories = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedCategories(categories); // Set selected categories and clear search query
  };

  const handleToggleFavorite = (id: string) => {
    const updatedFavorites = toggleFavoriteInLS(id);
    setFavorites(updatedFavorites);
  };



  return (
    <div className={poppins.className}>
      <RecipesHeader categoryOptions={categoryOptions} selectedCategories={selectedCategories} searchQuery={searchQuery} handleCategoryChange={handleCategoryChange} handleSearchChange={handleSearchChange}/>
      <RecipesContent recipes={recipes} fetchRecipes={fetchRecipes} favorites={favorites} handleToggleFavorite={handleToggleFavorite} setShowFavorites={setShowFavorites} showFavorites={showFavorites} hasMore={hasMore} />
      <ToastContainer />
    </div>
  );
};

export default RecipePage;
