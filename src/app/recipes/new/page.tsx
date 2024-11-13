"use client";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CategorySection from '@/components/CategorySection/CategorySection';
import IngredientSection from '@/components/IngredientSection/IngredientSection';
import styles from './AddRecipePage.module.css';
import { postRecipe } from '@/services/recipes';
import { Poppins } from 'next/font/google';
import { IoCaretBackOutline } from "react-icons/io5";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const recipeSchema = z.object({
  mealName: z.string().min(1, "Meal name is required"),
  category: z.array(z.string().min(1, "Category is required")),
  imageUrl: z.string().url("Please enter a valid URL"),
  instructions: z.string().min(1, "Instructions are required"),
  ingredients: z.array(z.string().min(1, "Ingredient cannot be empty")),
});

function AddForm() {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(recipeSchema),
  });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const response = await postRecipe(data);
      toast.success("Recipe added successfully!", { position: 'top-center' });
      setTimeout(() => { router.push("/recipes"); }, 3000);
    } catch (error: any) {
      toast.error(`Error Adding Recipe: ${error.message}`);
    }
  };

  return (
    <div className={`${poppins.className} ${styles.container}`}>
      <button className={styles.backButton} onClick={() => router.push('/recipes')}>
          <IoCaretBackOutline />
          <span className={styles.backText}>Back</span>
      </button>
      <h2 className={styles.title}>Add Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.group}>
          <input {...register("mealName")} placeholder="Meal name" className={styles.input} />
          {errors.mealName?.message && <span className={styles.error}>{String(errors.mealName.message)}</span>}
        </div>
        
        <CategorySection control={control} errors={errors} />

        <div className={styles.group}>
          <input {...register("imageUrl")} placeholder="Image URL" className={styles.input} />
          {errors.imageUrl?.message && <span className={styles.error}>{String(errors.imageUrl.message)}</span>}
        </div>

        <IngredientSection ingredients={ingredients} setIngredients={setIngredients} register={register} errors={errors} />

        <div className={styles.group}>
          <textarea {...register("instructions")} placeholder="Instructions" className={styles.input} />
          {errors.instructions?.message && <span className={styles.error}>{String(errors.instructions.message)}</span>}
        </div>

        <button type="submit" className={styles.submitButton}>Add</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddForm;
