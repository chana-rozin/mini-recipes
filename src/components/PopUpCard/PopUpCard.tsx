import { useState } from 'react';
import styles from './PopUpCard.module.css';

interface PopUpCardProps {
    imageUrl: string;
    mealName: string;
    category: string[];
    ingredients: string[];
    instructions: string;
    isFavorite: boolean;
    onClose: () => void;
}

const PopUpCard: React.FC<PopUpCardProps> = ({ imageUrl, mealName, category, ingredients, instructions, isFavorite, onClose }) => {
    const [favorite, setFavorite] = useState(isFavorite);

    const toggleFavorite = () => {
        setFavorite(!favorite);
    };

    return (
        <div className={styles.popupContainer}>
            <div className={styles.closeButton} onClick={onClose}>
                ×
            </div>
            <div className={styles.card}>
                <img src={imageUrl} alt={`${mealName}'s image`} />
                <h2 className={styles.mealName}>{mealName}</h2>
                <div className={styles.category}>
                    <span>Categories: </span>{category}
                </div>
                <div className={styles.favorite} onClick={toggleFavorite}>
                    {favorite ? '★' : '☆'} {/* Full or hollow star */}
                </div>
                <div className={styles.ingredients}>
                    <h3 className={styles.h3}>Ingredients</h3>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.instructions}>
                    <h3 className={styles.h3}>Instructions</h3>
                    <p>{instructions}</p>
                </div>
            </div>
        </div>
    );
};

export default PopUpCard;
