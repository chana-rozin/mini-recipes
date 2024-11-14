import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import Recipe from '@/types/Recipe';


type FavoritesState = {
    favorites: Recipe[];
    toggleFavorite: (recipe: Recipe) => void;
    isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            toggleFavorite: (recipe) => {
                const favorites = get().favorites;
                const isAlreadyFavorite = favorites.some((fav) => fav.id === recipe.id);

                const updatedFavorites = isAlreadyFavorite
                    ? favorites.filter((fav) => fav.id !== recipe.id)
                    : [...favorites, recipe];

                set({ favorites: updatedFavorites });
            },
            isFavorite: (id) => get().favorites.some((fav) => fav.id === id),
        }),
        {
            name: 'favorite-recipes', // Key for local storage
        }
    )
);
