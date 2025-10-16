// components/Recipe/RecipeCardSchema.js

import React from 'react';
import PrintButton from './PrintButton';
import ServingAdjuster from './ServingAdjuster';

const RecipeCardSchema = ({ recipe }) => {
  // State for dynamic servings (initial state comes from recipe data)
  const [servings, setServings] = React.useState(recipe.servings);

  // --- Utility Function: Generates the JSON-LD Script for Google ---
  const generateSchema = (recipeData, adjustedServings) => {
    // This is the essential part for Google Rich Snippets
    return {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": recipeData.title,
      "image": [recipeData.featuredImage],
      "author": {
        "@type": "Person",
        "name": "Wendy" 
      },
      "datePublished": recipeData.datePublished,
      "description": recipeData.excerpt,
      "prepTime": recipeData.prepTimeISO, // e.g., "PT20M" for 20 minutes
      "cookTime": recipeData.cookTimeISO, // e.g., "PT45M" for 45 minutes
      "totalTime": recipeData.totalTimeISO,
      "keywords": recipeData.tags.join(', '),
      "recipeYield": `${adjustedServings} servings`, 
      "recipeIngredient": recipeData.ingredients.map(i => i.originalText),
      "recipeInstructions": recipeData.instructions.map(step => ({
        "@type": "HowToStep",
        "text": step.text // e.g., "Preheat oven to 350 degrees..."
      })),
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": "1 serving",
        "calories": recipeData.nutrition.calories // Example
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": recipeData.rating,
        "reviewCount": recipeData.reviewCount
      }
    };
  };

  // --- Visual Component Render ---
  return (
    <div className="recipe-card-wrapper">
      
      {/* 1. Insert the Schema Data into the head of the document */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateSchema(recipe, servings)) 
        }}
      />

      {/* 2. Top Bar: Print and Servings */}
      <div className="card-top-bar">
        <ServingAdjuster 
          initialServings={recipe.servings} 
          onServingsChange={setServings} 
        />
        <PrintButton title={recipe.title} />
      </div>

      {/* 3. Times and Quick Info */}
      <div className="card-quick-stats">
        <div>🕒 Prep: {recipe.prepTime}</div>
        <div>🔥 Cook: {recipe.cookTime}</div>
        <div>🗓️ Total: {recipe.totalTime}</div>
        <div className="category-tag">#{recipe.category}</div>
      </div>
      
      <hr className="divider" />
      
      {/* 4. Ingredients List */}
      <section className="ingredients-section">
        <h2 className="sage-accent-text">Ingredients</h2>
        <ul className="ingredient-list">
          {/* Map ingredients, using a utility to scale them based on 'servings' state */}
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {/* This is where the serving adjustment logic would be applied to the quantity */}
              {/* e.g., {calculateScaledQuantity(ingredient.quantity, recipe.servings, servings)} {ingredient.unit} {ingredient.name} */}
              {ingredient.originalText} 
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Instructions */}
      <section className="instructions-section">
        <h2 className="sage-accent-text">Instructions</h2>
        <ol className="instruction-list">
          {recipe.instructions.map((step, index) => (
            <li key={index}>
              <span className="step-number">{index + 1}.</span> {step.text}
            </li>
          ))}
        </ol>
      </section>
      
      {/* 6. Nutrition (Optional but highly recommended for SEO) */}
      <footer className="nutrition-info">
        <h3>Nutrition (per serving)</h3>
        <p>Calories: {recipe.nutrition.calories}</p>
        <p>Protein: {recipe.nutrition.protein}g</p>
        {/* ... other nutrition facts */}
      </footer>

    </div>
  );
};

export default RecipeCardSchema;