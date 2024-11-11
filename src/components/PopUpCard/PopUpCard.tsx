import { useRef, useState } from 'react';
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
    const cardRef = useRef<HTMLDivElement>(null);

    const toggleFavorite = () => {
        setFavorite(!favorite);
    };

    // Handle click outside the card to close the popup
    const handleOutsideClick = (e: React.MouseEvent) => {
        if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div className={styles.popupContainer} onClick={handleOutsideClick}>
            <div className={styles.card} ref={cardRef}>
                <img className={styles.recipe_img} src={imageUrl} alt={`${mealName}'s image`} />
                <div className={styles.body}>
                    <h2 className={styles.mealName}>{mealName}</h2>
                    <div className={styles.heading}>
                        <div className={styles.category}>
                            {category.map(c => (
                                <span className={styles.hashtags} key={c}>#{c} </span>
                            ))}
                        </div>
                        <div className={styles.favorite} onClick={toggleFavorite}>
                            {favorite ? '★' : '☆'} {/* Full or hollow star */}
                        </div>
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
        </div>
    );
};

export default PopUpCard;
