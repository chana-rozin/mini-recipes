const FAVORITES_KEY = 'favoriteRecipes';

export const getFavorites = (): string[] => {
  const storedFavorites = localStorage.getItem(FAVORITES_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

export const saveFavorites = (favorites: string[]): void => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const toggleFavorite = (id: string): string[] => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.includes(id)
    ? favorites.filter((favId) => favId !== id)
    : [...favorites, id];
  saveFavorites(updatedFavorites);
  return updatedFavorites;
};

export const storeRecipes = (data: {recipes:{}[], url:string}) => {
  localStorage.setItem('recipes', JSON.stringify({
    url: data.url,
    data: data.recipes,
    storedTime: Date.now()
  }));
}

export const getStoredRecipes = (): {
  url: string,
  data: {}[],
  storedTime: number} | null => {
  const storedRecipes = localStorage.getItem('recipes');
  return storedRecipes ? JSON.parse(storedRecipes) : null;
};
