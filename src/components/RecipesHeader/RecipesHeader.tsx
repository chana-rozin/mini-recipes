import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './RecipesHeader.module.css'
import Select, { MultiValue } from 'react-select';

interface RecipesHeaderProps {
    categoryOptions: { value: string; label: string }[];
    selectedCategories: string[];
    searchQuery: string;
    handleCategoryChange: (selectedOptions: MultiValue<{value: string;label: string;}>) => void;
    handleSearchChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RecipesHeader: React.FC<RecipesHeaderProps> = ({categoryOptions,selectedCategories,searchQuery,handleCategoryChange,handleSearchChange}) => {
    const router = useRouter();


    return (
        <div>
            <h1 className={styles.pagetitle}>Recipes</h1>
            <div className={styles.header}>
                <Select
                    isMulti
                    options={categoryOptions}
                    className={`${styles.categorySelect} category-select`} /* Updated class */
                    placeholder="Pick a Category"
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            width: '100%',
                            padding: '0 10px',
                            height: '36px', // Consistent height
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
                            zIndex: 9999,
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
                    onChange={handleCategoryChange}
                    value={categoryOptions.filter(option =>
                        selectedCategories.includes(option.value)
                    )}
                />

                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={styles.headerInput}
                />

                <button
                    className={styles.addRecipeButton}
                    onClick={() => router.push("/recipes/new")}
                >
                    Add Recipe
                </button>
            </div>


        </div>
    )
}




export default RecipesHeader

