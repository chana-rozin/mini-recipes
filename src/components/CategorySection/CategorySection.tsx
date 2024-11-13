import { Controller, Control, FieldErrors } from 'react-hook-form';
import Select, { MultiValue } from 'react-select';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCategories, postCategory } from '@/services/categories';
import styles from './CategorySection.module.css';

interface CategoryOption {
    value: string;
    label: string;
}

interface CategorySectionProps {
    control: Control<any>;
    errors: FieldErrors;
}

function CategorySection({ control, errors }: CategorySectionProps) {
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<string>("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getCategories();
                setCategoryOptions(categories.map((cat: any) => ({
                    value: cat.name,
                    label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
                })));
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
            const response = await postCategory(newCategory);
            console.log(response.name);
            const newOption = {
                value: response.name,
                label: newCategory.charAt(0).toUpperCase() + newCategory.slice(1),
            };

            setCategoryOptions((prevOptions) => [...prevOptions, newOption]);
            setNewCategory("");
            setIsAddingCategory(false);
            toast.success("Category added successfully!", {
                position: 'top-center',
            });

        } catch (error: any) {
            toast.error(`Error Adding Category: ${error.message}`);
        }
    };


    return (
        <div className="">
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <div className={styles.categoriesGroup}>
                        <Select
                            {...field}
                            isMulti
                            options={categoryOptions}
                            placeholder="Select categories"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    width: '100%',
                                    padding: '0 10px',
                                    height: '48px', // Consistent height
                                    borderColor: state.isFocused ? '#6200ea' : '#ddd',
                                    borderRadius: '4px',
                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(98, 0, 234, 0.2)' : '0 3px 8px rgba(0, 0, 0, 0.15)',
                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '16px',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: '#999',
                                    fontSize: '16px',
                                }),
                                menu: (base) => ({
                                    ...base,
                                    borderRadius: '4px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    padding: '10px',
                                    backgroundColor: state.isSelected ? '#6200ea' : state.isFocused ? '#f2f2f2' : 'white',
                                    color: state.isSelected ? 'white' : '#333',
                                    '&:hover': { backgroundColor: '#f2f2f2' },
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#6200ea',
                                    color: 'white',
                                    borderRadius: '4px',
                                    padding: '2px 8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: 'white',
                                    fontSize: '14px',
                                }),
                                multiValueRemove: (base) => ({
                                    ...base,
                                    color: 'white',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#4e00bc',
                                        color: 'white',
                                    },
                                }),
                            }}
                            onChange={(selected: MultiValue<CategoryOption>) =>
                                field.onChange(selected.map((opt) => opt.value))
                            }
                            value={categoryOptions.filter((opt) => field.value?.includes(opt.value))}
                        />
                        <button
                            type="button"
                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                            className={styles.addButton}
                        >
                            +
                        </button>
                    </div>
                )}
            />
            {isAddingCategory && (
                <div className={styles.newCategoryInput}>
                    <input
                        type="text"
                        placeholder="New category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button type="button" className={styles.submitButton} onClick={addNewCategory}>Save</button>
                </div>
            )}
            {errors.category?.message && (
                <span className={styles.error}>{String(errors.category.message)}</span>
            )}
        </div>
    );
}

export default CategorySection;
