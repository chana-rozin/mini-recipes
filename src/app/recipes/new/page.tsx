"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import "./form.css";
import { useRouter } from "next/navigation";
import http from "@/services/http";

const recipeSchema = z.object({
  mealName: z.string().min(1, "Meal name is required"),
  category: z.array(z.string().min(1, "Category is required")),
  imageUrl: z.string().url("Please enter a valid URL"),
  instructions: z.string().min(1, "Instructions are required"),
  ingredients: z.array(z.string().min(1, "Ingredient cannot be empty")),
});

function AddRecipePage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
  });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const router = useRouter();

  // Fetch categories from the API and set them in state
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await http.get("/categories");
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

  const addNewCategory = async () => {
    if (newCategory.trim() === "") {
      alert("Please enter a category name."); // Shows alert if the input is empty
      return;
    }
  
    try {
      console.log("Adding new category:", newCategory); // Debugging log
      const response = await http.post("/categories", { name: newCategory });
  
      const newOption = {
        value: response.data.data.name,
        label: newCategory.charAt(0).toUpperCase() + newCategory.slice(1),
      };
  
      setCategoryOptions((prevOptions) => [...prevOptions, newOption]);
      setNewCategory("");
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };
  

  const onSubmit = async (data: any) => {
    try {
      const response = await http.post("/recipes", data);
      console.log("Recipe added successfully", response.data);
      router.push("/recipes");
    } catch (error) {
      console.error("Error adding recipe", error);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => router.push("/recipes")}>
        ← Back
      </button>
      <h2 className="title">Add Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="recipe-form">
        <div className="form-group">
          <input
            {...register("mealName")}
            placeholder="Meal name"
            className="input"
          />
          {errors.mealName?.message && (
            <span className="error">{String(errors.mealName.message)}</span>
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
                  field.onChange(
                    selectedOptions.map((option: any) => option.value)
                  )
                }
                value={categoryOptions.filter((option) =>
                  field.value?.includes(option.value)
                )}
              />
            )}
          />
          <button
            type="button"
            className="add-category-button"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
          >
            + Add new category
          </button>
          {isAddingCategory && (
            <div className="new-category-input">
              <input
                type="text"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input"
              />
              <button
                type="button"
                onClick={addNewCategory}
                className="submit-button"
              >
                Save Category
              </button>
            </div>
          )}
          {errors.category?.message && (
            <span className="error">{String(errors.category.message)}</span>
          )}
        </div>
        <div className="form-group">
          <input
            {...register("imageUrl")}
            placeholder="Image URL"
            className="input"
          />
          {errors.imageUrl?.message && (
            <span className="error">{String(errors.imageUrl.message)}</span>
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
                <button
                  type="button"
                  onClick={addIngredient}
                  className="add-button"
                >
                  +
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="remove-button"
                >
                  -
                </button>
              )}
            </div>
          ))}
          {errors.ingredients && (
            <span className="error">{String(errors.ingredients.message)}</span>
          )}
        </div>
        <div className="form-group instructions">
          <textarea
            {...register("instructions")}
            placeholder="Instructions"
            className="input"
          />
          {errors.instructions?.message && (
            <span className="error">{String(errors.instructions.message)}</span>
          )}
        </div>
        <button type="submit" className="submit-button">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddRecipePage;
