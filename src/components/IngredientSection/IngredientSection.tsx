import { FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form';
import styles from './IngredientSection.module.css';

interface IngredientSectionProps {
    ingredients: string[];
    setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

function IngredientSection({ ingredients, setIngredients, register, errors }: IngredientSectionProps) {
    const addIngredient = () => setIngredients([...ingredients, ""]);
    const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

    return (
        <div className={styles.container}>
            {ingredients.map((_, index) => (
                <div key={index} className={styles.group}>
                    <input
                        {...register(`ingredients.${index}`)}
                        placeholder="Ingredient"
                        className={styles.input}
                    />
                    <button
                        type="button"
                        onClick={() =>
                            index === ingredients.length - 1 ? addIngredient() : removeIngredient(index)
                        }
                        className={styles.plusMinusButton}
                    >
                        {index === ingredients.length - 1 ? "+" : "-"}
                    </button>
                </div>
            ))}
            {errors.ingredients && <span className={styles.error}>{String(errors.ingredients.message)}</span>}
        </div>
    );
}

export default IngredientSection;
