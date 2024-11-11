"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';
import './form.css';
import { useRouter } from 'next/navigation';
import http from '@/services/http'; 

const recipeSchema = z.object({
  mealName: z.string().min(1, 'Meal name is required'),
  category: z.array(z.string().min(1, 'Category is required')),
  imageUrl: z.string().url('Please enter a valid URL'),
  instructions: z.string().min(1, 'Instructions are required'),
  ingredients: z.array(z.string().min(1, 'Ingredient cannot be empty')),
});

function AddRecipePage() {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(recipeSchema),
  });
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const router = useRouter();

  // Fetch categories from the API
  useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await http.get('/categories');
          
          const categories = response.data.data.documents;
          
          const options = categories.map((category: any) => ({
            value: category.name,
            label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
          }));
          
          setCategoryOptions(options);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
    
      fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const response = await http.post('/recipes', data);
      console.log('Recipe added successfully', response.data);
      router.push('/recipes');  // Redirect to the recipes list page after submission
    } catch (error) {
      console.error('Error adding recipe', error);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => router.push('/recipes')}>← Back</button>
      <h2 className="title">Add Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="recipe-form">
        <div className="form-group">
          <input {...register('mealName')} placeholder="Meal name" className="input" />
          {errors.mealName?.message && (
            <span className="error">{typeof errors.mealName.message === 'string' ? errors.mealName.message : 'Invalid input'}</span>
          )}        
        </div>
        <div className="form-group">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={categoryOptions}
              className="category-select"
              placeholder="Select categories"
              onChange={(selectedOptions: any) =>
                field.onChange(selectedOptions.map((option: any) => option.value))
              } 
              value={categoryOptions.filter(option =>
                field.value ? field.value.includes(option.value) : false
              )} 
            />
          )}
        />

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
            <div key={index} className="ingredient-group">
              <input
                {...register(`ingredients.${index}`)}
                placeholder="Ingredient"
                className="input"
              />
              {index === ingredients.length - 1 ? (
                <button type="button" onClick={addIngredient} className="add-button">+</button>
              ) : (
                <button type="button" onClick={() => removeIngredient(index)} className="remove-button">-</button>
              )}
            </div>
          ))}
          {errors.ingredients && (
            <span className="error">
              {typeof errors.ingredients.message === 'string' ? errors.ingredients.message : 'Invalid input'}
            </span>
          )}        
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
