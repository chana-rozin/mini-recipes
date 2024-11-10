import React from 'react';
import styles from './Card.module.css';

type CardProps = {
  imageUrl: string;
  mealName: string;  // Changed name to mealName
  category: string[]; // Category is now an array of strings
  onReadMore: () => void;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
};

const Card: React.FC<CardProps> = ({ imageUrl, mealName, category, onReadMore, onFavoriteToggle, isFavorite }) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={mealName} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.name}>{mealName}</h3>
        <p className={styles.category}>{category.join(', ')}</p> {/* Display multiple categories */}
        <div className={styles.actions}>
          <button onClick={onReadMore} className={styles.readMore}>Read More</button>
          <button onClick={onFavoriteToggle} className={styles.favorite}>
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
