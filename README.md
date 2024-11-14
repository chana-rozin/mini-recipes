
# Recipe Website

This project is a recipe website built using **Next.js** and **React**. It allows users to browse, add, and save favorite recipes with a user-friendly form and category selector. The project integrates MongoDB for data storage and utilizes modern React features for optimal performance and usability.

## Features

- **Add Recipe Form**: Users can add recipes with a form built using **React Hook Form** and **Zod** for validation.
- **Dynamic Category Selector**: A collapsible UI component to select multiple categories, enhancing the user experience.
- **Ingredient Management**: Flexible ingredient input with dynamic '+' and '-' buttons for easy editing.
- **Favorites**: Save favorite recipes locally with **localStorage** for easy access.
- **Responsive Design**: Optimized for various screen sizes to provide a seamless experience across devices.

## Technologies Used

- **Next.js** - for server-side rendering and efficient page routing.
- **React** - for building interactive components.
- **MongoDB** - as a NoSQL database to store recipe data.
- **Axios** - for making API requests.
- **React Hook Form & Zod** - for building and validating forms.
- **CSS Modules / Tailwind CSS** (or any styling library you are using) - for styling the components.

## Project Structure

- **app** - Main folder containing pages and components.
- **services** - Contains `axios` and `localStorage` service files for API and local storage management.
- **api** - API routes in `api/recipes` and `api/categories`.
- **components** - Reusable UI components, including the recipe form, category selector, and recipe list.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipe-website.git
   ```
2. Install dependencies:
   ```bash
   cd recipe-website
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```plaintext
   MONGODB_URI=<Your MongoDB URI>
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Adding Recipes**: Go to the add recipe page and fill in the form. You can select multiple categories, add ingredients, and submit the recipe.
2. **Browsing Recipes**: View all added recipes on the homepage.
3. **Saving Favorites**: Click on a recipe to add it to your favorites list.

## API Endpoints

- **POST `/api/recipes`**: Adds a new recipe.
- **GET `/api/recipes`**: Retrieves all recipes.
- **GET `/api/categories`**: Fetches available categories for the form.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## License

This project is open-source and available under the MIT License.
