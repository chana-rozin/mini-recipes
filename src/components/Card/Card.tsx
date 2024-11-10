import React from 'react';
import styles from './Card.module.css';

type CardProps = {
  imageUrl: string;
  name: string;
  category: string;
  description: string;
  onReadMore: () => void;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
};

const Card: React.FC<CardProps> = ({ imageUrl, name, category, description, onReadMore, onFavoriteToggle, isFavorite }) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={name} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.category}>{category}</p>
        <p className={styles.description}>{description}...</p>
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