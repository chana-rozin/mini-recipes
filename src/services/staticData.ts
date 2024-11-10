export type Recipe = {
  id: number;            // Added the 'id' field
  mealName: string;      // Updated field name
  category: string[];    // Category is still an array of strings
  ingredients: string[]; // Ingredients is now an array of strings
  instructions: string;  // Instructions as a string
  isFavorite: boolean;   // Favorite status
  imageUrl: string;      // Added imageUrl field
};

const sampleRecipes: Recipe[] = [
  {
    id: 1,  // Added the 'id' field
    mealName: 'Spaghetti Bolognese',  // Updated field name
    category: ['Pasta'],  // Category is now an array
    ingredients: ['Spaghetti', 'Ground Beef', 'Tomato Sauce', 'Garlic', 'Onion'],  // Example ingredients
    instructions: 'Cook spaghetti. Prepare sauce by frying beef with garlic and onion, then add tomato sauce and simmer.',  // Example instructions
    isFavorite: false,  // Favorite status
    imageUrl: 'https://via.placeholder.com/150',  // Added imageUrl
  },
  {
    id: 2,  // Added the 'id' field
    mealName: 'Chicken Caesar Salad',  // Updated field name
    category: ['Salad'],  // Category is now an array
    ingredients: ['Lettuce', 'Grilled Chicken', 'Caesar Dressing', 'Croutons'],  // Example ingredients
    instructions: 'Toss lettuce, grilled chicken, croutons, and Caesar dressing together.',  // Example instructions
    isFavorite: true,  // Favorite status
    imageUrl: 'https://via.placeholder.com/150',  // Added imageUrl
  },
  {
    id: 3,  // Added the 'id' field
    mealName: 'Margherita Pizza',  // Updated field name
    category: ['Pizza'],  // Category is now an array
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],  // Example ingredients
    instructions: 'Spread sauce on pizza dough, add mozzarella and basil, and bake until golden.',  // Example instructions
    isFavorite: false,  // Favorite status
    imageUrl: 'https://via.placeholder.com/150',  // Added imageUrl
  },
  // Add more recipes as needed
];

export default sampleRecipes;
