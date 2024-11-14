import React, { useState } from 'react'
import styles from './RecipesContent.module.css'
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";
import Card from '@/components/Card/Card';
import PopUpCard from '@/components/PopUpCard/PopUpCard';


interface RecipesContentProps {
    recipes: any[],
    fetchRecipes: (more: boolean) => Promise<void>,
    favorites: string[],
    handleToggleFavorite: (id: string) => void,
    setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>,
    showFavorites: boolean,
    hasMore: boolean,
}

const RecipesContent: React.FC<RecipesContentProps> = ({ recipes, fetchRecipes, favorites, handleToggleFavorite ,setShowFavorites ,showFavorites,hasMore}) => {
    const [selectedRecipe, setSelectedRecipe] = useState<null | any>(null);

    const handleReadMore = (recipe: any) => {
        setSelectedRecipe(recipe);
    };

    const closePopUp = () => {
    setSelectedRecipe(null);
    };
    
    return (
        <div>
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
    )
}

export default RecipesContent;
