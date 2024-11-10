"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const recipeSchema = z.object({
  mealName: z.string().min(1, 'Meal name is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Please enter a valid URL'),
  instructions: z.string().min(1, 'Instructions are required'),
  ingredients: z.array(z.string().min(1, 'Ingredient cannot be empty')),
});

function AddRecipePage() {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(recipeSchema),
  });
  const [ingredients, setIngredients] = useState<string[]>([]);

  const onSubmit = async (data: any) => {
    // POST request logic here
    console.log(data);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  return (
    <div className="form-container">
      <button className="back-button">← Back</button>
      <h2 className="title">Add Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="recipe-form">
        <div className="form-group">
          <input {...register('mealName')} placeholder="Meal name" className="input" />
          {errors.mealName?.message && (
            <span className="error">{typeof errors.mealName.message === 'string' ? errors.mealName.message : 'Invalid input'}</span>
          )}
        </div>
        <div className="form-group">
          <select {...register('category')} className="input">
            <option value="">Category</option>
            <option value="starter">Starter</option>
            <option value="main">Main</option>
            <option value="dessert">Dessert</option>
          </select>
          {errors.category?.message && (
            <span className="error">{typeof errors.category.message === 'string' ? errors.category.message : 'Invalid input'}</span>
          )}
        </div>
        <div className="form-group">
          <input {...register('imageUrl')} placeholder="Image URL" className="input" />
          {errors.imageUrl?.message && (
            <span className="error">{typeof errors.imageUrl.message === 'string' ? errors.imageUrl.message : 'Invalid input'}</span>
          )}
        </div>
        <div className="form-group">
          {ingredients.map((_, index) => (
            <input
              key={index}
              {...register(`ingredients.${index}`)}
              placeholder="Ingredient"
              className="input"
            />
          ))}
          {errors.ingredients && (
            <span className="error">
              {typeof errors.ingredients.message === 'string' ? errors.ingredients.message : 'Invalid input'}
            </span>
          )}
          <button type="button" onClick={addIngredient} className="add-button">+</button>
        </div>
        <div className="form-group instructions">
          <textarea {...register('instructions')} placeholder="Instructions" className="input" />
          {errors.instructions?.message && (
            <span className="error">{typeof errors.instructions.message === 'string' ? errors.instructions.message : 'Invalid input'}</span>
          )}
        </div>
        <button type="submit" className="submit-button">Add</button>
      </form>
    </div>
  );
}

export default AddRecipePage;
