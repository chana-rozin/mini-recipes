import React, { useState } from 'react'
import styles from './RecipesContent.module.css'
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";
import Card from '@/components/Card/Card';
import PopUpCard from '@/components/PopUpCard/PopUpCard';
import Recipe from '@/types/Recipe';


interface RecipesContentProps {
    recipes: Recipe[],
    fetchRecipes: (more: boolean) => Promise<void>,
    isFavorite: (id: string) => boolean,
    handleToggleFavorite: (recipe: Recipe) => void,
    setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>,
    showFavorites: boolean,
    hasMore: boolean,
}

const RecipesContent: React.FC<RecipesContentProps> = ({ recipes, fetchRecipes, isFavorite, handleToggleFavorite, setShowFavorites, showFavorites, hasMore }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<null | Recipe>(null);

    const handleReadMore = (recipe: Recipe) => {
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
                    id={selectedRecipe.id}
                    imageUrl={selectedRecipe.imageUrl}
                    mealName={selectedRecipe.mealName}
                    category={selectedRecipe.category}
                    ingredients={selectedRecipe.ingredients}
                    instructions={selectedRecipe.instructions}
                    isFavorite={isFavorite(selectedRecipe.id)}
                    onClose={closePopUp}
                    onFavoriteToggle={() => handleToggleFavorite(selectedRecipe)}
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
                            isFavorite={isFavorite(recipe?.id || '')}
                            onReadMore={() => handleReadMore(recipe)}
                            onFavoriteToggle={() => handleToggleFavorite(recipe)}
                        />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    )
}

export default RecipesContent;
