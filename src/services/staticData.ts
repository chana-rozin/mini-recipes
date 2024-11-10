export type Recipe = {
    id: number;
    imageUrl: string;
    name: string;
    category: string;
    description: string;
    isFavorite: boolean;
  };
  
  const sampleRecipes: Recipe[] = [
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Spaghetti Bolognese',
      category: 'Pasta',
      description: 'A classic Italian dish with rich, meaty sauce.',
      isFavorite: false,
    },
    {
      id: 2,
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Chicken Caesar Salad',
      category: 'Salad',
      description: 'Fresh lettuce with grilled chicken and Caesar dressing.',
      isFavorite: true,
    },
    {
      id: 3,
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Margherita Pizza',
      category: 'Pizza',
      description: 'Classic pizza with fresh basil and mozzarella.',
      isFavorite: false,
    },
    // Add more recipes as needed
  ];
  
  export default sampleRecipes;
  